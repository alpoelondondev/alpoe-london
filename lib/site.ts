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
