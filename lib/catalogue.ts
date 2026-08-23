import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { WATCH_BRANDS } from "./taxonomy";
import type { Product, WatchBrandSlug } from "./types";
import { IMAGE_MANIFEST, VARIANT_IMAGES } from "./generated/image-manifest";
import { asset } from "./assets";
import { getDescription, getModelOverview, getReferenceResearch } from "./research";
import { truncateForSerp } from "./seo";

// The watch catalogue, read from data/catalogue.csv.
// Columns: Brand, Sub-Collection, Variant / Name, Reference No.
// The sheet holds no images — photos are matched by reference number against the
// build-time IMAGE_MANIFEST (see scripts/gen-image-manifest.mjs).
//
// ── Why this is a file and not a fetch ──
//
// It used to fetch the published Google Sheet with `revalidate: 600`, and fall
// back to a committed snapshot. Three things had already made that fetch
// pointless and one made it harmful.
//
// Pointless: the build phase deliberately never called it (prerendering ~400
// pages should not make several hundred calls to somebody else's server), and
// with the site now fully static there is no revalidation pass either — so in
// production the snapshot WAS the catalogue and the live sheet was a fiction.
//
// Harmful: `dynamicParams` defaults to true, so any URL shaped like a watch
// page but not in generateStaticParams — a stale link, a crawler guessing —
// rendered on demand, and that render called Google. The one path where the
// fetch could still fire was the one where it could only cost us.
//
// So the file is the source, and `pnpm refresh:catalogue` is how the sheet gets
// into it: run it, look at the diff, commit. Editing the sheet no longer
// changes the site without anyone seeing what changed.

const SOURCE_PATH = join(process.cwd(), "data", "catalogue.csv");

const EXTRA_PATH = join(process.cwd(), "data", "catalogue-extra.csv");

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

/** Read once per process — the file cannot change under a running server. */
let raw: string | null = null;

function loadRaw(): string {
  if (raw === null) raw = readFileSync(SOURCE_PATH, "utf8");
  return raw;
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
// shows without a photo — better a listing with no photo than one wearing
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
  if (!shared) return all.map(asset);

  const pinned = VARIANT_IMAGES[`${brandSlug}/${refK}/${referenceKey(variant)}`];
  return pinned ? [asset(pinned)] : [];
}

function rowKey(cols: string[]): string {
  return [cols[0], cols[3], cols[2]].map((c) => referenceKey(c ?? "")).join("/");
}

function withExtraRows(rows: string[][]): string[][] {
  let extra: string[][];
  try {
    extra = parseCsv(readFileSync(EXTRA_PATH, "utf8")).slice(1); // header row
  } catch {
    return rows;
  }
  const seen = new Set(rows.map(rowKey));
  return [...rows, ...extra.filter((cols) => cols.length >= 4 && !seen.has(rowKey(cols)))];
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

/**
 * Kept async though nothing in it awaits: every call site awaits it, and a
 * signature that says "this may go and get something" is the honest one to
 * leave in place for whatever the catalogue is read from next.
 */
export async function getWatchCatalogue(): Promise<CatalogueItem[]> {
  return toItems(withExtraRows(parseCsv(loadRaw())));
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
// one-line description when a model has not been researched yet.
export function catalogueItemToProduct(item: CatalogueItem): Product {
  const spec = getReferenceResearch(item.brandSlug, item.reference);
  const description =
    getDescription(item.brandSlug, item.reference, item.variant) ??
    getModelOverview(item.brandSlug, item.modelSlug) ??
    `${item.brand} ${item.model}${item.reference ? ` ${item.reference}` : ""} — authenticated and in stock at Alpoe London in Hatton Garden, London.`;

  const title = item.variant
    ? `${item.brand} ${item.model} — ${item.variant}`
    : `${item.brand} ${item.model}${item.reference ? ` ${item.reference}` : ""}`;

  /*
   * Two variants of one reference — "Batman – Jubilee" and "Batgirl – Oyster"
   * on 126710BLNR — share the reference's description unless the research
   * file wrote one per variant, and so shipped byte-identical meta
   * descriptions on six pairs of pages. Google reads that as duplicate
   * content and picks one to show. Leading with the title, which carries the
   * variant, makes each snippet its own while saying nothing new.
   */
  const variantSpecific = Boolean(item.variant && spec?.variants?.[item.variant]);
  const snippet = item.variant && !variantSpecific ? `${title}. ${description}` : description;

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
    stockState: "in_stock",
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
    metaDescription: truncateForSerp(snippet),
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
