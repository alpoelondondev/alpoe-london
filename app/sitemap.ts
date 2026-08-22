import type { MetadataRoute } from "next";
import { WATCH_BRANDS, JEWELLERY_CATEGORIES } from "@/lib/taxonomy";
import { getAllProducts, productUrl } from "@/lib/products";
import { getCatalogueProductsByBrand } from "@/lib/catalogue";
import { siteUrl } from "@/lib/site";
import { SELL_BRANDS } from "@/lib/sell/brands";
import { SHAPE_GUIDES } from "@/lib/rings/shapeGuides";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  /*
   * No `lastModified`. It used to be `new Date()` on every entry, which made
   * every URL claim it changed at the moment of the last deploy — 462 pages,
   * one identical timestamp, rolling forward on every push. Google documents
   * that it ignores lastmod once it sees it does not track real change, so
   * the field was buying nothing and teaching the crawler to distrust the
   * file. Nothing here carries a real content date (the catalogue sheet has
   * none, and a shallow deploy clone has no git history to ask), and an
   * absent value is honest where a wrong one is not. Add it back per-entry
   * only when a genuine date exists.
   */
  const entries: MetadataRoute.Sitemap = [
    /*
     * siteUrl() rather than siteUrl("/") — no trailing slash.
     *
     * Not pedantry: Next.js normalises the rendered canonical for the root
     * route to the bare origin whatever you pass it, so the homepage was
     * advertising https://alpoelondon.com in its <link rel="canonical"> while
     * this file advertised https://alpoelondon.com/. Google resolves the two
     * to one URL, but disagreeing with yourself in the two places you fully
     * control is free to fix and costs nothing to keep right.
     */
    { url: siteUrl(), changeFrequency: "weekly", priority: 1 },
    { url: siteUrl("/watches"), changeFrequency: "weekly", priority: 0.9 },
    { url: siteUrl("/jewellery"), changeFrequency: "weekly", priority: 0.9 },
    { url: siteUrl("/bespoke"), changeFrequency: "monthly", priority: 0.9 },
    { url: siteUrl("/rings"), changeFrequency: "monthly", priority: 0.8 },
    {
      url: siteUrl("/rings/engagement-and-wedding-rings"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: siteUrl("/rings/ready-to-ship"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: siteUrl("/ring-size-guide"),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: siteUrl("/ring-builder"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    { url: siteUrl("/sell"), changeFrequency: "monthly", priority: 0.8 },
    {
      url: siteUrl("/book-appointment"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    { url: siteUrl("/guides"), changeFrequency: "monthly", priority: 0.8 },
    {
      url: siteUrl("/guides/wedding-bands"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: siteUrl("/guides/buying-jewellery-in-hatton-garden"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: siteUrl("/guides/natural-vs-lab-grown-diamonds"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    { url: siteUrl("/metal-prices"), changeFrequency: "daily", priority: 0.7 },
    { url: siteUrl("/hallmarking"), changeFrequency: "yearly", priority: 0.4 },
    { url: siteUrl("/mentorship"), changeFrequency: "monthly", priority: 0.7 },
    { url: siteUrl("/about"), changeFrequency: "monthly", priority: 0.6 },
    { url: siteUrl("/contact"), changeFrequency: "monthly", priority: 0.6 },
    // /ourbrand was built, metadata'd and then listed nowhere — not here, and
    // not in any link on the site. A page nothing points at and no sitemap
    // names is a page that does not exist as far as a crawler is concerned.
    { url: siteUrl("/ourbrand"), changeFrequency: "yearly", priority: 0.3 },
    // /search is deliberately absent: it carries noindex, and asking a crawler
    // to fetch a URL only to be told not to index it wastes the budget twice.
  ];

  // One page per diamond shape, under /rings. Commercial intent with a local
  // modifier, so weighted alongside the engagement hub they sit beneath.
  for (const g of SHAPE_GUIDES) {
    entries.push({
      url: siteUrl(`/rings/${g.slug}`),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  // The per-brand selling pages. Transactional intent, so weighted just under
  // the /sell hub they sit beneath.
  for (const b of SELL_BRANDS) {
    entries.push({
      url: siteUrl(`/sell/${b.slug}`),
      changeFrequency: "monthly",
      priority: 0.75,
    });
  }

  for (const b of WATCH_BRANDS) {
    entries.push({
      url: siteUrl(`/watches/${b.slug}`),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }
  for (const c of JEWELLERY_CATEGORIES) {
    entries.push({
      url: siteUrl(`/jewellery/${c.slug}`),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }
  const curatedSlugs = new Set(
    getAllProducts().map((p) => `${p.type}/${p.brandSlug ?? p.categorySlug}/${p.slug}`),
  );
  for (const p of getAllProducts()) {
    entries.push({
      url: siteUrl(productUrl(p)),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // Live-sheet catalogue products aren't in products.csv, so they
  // need their own sitemap pass — otherwise these indexable pages go unlisted.
  for (const b of WATCH_BRANDS) {
    const catalogueProducts = await getCatalogueProductsByBrand(b.slug);
    for (const p of catalogueProducts) {
      const key = `${p.type}/${p.brandSlug}/${p.slug}`;
      if (curatedSlugs.has(key)) continue;
      entries.push({
        url: siteUrl(productUrl(p)),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
