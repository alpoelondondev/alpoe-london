import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { WATCH_BRANDS } from "./taxonomy";
import type { Product, WatchBrandSlug } from "./types";
import { IMAGE_MANIFEST } from "./generated/image-manifest";
import { getDescription, getModelOverview, getReferenceResearch } from "./research";

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

async function loadRaw(): Promise<string> {
  try {
    const res = await fetch(CSV_URL, { next: { revalidate: REVALIDATE_SECONDS } });
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

function imagesFor(brandSlug: WatchBrandSlug, reference: string): string[] {
  if (!reference) return [];
  return IMAGE_MANIFEST[`${brandSlug}/${reference.toLowerCase()}`] ?? [];
}

function toItems(rows: string[][]): CatalogueItem[] {
  const items: CatalogueItem[] = [];
  const seen = new Set<string>();

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

    const images = imagesFor(brandSlug, reference);
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
    metaTitle: `${title}${item.reference ? ` ${item.reference}` : ""} | Alpoe London Hatton Garden`,
    metaDescription: description.slice(0, 300),
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
