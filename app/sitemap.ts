import type { MetadataRoute } from "next";
import { WATCH_BRANDS, JEWELLERY_CATEGORIES } from "@/lib/taxonomy";
import { getAllProducts, productUrl } from "@/lib/products";
import { getCatalogueProductsByBrand } from "@/lib/catalogue";
import { siteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [
    { url: siteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: siteUrl("/watches"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: siteUrl("/jewellery"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: siteUrl("/bespoke"), lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: siteUrl("/rings"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    {
      url: siteUrl("/rings/engagement-and-wedding-rings"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: siteUrl("/rings/ready-to-ship"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: siteUrl("/ring-size-guide"),
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: siteUrl("/ring-builder"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    { url: siteUrl("/sell"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    {
      url: siteUrl("/book-appointment"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: siteUrl("/guides/natural-vs-lab-grown-diamonds"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    { url: siteUrl("/metal-prices"), lastModified: now, changeFrequency: "daily", priority: 0.7 },
    { url: siteUrl("/hallmarking"), lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: siteUrl("/mentorship"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: siteUrl("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: siteUrl("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    // /ourbrand was built, metadata'd and then listed nowhere — not here, and
    // not in any link on the site. A page nothing points at and no sitemap
    // names is a page that does not exist as far as a crawler is concerned.
    { url: siteUrl("/ourbrand"), lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    // /search is deliberately absent: it carries noindex, and asking a crawler
    // to fetch a URL only to be told not to index it wastes the budget twice.
  ];

  for (const b of WATCH_BRANDS) {
    entries.push({
      url: siteUrl(`/watches/${b.slug}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }
  for (const c of JEWELLERY_CATEGORIES) {
    entries.push({
      url: siteUrl(`/jewellery/${c.slug}`),
      lastModified: now,
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
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }

  // Live-sheet "sourceable" catalogue products aren't in products.csv, so they
  // need their own sitemap pass — otherwise these indexable pages go unlisted.
  for (const b of WATCH_BRANDS) {
    const catalogueProducts = await getCatalogueProductsByBrand(b.slug);
    for (const p of catalogueProducts) {
      const key = `${p.type}/${p.brandSlug}/${p.slug}`;
      if (curatedSlugs.has(key)) continue;
      entries.push({
        url: siteUrl(productUrl(p)),
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
