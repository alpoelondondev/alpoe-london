import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { WATCH_BRANDS } from "./taxonomy";
import type { Product, WatchBrandSlug } from "./types";
import { IMAGE_MANIFEST, VARIANT_IMAGES } from "./generated/image-manifest";
import { getDescription, getModelOverview, getReferenceResearch } from "./research";
import { truncateForSerp } from "./seo";

// Live "Available to Source" catalogue, driven by the published Google Sheet.
// Columns: Brand, Sub-Collection, Variant / Name, Reference No.
// The sheet holds no images — photos are matched by reference number against the
// build-time IMAGE_MANIFEST (see scripts/gen-image-manifest.mjs).

const CSV_URL =
  process.env.NEXT_PUBLIC_CATALOGUE_CSV_URL ??
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTU-BOtAETP_4U3y1C0g-2Tb4QSFj9GUAWOBddqJeByRQyO0gl5aFVSc8m_9cUtwBN4CdmiLZT1PVGC/pub?output=csv";

// How often the live sheet is re-fetched (seconds). Edits appear within this window.
const REVALIDATE_SECONDS = 600;

const FALLBACK_PATH = join(process.cwd(), "data", "catalogue-fallback.csv");

export type CatalogueItem = {
  id: string;
  brand: string;
  brandSlug: WatchBrandSlug;
  model: string;
  modelSlug: string;
  variant: string;
  reference: string;
  slug: string;
  images: string[];
  hasImages: boolean;
};

export type CatalogueGroup = { model: string; items: CatalogueItem[] };

