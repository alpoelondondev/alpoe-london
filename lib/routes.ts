import type {
  JewelleryCategorySlug,
  Product,
  WatchBrandSlug,
} from "./types";

/**
 * Every URL this site serves, named once.
 *
 * ── Why this file exists ──
 *
 * The path to any given page used to be a string literal typed out wherever
 * somebody needed it. `/rings/engagement-and-wedding-rings` appeared in the
 * nav, the footer, the sitemap, three guide pages, the jewellery taxonomy, the
 * service catalogue in the structured data and the page's own canonical — nine
 * independent copies of one fact, none of which knew about the others. That
 * arrangement has exactly one failure mode and it is silent: rename the folder
 * and every copy still compiles, still renders, still links, and every one of
 * them 404s. Next.js does not check href strings against the file tree, so
 * nothing catches it until a person clicks or a crawler reports it.
 *
 * A token cannot be misspelled without the build failing. `ROUTES.jewellery`
 * either exists or the compiler says so, and moving a page becomes an edit to
 * one line here rather than a search-and-replace nobody can prove they
 * finished.
 *
 * ── What belongs here ──
 *
 * Every internal path, including the ones that are not pages: the verify
 * endpoint, the API handlers, /sitemap.xml. If something links to it, it is
 * named here. External URLs (Instagram, TikTok, Google Maps) live in
 * `lib/site.ts` with the rest of the business's identity — they are facts
 * about the company, not the shape of this app.
 *
 * Absolute URLs are still built by `siteUrl()` in `lib/site.ts`. This file
 * deals only in paths; `siteUrl(ROUTES.about)` is the canonical form.
 */

/* ────────────────────────────────────────────────────────────────────────── */
/*  Sitemap weighting                                                         */
/* ────────────────────────────────────────────────────────────────────────── */

export type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export type SitemapWeight = {
  changeFrequency: ChangeFrequency;
  priority: number;
};

/**
 * A route's definition: where it lives, and how it should be advertised.
 *
 * `sitemap: null` is not the same as forgetting to weight a page — it is a
 * decision, and `excludedBecause` makes stating the reason the only way to
 * express it. /ourbrand was built, given metadata and then listed nowhere at
 * all; a registry where omission is invisible is how that happens twice.
 */
type StaticRouteDef = {
  readonly path: `/${string}` | "/";
  readonly sitemap: SitemapWeight | null;
  readonly excludedBecause?: string;
  /**
   * Set only on routes that nothing links to *on purpose*.
   *
   * /ourbrand is why this exists. It was built, given metadata, and then
   * referenced by no link and no sitemap entry — a page that, to a crawler,
   * did not exist. The guard now fails on any token nothing references, so the
   * handful of paths that genuinely have no inbound link have to say why here.
   * A page you simply forgot to link is indistinguishable from one you meant
   * to orphan, unless the intent is written down.
   */
  readonly unlinked?: string;
};

/* ────────────────────────────────────────────────────────────────────────── */
/*  The registry                                                              */
/* ────────────────────────────────────────────────────────────────────────── */

