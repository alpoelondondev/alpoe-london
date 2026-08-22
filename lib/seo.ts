import type { Metadata } from "next";
import { SITE, siteUrl } from "./site";
import type { Product } from "./types";

/**
 * The card every share falls back to. Without an explicit `images` entry
 * Next.js emits no og:image at all, and a link to the site pasted into
 * WhatsApp, iMessage, Slack or X rendered as a grey box with no picture — on a
 * jewellery site, where the picture is the product, that is the whole preview
 * thrown away. Per-section cards live in /public/og; this is the default.
 */
export const DEFAULT_OG_IMAGE = "/alpoe-london-og.jpg";

/**
 * Trim a description to something a search result will actually show.
 *
 * Google renders roughly 155–160 characters on desktop and less on mobile.
 * Anything past that is not penalised, it is simply cut — usually mid-word,
 * mid-sentence, with an ellipsis where the call to action should have been.
 * Cutting on a word boundary here means the snippet ends as a phrase rather
 * than a fragment, which is the whole of the difference between a description
 * that sells the click and one that looks broken.
 *
 * Left alone if it already fits: hand-written copy beats anything mechanical.
 */
export function truncateForSerp(text: string, max = 158): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > max * 0.6 ? lastSpace : cut.length).replace(/[,;:\u2014-]+$/, "")}\u2026`;
}

export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  /** Absolute or root-relative. Falls back to the house card. */
  image?: string;
  /** Describe the card for screen readers and for image search. */
  imageAlt?: string;
  /** Set on pages that must never rank — thin search results, utilities. */
  noindex?: boolean;
  /**
   * Skip the root layout's `%s | Alpoe London` template.
   *
   * For a product the title IS the name people search — brand, model,
   * reference — and it is long before any suffix: a Royal Oak with its full
   * reference runs past 60 characters on its own, and Google truncates the
   * tab title at roughly that. The suffix was pushing the reference number
   * off the end of 259 watch listings. The brand still appears in the URL,
   * the breadcrumb and the Organization schema, so nothing is lost.
   */
  absoluteTitle?: boolean;
}): Metadata {
  const canonical = siteUrl(opts.path);
  const src = opts.image ?? DEFAULT_OG_IMAGE;
  const image = {
    url: src.startsWith("http") ? src : siteUrl(src),
    width: 1200,
    height: 630,
    alt: opts.imageAlt ?? `${opts.title} — ${SITE.name}, Hatton Garden`,
  };
  return {
    title: opts.absoluteTitle ? { absolute: opts.title } : opts.title,
    description: opts.description,
    alternates: { canonical },
    ...(opts.noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      title: opts.title,
      description: opts.description,
      url: canonical,
      siteName: SITE.name,
      locale: "en_GB",
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: [image.url],
    },
  };
}

export function organizationLd() {
  return {
    "@type": "Organization",
    "@id": `${siteUrl()}/#organization`,
    name: SITE.name,
    alternateName: "Alpoe",
    url: siteUrl(),
    logo: siteUrl("/alpoe-london-logo-full-rosegold.svg"),
    image: siteUrl(DEFAULT_OG_IMAGE),
    description: SITE.tagline,
    // A contactPoint is what lets an assistant answer "how do I reach them"
    // with a number rather than a link to a contact form.
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: SITE.phone,
      email: SITE.email,
      areaServed: "GB",
      availableLanguage: "English",
    },
    sameAs: SITE.sameAs,
  };
}

/**
 * The services this business actually offers, as machine-readable data.
 *
 * Deliberately priced at nothing. Everything here is made to order or valued
 * on the piece, and a `price` invented to satisfy a schema validator is a
 * false claim about what something costs — the sort of thing that gets a rich
 * result revoked rather than granted. Naming the services and pointing each at
 * its page is the honest version, and it is the part that helps: it is how an
 * assistant asked "who does bespoke engagement rings in Hatton Garden" learns
 * that this business does, and where to send the reader.
 */