// Brand name (as typed in the sheet) -> taxonomy slug. Derived from the taxonomy
// so the two never drift apart.
const BRAND_SLUG_BY_NAME = new Map<string, WatchBrandSlug>(
  WATCH_BRANDS.map((b) => [b.name.toLowerCase(), b.slug]),
);

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// Quote-aware CSV parse (the sheet has no embedded commas today, but stay safe if
// a variant name ever gains one).
function parseCsv(raw: string): string[][] {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;
  for (let i = 0; i < raw.length; i++) {
    const ch = raw[i];
    if (inQuotes) {
      if (ch === '"') {
        if (raw[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += ch;
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && raw[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      rows.push(row);
      row = [];
    } else field += ch;
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

/**
 * How long to wait for Google before giving up and using the snapshot.
 *
 * `fetch` has no default timeout, and without one a slow response does not
 * fail — it hangs. During `next build` that turned into real breakage: around
 * 400 watch pages prerender across seven worker processes, each of which pulls
 * the sheet, and Google throttling seven near-simultaneous requests was enough
 * to push individual pages past Next's 60-second prerender deadline. The build
 * retried and eventually completed, but a slower CI machine or a worse day at
 * Google would have failed it outright — for a file we already have a copy of
 * on disk.
 *
 * Eight seconds is far longer than the sheet has ever legitimately taken and
 * far shorter than the deadline it was blowing through.
 */
const SHEET_TIMEOUT_MS = 8_000;

/**
 * One fetch per process, not one per page.
 *
 * Next's own fetch cache should collapse these, but "should" is doing a lot of
 * work across seven workers and several hundred pages, and the failure mode is
 * a build that dies. Holding the promise rather than the result means callers
 * arriving mid-flight await the same request instead of starting another.
 */
let rawPromise: Promise<string> | null = null;

/**
 * Never call Google during `next build`.
 *
 * An 8-second AbortSignal plus per-process memoisation cut the prerender
 * timeouts sharply but did not remove them — they came back on a later run
 * against a different brand, which means the abort is not reliably firing
 * through Next's fetch-cache wrapper, or the stall is not purely in the fetch.
 * Rather than keep guessing at the mechanism, remove the dependency: a build
 * that prerenders ~400 pages should not make several hundred third-party HTTP
 * calls to do it, and we already ship a snapshot of exactly this file.
 *
 * Nothing is lost. Every page carries `revalidate`, so the first request after
 * a deploy refreshes from the live sheet and the snapshot is only ever the
 * starting state. The trade is a few minutes of staleness immediately after a
 * deploy in exchange for a build that cannot be broken by somebody else's
 * server.
 */
function isBuildPhase(): boolean {
  return process.env.NEXT_PHASE === "phase-production-build";
}

async function fetchRaw(): Promise<string> {
  if (isBuildPhase()) return readFileSync(FALLBACK_PATH, "utf8");
  try {
    const res = await fetch(CSV_URL, {
      next: { revalidate: REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(SHEET_TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`sheet fetch failed: ${res.status}`);
    const text = await res.text();
    if (!text.includes(",")) throw new Error("sheet returned unexpected content");
    return text;
  } catch (err) {
    // Never let a sheet hiccup blank the catalogue — fall back to the bundled snapshot.
    console.error("[catalogue] live sheet unavailable, using bundled snapshot:", err);
    return readFileSync(FALLBACK_PATH, "utf8");
  }
}

async function loadRaw(): Promise<string> {
  if (!rawPromise) {
    rawPromise = fetchRaw().catch((err) => {
      // A rejected cached promise would poison every later call, so clear it.
      rawPromise = null;
      throw err;
    });
  }
  return rawPromise;
}

// References are not all filename-safe — Patek uses "5811/1G-001", Cartier
// "WGBB0046". Folding every non-alphanumeric run to a hyphen gives a key that a
// directory name can actually carry. Rolex refs are already alphanumeric, so
// their existing keys are unchanged.
export function referenceKey(reference: string): string {
  return reference
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// One reference, many configurations: a Datejust 126334 covers 21 sheet rows that
// differ only by dial and bracelet. Keying images on the reference alone made all
// 21 show the same photo, so a shared reference resolves through the variant pins
// in data/variant-images.tsv. A row we have no pin for yields no image at all and
// drops to the enquiry list — better a listing with no photo than one wearing
// another variant's dial.
function imagesFor(
  brandSlug: WatchBrandSlug,
  reference: string,
  variant: string,
  shared: boolean,
): string[] {
  if (!reference) return [];
  const refK = referenceKey(reference);
  const all = IMAGE_MANIFEST[`${brandSlug}/${refK}`] ?? [];
  if (!all.length) return [];
  if (!shared) return all;

  const pinned = VARIANT_IMAGES[`${brandSlug}/${refK}/${referenceKey(variant)}`];
  return pinned ? [pinned] : [];
}

function toItems(rows: string[][]): CatalogueItem[] {
  const items: CatalogueItem[] = [];
  const seen = new Set<string>();

  // First pass: which references carry more than one listing. Those are the ones
  // that need a per-variant pin rather than the whole reference's image set.
  const refCounts = new Map<string, number>();
  for (const cols of rows) {
    const brandSlug = BRAND_SLUG_BY_NAME.get((cols[0] ?? "").trim().toLowerCase());
    const reference = (cols[3] ?? "").trim();
    if (!brandSlug || !reference) continue;
    const k = `${brandSlug}/${referenceKey(reference)}`;
    refCounts.set(k, (refCounts.get(k) ?? 0) + 1);
  }

  for (const cols of rows) {
    const brand = (cols[0] ?? "").trim();
    const model = (cols[1] ?? "").trim();
    const variant = (cols[2] ?? "").trim();
    const reference = (cols[3] ?? "").trim();

    const brandSlug = BRAND_SLUG_BY_NAME.get(brand.toLowerCase());
    // Skip header row, brand-divider rows (all-caps single cell), summary and blanks.
    if (!brandSlug) continue;
    if (!model && !variant && !reference) continue;

    const baseSlug = slugify(`${model}-${variant}-${reference}`);
    let slug = baseSlug;
    let n = 2;
    while (seen.has(slug)) slug = `${baseSlug}-${n++}`;
    seen.add(slug);

    const shared = (refCounts.get(`${brandSlug}/${referenceKey(reference)}`) ?? 0) > 1;
    const images = imagesFor(brandSlug, reference, variant, shared);
    items.push({
      id: `cat-${brandSlug}-${slug}`,
      brand,
      brandSlug,
      model,
      modelSlug: slugify(model),
      variant,
      reference,
      slug,
      images,
      hasImages: images.length > 0,
    });
  }
  return items;
}

export async function getWatchCatalogue(): Promise<CatalogueItem[]> {
  const raw = await loadRaw();
  return toItems(parseCsv(raw));
}

export function groupByModel(items: CatalogueItem[]): CatalogueGroup[] {
  const order: string[] = [];
  const map = new Map<string, CatalogueItem[]>();
  for (const item of items) {
    const key = item.model || "Other";
    if (!map.has(key)) {
      map.set(key, []);
      order.push(key);
    }
    map.get(key)!.push(item);
  }
  // Photographed references lead each model group; the sheet's order holds within.
  return order.map((model) => ({
    model,
    items: map.get(model)!.sort((a, b) => Number(b.hasImages) - Number(a.hasImages)),
  }));
}

export async function getBrandCatalogue(
  brandSlug: WatchBrandSlug,
): Promise<{ items: CatalogueItem[]; groups: CatalogueGroup[]; total: number }> {
  const all = await getWatchCatalogue();
  const items = all.filter((i) => i.brandSlug === brandSlug);
  return { items, groups: groupByModel(items), total: items.length };
}

export function catalogueItemUrl(item: CatalogueItem): string {
  return `/watches/${item.brandSlug}/${item.slug}`;
}

// Turn a live-catalogue row into a full Product by layering in verified research
// (specs + exact description) and reference-matched images. Falls back to a plain
// sourced-to-order description when a model has not been researched yet.
export function catalogueItemToProduct(item: CatalogueItem): Product {
  const spec = getReferenceResearch(item.brandSlug, item.reference);
  const description =
    getDescription(item.brandSlug, item.reference, item.variant) ??
    getModelOverview(item.brandSlug, item.modelSlug) ??
    `${item.brand} ${item.model}${item.reference ? ` ${item.reference}` : ""} — authenticated and sourced to order through Alpoe London in Hatton Garden, London.`;

  const title = item.variant
    ? `${item.brand} ${item.model} — ${item.variant}`
    : `${item.brand} ${item.model}${item.reference ? ` ${item.reference}` : ""}`;

  return {
    id: item.id,
    type: "watch",
    brand: item.brand,
    brandSlug: item.brandSlug,
    model: item.model,
    nickname: item.variant || undefined,
    slug: item.slug,
    title,
    description,
    stockState: "sourceable",
    materials: spec?.materials,
    dial: spec?.dial,
    bezel: spec?.bezel,
    caseSize: spec?.caseSize,
    movement: spec?.movement,
    waterResistance: spec?.waterResistance,
    referenceNumber: item.reference || undefined,
    year: spec?.year,
    images: item.images,
    featured: false,
    /*
     * Two duplications used to live on this line and both reached production.
     *
     * The layout's title template already appends "| Alpoe London" to every
     * page, so hard-coding a second brand suffix here shipped ~200 watch pages
     * titled "… | Alpoe London Hatton Garden | Alpoe London" — long past the
     * point Google truncates, with the brand stated twice and the model pushed
     * out of view. And `title` above already ends in the reference whenever
     * there is no variant, so appending it again produced "Submariner 124060
     * 124060". Add the reference only when the variant form left it out.
     */
    metaTitle: item.variant && item.reference ? `${title} ${item.reference}` : title,
    // 300 characters is roughly twice what a SERP shows. Cut on a word.
    metaDescription: truncateForSerp(description),
    placeholder: false,
  };
}

export async function getCatalogueProductsByBrand(
  brandSlug: WatchBrandSlug,
): Promise<Product[]> {
  const { items } = await getBrandCatalogue(brandSlug);
  return items.map(catalogueItemToProduct);
}

export async function getCatalogueProductBySlug(
  brandSlug: WatchBrandSlug,
  slug: string,
): Promise<Product | undefined> {
  const all = await getWatchCatalogue();
  const item = all.find((i) => i.brandSlug === brandSlug && i.slug === slug);
  return item ? catalogueItemToProduct(item) : undefined;
}