const STATIC_ROUTES = {
  /*
   * The root is "/" and the sitemap must emit it without the trailing slash —
   * see `siteUrl()`, which treats the empty path as the bare origin. Next.js
   * normalises the rendered canonical for this route to the origin whatever it
   * is handed, so the two agree only if this one stays "/".
   */
  home: { path: "/", sitemap: { changeFrequency: "weekly", priority: 1 } },

  // ── Commerce hubs ──
  watches: { path: "/watches", sitemap: { changeFrequency: "weekly", priority: 0.9 } },
  jewellery: { path: "/jewellery", sitemap: { changeFrequency: "weekly", priority: 0.9 } },
  bespoke: { path: "/bespoke", sitemap: { changeFrequency: "monthly", priority: 0.9 } },
  sell: { path: "/sell", sitemap: { changeFrequency: "monthly", priority: 0.8 } },

  // ── Rings ──
  rings: { path: "/rings", sitemap: { changeFrequency: "monthly", priority: 0.8 } },
  engagementAndWeddingRings: {
    path: "/rings/engagement-and-wedding-rings",
    sitemap: { changeFrequency: "monthly", priority: 0.9 },
  },
  readyToShipRings: {
    path: "/rings/ready-to-ship",
    sitemap: { changeFrequency: "weekly", priority: 0.8 },
  },
  ringBuilder: {
    path: "/ring-builder",
    sitemap: { changeFrequency: "monthly", priority: 0.9 },
  },
  ringSizeGuide: {
    path: "/ring-size-guide",
    sitemap: { changeFrequency: "yearly", priority: 0.8 },
  },

  // ── Guides ──
  guides: { path: "/guides", sitemap: { changeFrequency: "monthly", priority: 0.8 } },
  guideWeddingBands: {
    path: "/guides/wedding-bands",
    sitemap: { changeFrequency: "monthly", priority: 0.8 },
  },
  guideHattonGarden: {
    path: "/guides/buying-jewellery-in-hatton-garden",
    sitemap: { changeFrequency: "monthly", priority: 0.8 },
  },
  guideLabGrownDiamonds: {
    path: "/guides/natural-vs-lab-grown-diamonds",
    sitemap: { changeFrequency: "monthly", priority: 0.8 },
  },
  guideProposeInLondon: {
    path: "/guides/where-to-propose-in-london",
    sitemap: { changeFrequency: "monthly", priority: 0.8 },
  },
  guideSellingAWatch: {
    path: "/guides/selling-a-luxury-watch-in-london",
    sitemap: { changeFrequency: "monthly", priority: 0.8 },
  },

  /*
   * The metal guides. Static children of /rings, which is what lets them sit
   * beside the `[shape]` dynamic segment — Next.js allows one dynamic segment
   * per level, and a static path takes precedence over it, the same mechanism
   * that already lets engagementAndWeddingRings and readyToShipRings coexist
   * with the ten shape guides.
   *
   * Weighted with the shape guides at 0.8: same intent, same depth, and metal
   * is the other axis every engagement ring buyer has to decide on.
   */
  platinumEngagementRings: {
    path: "/rings/platinum-engagement-rings",
    sitemap: { changeFrequency: "monthly", priority: 0.8 },
  },
  whiteGoldEngagementRings: {
    path: "/rings/white-gold-engagement-rings",
    sitemap: { changeFrequency: "monthly", priority: 0.8 },
  },
  yellowGoldEngagementRings: {
    path: "/rings/yellow-gold-engagement-rings",
    sitemap: { changeFrequency: "monthly", priority: 0.8 },
  },
  roseGoldEngagementRings: {
    path: "/rings/rose-gold-engagement-rings",
    sitemap: { changeFrequency: "monthly", priority: 0.8 },
  },

  /*
   * The workshop services. Each is work this bench genuinely does and none of
   * them had a page — resizing lived in a paragraph on /hallmarking,
   * remodelling as a card on /rings, and repair only as an option in the
   * /contact dropdown.
   *
   * No valuations page: /sell and /sell/[brand] already hold that intent, and
   * a fourth service page would compete with a spine that already ranks.
   */
  services: { path: "/services", sitemap: { changeFrequency: "monthly", priority: 0.7 } },
  serviceRingResizing: {
    path: "/services/ring-resizing",
    sitemap: { changeFrequency: "monthly", priority: 0.7 },
  },
  serviceJewelleryRepairs: {
    path: "/services/jewellery-repairs",
    sitemap: { changeFrequency: "monthly", priority: 0.7 },
  },
  serviceRingRemodelling: {
    path: "/services/ring-remodelling",
    sitemap: { changeFrequency: "monthly", priority: 0.7 },
  },

  // ── Reference and utility pages ──
  metalPrices: { path: "/metal-prices", sitemap: { changeFrequency: "daily", priority: 0.7 } },
  hallmarking: { path: "/hallmarking", sitemap: { changeFrequency: "yearly", priority: 0.4 } },
  mentorship: { path: "/mentorship", sitemap: { changeFrequency: "monthly", priority: 0.7 } },
  bookAppointment: {
    path: "/book-appointment",
    sitemap: { changeFrequency: "monthly", priority: 0.8 },
  },
  about: { path: "/about", sitemap: { changeFrequency: "monthly", priority: 0.6 } },
  contact: { path: "/contact", sitemap: { changeFrequency: "monthly", priority: 0.6 } },
  ourBrand: { path: "/ourbrand", sitemap: { changeFrequency: "yearly", priority: 0.3 } },

  /*
   * The Birmingham shop.
   *
   * Weighted like a top-level hub rather than an "about"-tier page, because
   * it is the entry point for an entire city the site previously did not
   * mention. "hublot birmingham" alone drew 49 impressions in the three
   * months to 2026-09-19 — the largest non-brand query the site has.
   */
  birmingham: {
    path: "/birmingham",
    sitemap: { changeFrequency: "monthly", priority: 0.9 },
  },

  /*
   * The jewellery half of Birmingham, and the better half of it. The watch
   * pages are capped by stock — one Hublot on the whole site — whereas a
   * commission needs no inventory, so "engagement rings birmingham" is a
   * commercial query this business can answer completely from day one.
   */
  birminghamEngagementRings: {
    path: "/birmingham/engagement-rings",
    sitemap: { changeFrequency: "monthly", priority: 0.85 },
  },

  // ── Deliberately unlisted ──
  search: {
    path: "/search",
    sitemap: null,
    excludedBecause:
      "Carries noindex. Asking a crawler to fetch a URL only to be told not to index it spends the budget twice.",
  },
  ringBuilderVerify: {
    path: "/ring-builder/verify",
    sitemap: null,
    excludedBecause: "Internal verification endpoint for the builder, not a page.",
  },
  apiMetalPrices: {
    path: "/api/metal-prices",
    sitemap: null,
    excludedBecause: "JSON handler.",
  },
  apiSearchIndex: {
    path: "/api/search-index",
    sitemap: null,
    excludedBecause: "JSON handler.",
  },
  robotsTxt: {
    path: "/robots.txt",
    sitemap: null,
    excludedBecause: "Crawl rules, generated by app/robots.ts.",
    unlinked: "Well-known path. Crawlers fetch it directly; nothing links to it.",
  },
  sitemapXml: {
    path: "/sitemap.xml",
    sitemap: null,
    excludedBecause: "The sitemap does not list itself; robots.txt points at it.",
  },
  llmsTxt: {
    path: "/llms.txt",
    sitemap: null,
    excludedBecause: "Static file for assistants.",
    unlinked:
      "Well-known path, fetched directly by assistants. Note the robots.txt " +
      "comment claims the two 'pair' — robots.txt does not actually emit a " +
      "reference to it, and does not need to.",
  },
} as const satisfies Record<string, StaticRouteDef>;

