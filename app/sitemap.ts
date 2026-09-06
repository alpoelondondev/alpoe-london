import type { MetadataRoute } from "next";
import { WATCH_BRANDS, JEWELLERY_CATEGORIES } from "@/lib/taxonomy";
import { getAllProducts, productUrl } from "@/lib/products";
import { getCatalogueProductsByBrand } from "@/lib/catalogue";
import { siteUrl } from "@/lib/site";
import { ROUTES, staticSitemapRoutes } from "@/lib/routes";
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

  /*
   * The static pages are read out of the route registry rather than listed
   * here by hand.
   *
   * This used to be twenty-two literal `siteUrl("/...")` calls kept in step
   * with the app directory by memory alone — which is how /ourbrand came to be
   * built, given metadata and then listed in no sitemap and no link on the
   * site for as long as it existed. A page is now listed because it is
   * registered, and a registered page that should not be listed has to say
   * why in `excludedBecause`. Both facts live next to the path in
   * lib/routes.ts, where the person adding a route will see them.
   *
   * siteUrl() is still handed the raw path, and still resolves "/" to the bare
   * origin with no trailing slash, so the homepage entry continues to agree
   * with the canonical Next.js renders for it.
   */
  const entries: MetadataRoute.Sitemap = staticSitemapRoutes().map(
    ({ path, weight }) => ({
      url: siteUrl(path === ROUTES.home ? "" : path),
      changeFrequency: weight.changeFrequency,
      priority: weight.priority,
    }),
  );

  // One page per diamond shape, under /rings. Commercial intent with a local
  // modifier, so weighted alongside the engagement hub they sit beneath.
  for (const g of SHAPE_GUIDES) {
    entries.push({
      url: siteUrl(ROUTES.ringShape(g.slug)),
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  // The per-brand selling pages. Transactional intent, so weighted just under
  // the /sell hub they sit beneath.
  for (const b of SELL_BRANDS) {
    entries.push({
      url: siteUrl(ROUTES.sellBrand(b.slug)),
      changeFrequency: "monthly",
      priority: 0.75,
    });
  }

  for (const b of WATCH_BRANDS) {
    entries.push({
      url: siteUrl(ROUTES.watchBrand(b.slug)),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  }
  for (const c of JEWELLERY_CATEGORIES) {
    entries.push({
      url: siteUrl(ROUTES.jewelleryCategory(c.slug)),
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
