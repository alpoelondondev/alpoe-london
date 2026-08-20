import "server-only";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import type {
  JewelleryCategorySlug,
  Product,
  SearchIndexEntry,
  StockState,
  WatchBrandSlug,
} from "./types";
import { JEWELLERY_CATEGORIES, WATCH_BRANDS } from "./taxonomy";
import { truncateForSerp } from "./seo";

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function parseCsv(raw: string): Record<string, string>[] {
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
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && raw[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.length > 1 || row[0] !== "") rows.push(row);
      row = [];
    } else {
      field += ch;
    }
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  if (!rows.length) return [];
  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).map((r) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      obj[h] = (r[i] ?? "").trim();
    });
    return obj;
  });
}

/**
 * Strip the brand suffix the spreadsheet appends to every `meta_title`.
 *
 * All 117 rows are authored as "Rolex Submariner 41 124060 | Alpoe London
 * Hatton Garden", and the root layout's title template then appends
 * "| Alpoe London" on top — so the tag that shipped read
 * "… | Alpoe London Hatton Garden | Alpoe London". Google renders about 60
 * characters, which meant the visible half of many of these titles was the
 * brand name, twice, and the model number never made it into view.
 *
 * Done here rather than by rewriting the CSV because the CSV is the business's
 * to edit: whoever adds row 118 will follow the pattern of the 117 above it,
 * and this makes that harmless instead of a regression.
 */
function normaliseMetaTitle(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const trimmed = raw.replace(/\s*\|\s*Alpoe London.*$/i, "").trim();
  return trimmed || undefined;
}

function truthy(v: string) {
  return v === "true" || v === "1" || v === "yes";
}

function toProduct(row: Record<string, string>): Product | null {
  const type = row.type === "watch" ? "watch" : row.type === "jewellery" ? "jewellery" : null;
  if (!type) return null;

  const brand = row.brand || undefined;
  const category = row.category || undefined;

  const brandSlug =
    type === "watch" && brand
      ? (WATCH_BRANDS.find((b) => b.name === brand)?.slug as WatchBrandSlug | undefined)
      : undefined;

  const categorySlug =
    type === "jewellery" && category
      ? (JEWELLERY_CATEGORIES.find((c) => c.name === category)?.slug as
          | JewelleryCategorySlug
          | undefined)
      : undefined;

  const stockState: StockState = row.stock_state === "in_stock" ? "in_stock" : "sourceable";

  const images = row.images
    ? row.images.split("|").map((s) => s.trim()).filter(Boolean)
    : [];

  const bracelets = row.bracelets
    ? row.bracelets.split("|").map((s) => s.trim()).filter(Boolean)
    : undefined;

  return {
    id: row.id,
    type,
    brand,
    brandSlug,
    category,
    categorySlug,
    model: row.model || undefined,
    nickname: row.nickname || undefined,
    slug: row.slug || slugify(row.title),
    title: row.title,
    description: row.description,
    stockState,
    materials: row.materials || undefined,
    gemstones: row.gemstones || undefined,
    carat: row.carat || undefined,
    dial: row.dial || undefined,
    caseSize: row.case_size || undefined,
    movement: row.movement || undefined,
    referenceNumber: row.reference_number || undefined,
    year: row.year || undefined,
    condition: row.condition || undefined,
    bracelets,
    images,
    featured: truthy(row.featured),
    metaTitle: normaliseMetaTitle(row.meta_title),
    metaDescription: row.meta_description
      ? truncateForSerp(row.meta_description)
      : undefined,
    placeholder: truthy(row.placeholder),
  };
}

let _products: Product[] | null = null;
function loadAll(): Product[] {
  if (_products) return _products;
  const csvPath = join(process.cwd(), "data", "products.csv");
  const raw = readFileSync(csvPath, "utf8");
  const rows = parseCsv(raw);
  _products = rows
    .map(toProduct)
    .filter((p): p is Product => p !== null && Boolean(p.id && p.slug && p.title));
  return _products;
}

export function getAllProducts(): Product[] {
  return loadAll();
}

// Photography is what separates a piece we can put in front of someone from one
// we source to order, so it drives both the stock filter and the listing order.
export function hasPhotography(p: Pick<Product, "images">): boolean {
  return p.images.length > 0;
}

/** Photographed pieces lead, enquire-now references follow. Pair with a tiebreak. */
export function photosFirst(a: Product, b: Product): number {
  return Number(hasPhotography(b)) - Number(hasPhotography(a));
}

export function getWatches(): Product[] {
  return loadAll().filter((p) => p.type === "watch");
}

export function getJewellery(): Product[] {
  return loadAll().filter((p) => p.type === "jewellery");
}

export function getWatchesByBrand(brandSlug: WatchBrandSlug): Product[] {
  return getWatches().filter((p) => p.brandSlug === brandSlug);
}

export function getJewelleryByCategory(categorySlug: JewelleryCategorySlug): Product[] {
  return getJewellery().filter((p) => p.categorySlug === categorySlug);
}

export function getWatchBySlug(brandSlug: WatchBrandSlug, slug: string): Product | undefined {
  return getWatchesByBrand(brandSlug).find((p) => p.slug === slug);
}

export function getJewelleryBySlug(
  categorySlug: JewelleryCategorySlug,
  slug: string,
): Product | undefined {
  return getJewelleryByCategory(categorySlug).find((p) => p.slug === slug);
}

export function productUrl(p: Product): string {
  if (p.type === "watch" && p.brandSlug) return `/watches/${p.brandSlug}/${p.slug}`;
  if (p.type === "jewellery" && p.categorySlug) return `/jewellery/${p.categorySlug}/${p.slug}`;
  return "/";
}

export function getFeatured(limit = 6): Product[] {
  return loadAll()
    .filter((p) => p.featured)
    .sort(photosFirst)
    .slice(0, limit);
}

export function getRelated(p: Product, limit = 4): Product[] {
  const all = loadAll().filter((x) => x.id !== p.id);
  const sameGroup = all.filter(
    (x) =>
      (p.type === "watch" && x.brandSlug === p.brandSlug) ||
      (p.type === "jewellery" && x.categorySlug === p.categorySlug),
  );
  const rest = all.filter((x) => !sameGroup.includes(x));
  // Keep the same-group-first grouping, but surface photographed pieces within each.
  return [...sameGroup.sort(photosFirst), ...rest.sort(photosFirst)].slice(0, limit);
}

export function buildSearchIndex(): SearchIndexEntry[] {
  return loadAll().map((p) => ({
    id: p.id,
    type: p.type,
    title: p.title,
    brand: p.brand,
    model: p.model,
    category: p.category,
    reference: p.referenceNumber,
    materials: p.materials,
    url: productUrl(p),
  }));
}