export type RouteToken = keyof typeof STATIC_ROUTES;

/**
 * Any internal path this app can link to.
 *
 * Deliberately `/${string}` rather than the union of the exact literals. The
 * exact-literal version type-checks beautifully in isolation and falls apart
 * the moment two routes meet: `SHOP_LINKS.concat(HOUSE_LINKS)` in the footer
 * became an unassignable union of nineteen single-member object types, because
 * TypeScript had inferred each entry's href as its own literal. Widening to
 * one shared type lets link lists compose while still rejecting the things
 * actually worth rejecting — a bare slug, an absolute URL, an undefined.
 *
 * What catches a wrong route here is the token name, which cannot be
 * misspelled without the build failing, and the guard in
 * scripts/check-routes.mjs, which checks every registered path against the
 * app directory.
 */
export type Route = `/${string}`;

/** Each token's path, all sharing one type so link lists compose. */
type StaticPaths = {
  readonly [K in RouteToken]: Route;
};

const STATIC_PATHS: StaticPaths = Object.fromEntries(
  Object.entries(STATIC_ROUTES).map(([token, def]) => [token, def.path]),
) as unknown as StaticPaths;

/* ────────────────────────────────────────────────────────────────────────── */
/*  Dynamic segments                                                          */
/* ────────────────────────────────────────────────────────────────────────── */

/**
 * The ten diamond-shape guides that live under /rings.
 *
 * Spelled out here, rather than taken as a bare `string`, because /rings is the
 * one place where a static page and a dynamic segment share a level. Six static
 * children now sit beside `[shape]` — the engagement hub, ready-to-ship and the
 * four metal pages — and a static path always wins. Give a shape guide a slug
 * one of them already owns and the guide silently stops rendering while the
 * sitemap goes on advertising it.
 *
 * Declaring the vocabulary in the registry means a new guide fails to compile
 * until its slug is added *here*, next to every static path it could collide
 * with. The guard checks the same thing at build time from the other direction.
 */