function offerCatalogLd() {
  const services: { name: string; path: string; description: string }[] = [
    {
      name: "Bespoke engagement rings",
      path: "/rings/engagement-and-wedding-rings",
      description:
        "Engagement rings designed with you and made to order in Hatton Garden — solitaire, halo, three-stone and eternity settings in platinum and 18ct gold.",
    },
    {
      name: "Bespoke jewellery commissions",
      path: "/bespoke",
      description:
        "One-off pieces designed from a sketch, a stone or an heirloom and hand-set at our Hatton Garden bench.",
    },
    {
      name: "Ring builder",
      path: "/ring-builder",
      description:
        "Design your own ring online — choose the setting, diamond shape, carat, metal and UK ring size, then send the specification to the workshop.",
    },
    {
      name: "Wedding rings and bands",
      path: "/rings",
      description:
        "Wedding rings and matching bands in platinum, 18ct white, yellow and rose gold, hallmarked at the London Assay Office.",
    },
    {
      name: "Diamond jewellery",
      path: "/jewellery",
      description:
        "Diamond earrings, necklaces, pendants and bracelets, natural or laboratory-grown, made in London.",
    },
    {
      name: "Luxury watch sourcing",
      path: "/watches",
      description:
        "Rolex, Patek Philippe, Audemars Piguet, Cartier and more — authenticated, sourced to order and sold from Hatton Garden.",
    },
    {
      name: "Watch and jewellery buying",
      path: "/sell",
      description:
        "Sell or part-exchange a luxury watch or piece of jewellery. Free valuation, authenticated in Hatton Garden, paid the same day.",
    },
  ];
  return {
    "@type": "OfferCatalog",
    name: `${SITE.name} services`,
    itemListElement: services.map((s) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "Service",
        name: s.name,
        description: s.description,
        url: siteUrl(s.path),
        provider: { "@id": `${siteUrl()}/#localbusiness` },
      },
    })),
  };
}

/**
 * The business itself — the node every local query resolves against.
 *
 * What was here before named the shop and stopped. No coordinates, so nothing
 * tied the record to a point on the map; no opening hours, so no result could
 * ever say "open now"; no `hasMap`, no service list, and a single SVG logo
 * standing in for imagery Google will not render. Those four omissions are
 * most of what separates a business that appears in the Hatton Garden local
 * pack from one that does not.
 *
 * `image` is an array of real photographs, in the aspect ratios Google asks
 * for. `priceRange` stays as a band rather than a figure: bespoke work is
 * quoted per commission and inventing a number would be a claim we cannot
 * stand behind.
 */
export function localBusinessLd() {
  const { streetAddress, addressLocality, postalCode } = SITE.address;
  return {
    // Two types, because both are true and each is queried differently: a
    // JewelryStore for the ring and diamond searches, a Store for the watch
    // buying-and-selling side.
    "@type": ["JewelryStore", "Store"],
    "@id": `${siteUrl()}/#localbusiness`,
    name: SITE.name,
    description: SITE.tagline,
    url: siteUrl(),
    telephone: SITE.phone,
    email: SITE.email,
    logo: siteUrl("/alpoe-london-logo-full-rosegold.svg"),
    image: [
      siteUrl(DEFAULT_OG_IMAGE),
      siteUrl("/alpoe-bespoke-jewellery-stone-setting-hatton-garden.jpg"),
      siteUrl("/alpoe-diamond-rings-hatton-garden.jpg"),
    ],
    address: {
      "@type": "PostalAddress",
      ...SITE.address,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE.geo.latitude,
      longitude: SITE.geo.longitude,
    },
    hasMap: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${SITE.name} ${streetAddress} ${addressLocality} ${postalCode}`,
    )}`,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [...SITE.hours.days],
        opens: SITE.hours.opens,
        closes: SITE.hours.closes,
      },
    ],
    // The neighbourhoods and boroughs a Hatton Garden showroom actually draws
    // from, plus the country, because a good part of this trade ships.
    areaServed: [
      { "@type": "Place", name: "Hatton Garden, London EC1N" },
      { "@type": "Place", name: "Clerkenwell, London EC1" },
      { "@type": "Place", name: "Farringdon, London EC1" },
      { "@type": "Place", name: "City of London" },
      { "@type": "Place", name: "Islington, London N1" },
      { "@type": "Place", name: "Shoreditch, London EC2" },
      { "@type": "Place", name: "Mayfair, London W1" },
      { "@type": "Place", name: "Greater London" },
      { "@type": "Country", name: "United Kingdom" },
    ],
    knowsAbout: [
      "Bespoke engagement rings",
      "Diamond grading and certification",
      "Laboratory-grown diamonds",
      "Natural diamonds",
      "Wedding rings and eternity bands",
      "UK hallmarking",
      "Luxury watch authentication",
      "Rolex",
      "Patek Philippe",
      "Audemars Piguet",
      "Jewellery valuation",
    ],
    hasOfferCatalog: offerCatalogLd(),
    currenciesAccepted: "GBP",
    priceRange: "£££££",
    parentOrganization: { "@id": `${siteUrl()}/#organization` },
    sameAs: SITE.sameAs,
  };
}

