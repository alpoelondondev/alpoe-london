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
} as const;

export const siteUrl = (path: string = "") => {
  const base = SITE.url.replace(/\/$/, "");
  if (!path) return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
};
