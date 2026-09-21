export const SITE = {
  name: "Alpoe London",
  tagline: "Bespoke diamond pieces and luxury timepieces. London made. Custom to order.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://alpoelondon.com",
  email: "info@alpoelondon.com",
  phone: "+44 7380 401226",
  whatsapp: process.env.NEXT_PUBLIC_WA_NUMBER ?? "+447380401226",
  locale: "en-GB",
  address: {
    streetAddress: "Hatton Garden",
    addressLocality: "London",
    addressRegion: "Greater London",
    addressCountry: "GB",
    postalCode: "EC1N",
  },
  sameAs: [
    "https://www.instagram.com/alpoe",
    "https://www.tiktok.com/@alpoelondon",
  ],
  /**
   * The showroom's real coordinates, in Hatton Garden. Lifted from the map in
   * components/FindUs.tsx, which had been the only place on the site that knew
   * where the business is — the LocalBusiness schema was publishing an address
   * with no `geo` at all, which is one of the stronger signals Google uses to
   * place a business in the local pack.
   */
  geo: { latitude: 51.52045, longitude: -0.10855 },
  /**
   * Monday to Saturday, 10:00–18:00. Sunday closed.
   *
   * Stated in one place because it is stated in two: /book-appointment prints
   * it in prose, and the schema below publishes it as data. Those two drifting
   * apart is exactly the kind of contradiction that costs a local listing its
   * credibility, so they now read from the same constant.
   */
  hours: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "10:00",
    closes: "18:00",
  },
} as const;

/**
 * The shops.
 *
 * This site was single-location until 2026-09-21: one `SITE.address`, one
 * `SITE.geo`, one LocalBusiness node, and "Hatton Garden" written into the
 * copy in 230 places. The Birmingham shop existed the whole time and the site
 * never said so — which is why "hublot birmingham" drew 49 impressions in the
 * three months to 2026-09-19, the largest non-brand query the site has, at
 * position 61 against a page that does not mention the city. One guide was
 * actively telling Birmingham sellers to travel to Hatton Garden.
 *
 * So locations are data now, and the pages that need to vary by city read
 * from here. `SITE.address` and `SITE.geo` stay exactly as they were and
 * still mean London: they are the primary location, the 230 call sites that
 * assume London are correct about London, and rewriting them all to ask
 * "which city?" would be a large change that buys nothing on any page that
 * is genuinely about the Hatton Garden shop.
 *
 * ── The rule for adding a location ──
 *
 * `streetAddress`, `postalCode` and `geo` are optional and MUST be left
 * undefined until somebody has the real ones. An invented address is not a
 * placeholder, it is a wrong NAP, and a wrong NAP breaks the match between
 * this site and the Google Business Profile it is supposed to reinforce —
 * which costs more than having no address at all. `localBusinessLd()` omits
 * the fields that are missing rather than guessing, and a location without
 * coordinates simply does not publish a `geo`.
 */
export type Location = {
  slug: string;
  /** How the city is named in prose and in a page title. */
  city: string;
  /**
   * The trade district, where the shop is in one. London's is the whole
   * reason "Hatton Garden" carries weight; Birmingham's equivalent is the
   * Jewellery Quarter, which this shop is not in, so it has none.
   */
  district?: string;
  streetAddress?: string;
  addressLocality: string;
  addressRegion: string;
  postalCode?: string;
  addressCountry: string;
  geo?: { latitude: number; longitude: number };
  /** Neighbourhoods and towns this shop actually draws from. */
  areaServed: string[];
};

export const LOCATIONS: Location[] = [
  {
    slug: "london",
    city: "London",
    district: "Hatton Garden",
    streetAddress: SITE.address.streetAddress,
    addressLocality: SITE.address.addressLocality,
    addressRegion: SITE.address.addressRegion,
    postalCode: SITE.address.postalCode,
    addressCountry: SITE.address.addressCountry,
    geo: { latitude: SITE.geo.latitude, longitude: SITE.geo.longitude },
    areaServed: [
      "Hatton Garden, London EC1N",
      "Clerkenwell, London EC1",
      "Farringdon, London EC1",
      "City of London",
      "Islington, London N1",
      "Greater London",
    ],
  },
  {
    slug: "birmingham",
    city: "Birmingham",
    // No district. The shop is in Birmingham generally, not the Jewellery
    // Quarter, and claiming the Quarter for the search weight it carries
    // would be a lie a customer discovers at the door.
    addressLocality: "Birmingham",
    addressRegion: "West Midlands",
    addressCountry: "GB",
    // streetAddress, postalCode and geo are deliberately absent. See the rule
    // above — fill them in from the real shop, do not invent them.
    areaServed: [
      "Birmingham",
      "West Midlands",
      "Solihull",
      "Coventry",
      "Wolverhampton",
      "Warwickshire",
    ],
  },
];

export const locationBySlug = (slug: string) =>
  LOCATIONS.find((l) => l.slug === slug);

/** The London shop — the primary location, and the default everywhere. */
export const PRIMARY_LOCATION = LOCATIONS[0];

/**
 * How a location is named in prose: "Hatton Garden, London" where there is a
 * district worth naming, plain "Birmingham" where there is not.
 */
export const locationLabel = (l: Location) =>
  l.district ? `${l.district}, ${l.city}` : l.city;

/**
 * Absolute URL for a site path.
 *
 * The absolute-input branch is not defensive tidiness — it is a bug fix. Call
 * sites were passing values that had already been through here, and the old
 * implementation happily glued the origin on a second time, so every
 * page-level BreadcrumbList on the site was publishing
 * `https://alpoelondon.com/https://alpoelondon.com/about` as its `item`.
 * Google discards a breadcrumb trail it cannot resolve, which is why none of
 * them were showing in results. Making the function idempotent fixes all
 * fifteen affected routes at once and stops the next caller reintroducing it.
 */
export const siteUrl = (path: string = "") => {
  const base = SITE.url.replace(/\/$/, "");
  if (!path) return base;
  if (/^https?:\/\//i.test(path)) return path;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
};