export type ShapeGuideSlug =
  | "oval-engagement-rings"
  | "radiant-cut-engagement-rings"
  | "marquise-engagement-rings"
  | "emerald-cut-engagement-rings"
  | "cushion-cut-engagement-rings"
  | "pear-shaped-engagement-rings"
  | "princess-cut-engagement-rings"
  | "round-brilliant-engagement-rings"
  | "asscher-cut-engagement-rings"
  | "heart-shaped-engagement-rings";

/**
 * The parameterised routes, as functions rather than templates.
 *
 * A builder is what makes the segment order checkable. `/watches/:brand/:slug`
 * and `/jewellery/:category/:slug` are the same shape and were assembled by
 * hand at every call site, which is a swap waiting to happen — and a swapped
 * pair produces a URL that looks entirely plausible and resolves to nothing.
 */
const DYNAMIC_ROUTES = {
  /** A watch brand's listing: /watches/rolex */
  watchBrand: (brand: WatchBrandSlug): Route => `/watches/${brand}`,

  /** A model family's listing: /watches/rolex/submariner */
  watchFamily: (brand: WatchBrandSlug, family: string): Route =>
    `/watches/${brand}/${family}`,

  /** A single watch: /watches/rolex/submariner-126610ln */
  watchProduct: (brand: WatchBrandSlug, slug: string): Route =>
    `/watches/${brand}/${slug}`,

  /** A jewellery category's listing: /jewellery/bracelets */
  jewelleryCategory: (category: JewelleryCategorySlug): Route =>
    `/jewellery/${category}`,

  /** A single piece: /jewellery/bracelets/diamond-tennis-bracelet */
  jewelleryProduct: (category: JewelleryCategorySlug, slug: string): Route =>
    `/jewellery/${category}/${slug}`,

  /** A per-brand selling page: /sell/rolex */
  sellBrand: (brand: WatchBrandSlug): Route => `/sell/${brand}`,

  /** A per-brand selling page at the Birmingham counter: /birmingham/sell/rolex */
  birminghamSellBrand: (brand: WatchBrandSlug): Route =>
    `/birmingham/sell/${brand}`,

  /** A brand's watches, at Birmingham: /birmingham/watches/hublot */
  birminghamWatchBrand: (brand: WatchBrandSlug): Route =>
    `/birmingham/watches/${brand}`,

  /** A diamond-shape guide: /rings/oval-engagement-rings */
  ringShape: (shape: ShapeGuideSlug): Route => `/rings/${shape}`,

  /** A search results URL, query included: /search?q=daytona */
  searchFor: (query: string): Route =>
    `${STATIC_PATHS.search}?q=${encodeURIComponent(query)}`,
} as const;

/* ────────────────────────────────────────────────────────────────────────── */
/*  The public surface                                                        */
/* ────────────────────────────────────────────────────────────────────────── */

export const ROUTES = { ...STATIC_PATHS, ...DYNAMIC_ROUTES };

/**
 * Where a product's page lives.
 *
 * Kept here rather than in `lib/products.ts` because it is a routing fact, and
 * the two dynamic product trees are already described above. The `home`
 * fallback is unchanged behaviour: a product with neither a brand nor a
 * category slug has no page of its own to point at.
 */
export function productPath(p: Product): Route {
  if (p.type === "watch" && p.brandSlug) {
    return ROUTES.watchProduct(p.brandSlug, p.slug);
  }
  if (p.type === "jewellery" && p.categorySlug) {
    return ROUTES.jewelleryProduct(p.categorySlug, p.slug);
  }
  return ROUTES.home;
}

/**
 * The static half of the sitemap, derived rather than retyped.
 *
 * The sitemap used to be a hand-kept list of twenty-two `siteUrl("/...")`
 * calls maintained in parallel with the app directory. Deriving it means a new
 * page is listed the moment it is registered, and a page that should not be
 * listed has to say why.
 */
export function staticSitemapRoutes(): { path: string; weight: SitemapWeight }[] {
  const defs: readonly StaticRouteDef[] = Object.values(STATIC_ROUTES);
  const listed: { path: string; weight: SitemapWeight }[] = [];
  for (const def of defs) {
    if (def.sitemap) listed.push({ path: def.path, weight: def.sitemap });
  }
  return listed;
}

/** Every registered static path — used by the route guard in scripts/. */
export function allStaticPaths(): string[] {
  const defs: readonly StaticRouteDef[] = Object.values(STATIC_ROUTES);
  return defs.map((def) => def.path);
}
