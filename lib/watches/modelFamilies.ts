import "server-only";
import { RESEARCH } from "../generated/research-index";
import { getWatchesByBrand } from "../products";
import { getCatalogueProductsByBrand, mergeBrandListings, referenceKey } from "../catalogue";
import type { Product, WatchBrandSlug } from "../types";

/**
 * Model-family pages: /watches/rolex/submariner, /watches/patek-philippe/nautilus.
 *
 * ── Why families and not models ──
 *
 * The catalogue names models very finely. Audemars Piguet alone has twenty
 * "models", most with one or two watches each, and Patek's are named by
 * reference ("Nautilus 5726 Annual Calendar"). A page per catalogue model
 * would be dozens of near-empty pages, which is the thin-content pattern this
 * whole exercise exists to get away from. People do not search at that level
 * anyway — they type "rolex submariner london", "royal oak", "patek nautilus" —
 * so a family is a short list of prefixes over the catalogue's model names,
 * and one page covers every watch that matches.
 *
 * ── What keeps these from being doorway pages ──
 *
 * A family is published only when it has at least MIN_WATCHES in stock AND at
 * least one verified overview in data/research/. The overview is real
 * per-model writing that exists nowhere else on the site, and the stock table
 * is real per-reference data. A family with no research (Cartier's Panthère,
 * today) simply has no page until somebody writes it — falling back to a
 * generic sentence would be exactly the page this is designed not to be.
 *
 * Nothing on the page is invented. Every fact comes from the research files
 * or the stock list.
 */

export const MIN_WATCHES = 2;

type FamilyDef = {
  /** URL segment. Must not equal any product slug — asserted at build. */
  slug: string;
  /** How the family is named in a title: "Rolex Submariner for Sale in London". */
  name: string;
  /** Accent-folded slug prefixes matched against the catalogue's model name. */
  prefixes: string[];
};

const FAMILIES: Record<WatchBrandSlug, FamilyDef[]> = {
  rolex: [
    { slug: "submariner", name: "Submariner", prefixes: ["submariner"] },
    { slug: "datejust", name: "Datejust", prefixes: ["datejust"] },
    { slug: "day-date", name: "Day-Date", prefixes: ["day-date"] },
    { slug: "daytona", name: "Daytona", prefixes: ["daytona"] },
    { slug: "gmt-master-ii", name: "GMT-Master II", prefixes: ["gmt-master"] },
    { slug: "sky-dweller", name: "Sky-Dweller", prefixes: ["sky-dweller"] },
    { slug: "yacht-master", name: "Yacht-Master", prefixes: ["yacht-master"] },
  ],
  "audemars-piguet": [
    { slug: "royal-oak", name: "Royal Oak", prefixes: ["royal-oak"] },
    { slug: "code-11-59", name: "Code 11.59", prefixes: ["code-11-59"] },
  ],
  "patek-philippe": [
    { slug: "nautilus", name: "Nautilus", prefixes: ["nautilus"] },
    { slug: "aquanaut", name: "Aquanaut", prefixes: ["aquanaut"] },
    { slug: "calatrava", name: "Calatrava", prefixes: ["calatrava"] },
  ],
  cartier: [
    { slug: "santos", name: "Santos", prefixes: ["santos"] },
    { slug: "tank", name: "Tank", prefixes: ["tank"] },
    { slug: "ballon-bleu", name: "Ballon Bleu", prefixes: ["ballon-bleu"] },
    { slug: "panthere", name: "Panthère", prefixes: ["panthere"] },
  ],
  "richard-mille": [],
  hublot: [],
  omega: [],
  breitling: [],
};

/**
 * Slugify with accents folded first. The catalogue's own slugify does not fold,
 * so "Panthère" becomes "panth-re" in a product URL; matching here has to be
 * insensitive to that or the family would silently miss its own watches.
 */
const fold = (s: string) =>
  s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const matches = (def: FamilyDef, model: string) => {
  const m = fold(model);
  return def.prefixes.some((p) => m.startsWith(p));
};

export type FamilyOverview = { model: string; text: string };

export type PublishedFamily = {
  brandSlug: WatchBrandSlug;
  slug: string;
  name: string;
  products: Product[];
  overviews: FamilyOverview[];
};

const cache = new Map<string, Promise<PublishedFamily[]>>();

async function build(brandSlug: WatchBrandSlug): Promise<PublishedFamily[]> {
  const defs = FAMILIES[brandSlug] ?? [];
  if (!defs.length) return [];

  const all = mergeBrandListings(
    getWatchesByBrand(brandSlug),
    await getCatalogueProductsByBrand(brandSlug),
  );

  const out: PublishedFamily[] = [];
  for (const def of defs) {
    const products = all.filter((p) => p.model && matches(def, p.model));
    if (products.length < MIN_WATCHES) continue;

    // Overviews for the models actually in stock, biggest first, so the lead
    // paragraph describes the watch most of the page is about.
    const stock = new Map<string, number>();
    for (const p of products) stock.set(fold(p.model ?? ""), (stock.get(fold(p.model ?? "")) ?? 0) + 1);
    const overviews = RESEARCH.filter(
      (r) => r.brandSlug === brandSlug && r.modelOverview && matches(def, r.model),
    )
      .sort((a, b) => (stock.get(fold(b.model)) ?? 0) - (stock.get(fold(a.model)) ?? 0))
      .slice(0, 4)
      .map((r) => ({ model: r.model, text: r.modelOverview as string }));

    if (!overviews.length) continue;
    out.push({ brandSlug, slug: def.slug, name: def.name, products, overviews });
  }
  return out;
}

export function getPublishedFamilies(brandSlug: WatchBrandSlug): Promise<PublishedFamily[]> {
  let hit = cache.get(brandSlug);
  if (!hit) {
    hit = build(brandSlug);
    cache.set(brandSlug, hit);
  }
  return hit;
}

export async function getPublishedFamily(
  brandSlug: WatchBrandSlug,
  slug: string,
): Promise<PublishedFamily | undefined> {
  return (await getPublishedFamilies(brandSlug)).find((f) => f.slug === slug);
}

/** The family a single watch belongs to, for its breadcrumb. */
export async function getFamilyForProduct(
  product: Product,
): Promise<PublishedFamily | undefined> {
  if (!product.brandSlug || !product.model) return undefined;
  const families = await getPublishedFamilies(product.brandSlug);
  // A watch can exist both as a curated listing and as a sheet row. The merge
  // keeps the sheet row, so the curated page's slug is not in the family — but
  // it is the same watch, and it should still link up to its family. Match on
  // the reference as well as the slug.
  const ref = product.referenceNumber ? referenceKey(product.referenceNumber) : "";
  return families.find((f) =>
    f.products.some(
      (p) =>
        p.slug === product.slug ||
        (ref && p.referenceNumber && referenceKey(p.referenceNumber) === ref),
    ),
  );
}
