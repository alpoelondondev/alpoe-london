import type { Metadata } from "next";
import { SITE, siteUrl } from "./site";
import type { Product } from "./types";

export function pageMetadata(opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const canonical = siteUrl(opts.path);
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url: canonical,
      siteName: SITE.name,
      locale: "en_GB",
      type: "website",
      images: opts.image ? [{ url: opts.image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images: opts.image ? [opts.image] : undefined,
    },
  };
}

export function organizationLd() {
  return {
    "@type": "Organization",
    "@id": `${siteUrl()}/#organization`,
    name: SITE.name,
    url: siteUrl(),
    logo: siteUrl("/alpoe-london-logo-transparent.svg"),
    sameAs: SITE.sameAs,
  };
}

export function localBusinessLd() {
  return {
    "@type": "JewelryStore",
    "@id": `${siteUrl()}/#localbusiness`,
    name: SITE.name,
    url: siteUrl(),
    telephone: SITE.phone,
    email: SITE.email,
    image: siteUrl("/alpoe-london-logo-transparent.svg"),
    address: {
      "@type": "PostalAddress",
      ...SITE.address,
    },
    areaServed: "GB",
    priceRange: "£££££",
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
  const images = product.images.length
    ? product.images.map((p) => (p.startsWith("http") ? p : siteUrl(p)))
    : [siteUrl("/alpoe-london-logo-transparent.svg")];

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
    image: images,
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
  products: { title: string; url: string }[];
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
      itemListElement: opts.products.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.title,
        url: siteUrl(p.url),
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