export function websiteLd() {
  return {
    "@type": "WebSite",
    "@id": `${siteUrl()}/#website`,
    name: SITE.name,
    url: siteUrl(),
    inLanguage: "en-GB",
    publisher: { "@id": `${siteUrl()}/#organization` },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl("/search")}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbLd(items: { name: string; url: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: siteUrl(it.url),
    })),
  };
}

export function productLd(product: Product, path: string) {
  /*
   * No photography means no `image` property at all.
   *
   * The fallback used to be the rose gold lockup — an SVG, which Google will
   * not accept as a Product image under any circumstances, on roughly 280 of
   * the site's product pages. That is not a neutral default: it asserts that
   * the picture of this watch is a company logo. An absent property is
   * honest and costs nothing, since a Product rich result was never going to
   * be granted on a logo anyway.
   */
  const images = product.images.map((p) =>
    p.startsWith("http") ? p : siteUrl(p),
  );

  const availability =
    product.stockState === "in_stock"
      ? "https://schema.org/InStock"
      : "https://schema.org/PreOrder";

  return {
    "@type": "Product",
    "@id": `${siteUrl(path)}#product`,
    name: product.title,
    description: product.description,
    sku: product.referenceNumber ?? product.id,
    mpn: product.referenceNumber,
    ...(images.length ? { image: images } : {}),
    ...(product.brand
      ? { brand: { "@type": "Brand", name: product.brand } }
      : {}),
    ...(product.model ? { model: product.model } : {}),
    ...(product.materials ? { material: product.materials } : {}),
    // No listed price ("Price on Request") — an Offer requires a price, and a
    // fabricated one (e.g. 0) reads as invalid data to Search Console. Signal
    // availability without claiming a price we don't have.
    offers: {
      "@type": "Offer",
      url: siteUrl(path),
      availability,
      seller: { "@id": `${siteUrl()}/#organization` },
    },
  };
}

export function collectionLd(opts: {
  name: string;
  description: string;
  path: string;
  /**
   * `url` is optional, and omitting it is the point.
   *
   * Two callers were emitting an ItemList in which every entry carried the
   * same URL — the jewellery category pages, where the films are the listing
   * and there is no page behind each one, and the engagement ring styles,
   * whose fifteen links were query strings on /ring-builder that all
   * canonicalise back to /ring-builder. An ItemList of fifteen names against
   * one URL is not a list of fifteen things; it tells a crawler the page is
   * describing the same item over and over, which is worse than saying
   * nothing. A ListItem is perfectly valid with a name and a position alone,
   * so those callers now name the items honestly and claim no URLs.
   */
  products: { title: string; url?: string }[];
}) {
  return [
    {
      "@type": "CollectionPage",
      "@id": `${siteUrl(opts.path)}#collection`,
      name: opts.name,
      description: opts.description,
      url: siteUrl(opts.path),
    },
    {
      "@type": "ItemList",
      numberOfItems: opts.products.length,
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      itemListElement: opts.products.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.title,
        ...(p.url ? { url: siteUrl(p.url) } : {}),
      })),
    },
  ];
}

export function ldJsonGraph(nodes: object[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}

export function faqLd(items: { question: string; answer: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
