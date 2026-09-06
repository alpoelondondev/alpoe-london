import type { NextConfig } from "next";
import { ROUTES } from "./lib/routes";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      // Product photography lives in the assets bucket (lib/assets.ts); the
      // optimiser must be allowed to fetch from it.
      { protocol: "https", hostname: "*.r2.dev" },
    ],
  },
  /**
   * IWC, Panerai and Vacheron Constantin were retired from the catalogue on
   * 23 Aug 2026. Each had a brand page and one listing, both in the sitemap
   * and therefore possibly in an index or somebody's history, so the addresses
   * answer with a redirect to the brands we do carry rather than a 404.
   * Permanent, because they are not coming back — if one does, delete its
   * entry here before adding the brand to lib/taxonomy.ts, or the redirect
   * will shadow the page.
   */
  async redirects() {
    return [
      /*
       * www to the apex, permanently.
       *
       * Both hostnames answered 200. Nothing redirected, so the site was live
       * at two addresses at once, and Search Console shows exactly what that
       * costs: the homepage is indexed twice — 50 impressions as
       * alpoelondon.com and 12 more as www.alpoelondon.com — while
       * /guides/wedding-bands and /guides/buying-jewellery-in-hatton-garden
       * are indexed *only* under www, split off from every other page on the
       * site. Every link, every citation and every ranking signal that landed
       * on www was being counted against a hostname the rest of the site does
       * not use.
       *
       * The apex wins because everything else already says so: the canonical
       * tag on both hosts, the sitemap's 528 URLs, robots.txt's Host line and
       * every @id in the structured-data graph. Changing those to www instead
       * would be a bigger edit for no gain, and the apex is the version with
       * the impressions.
       *
       * A host redirect rather than a Vercel domain setting so it lives in the
       * repository, is reviewable, and cannot be undone by someone clicking
       * around a dashboard. It must sit before the brand rules below: a `www`
       * request for a retired brand should reach the apex first and take the
       * brand redirect there, in one hop each rather than a cross-host chain.
       */
      {
        source: "/:path*",
        has: [{ type: "host" as const, value: "www.alpoelondon.com" }],
        destination: "https://alpoelondon.com/:path*",
        permanent: true,
      },
      /*
       * The sources are deliberately paths that no longer resolve — that is
       * the point of a redirect — so they are written out rather than built
       * from ROUTES, which only names routes that exist. The destination is a
       * live route and does come from the registry: a redirect quietly
       * pointing at a page that has since been renamed is a 404 dressed up as
       * a 308, and nothing would have caught it.
       */
      ...["iwc", "panerai", "vacheron-constantin"].map((brand) => ({
        source: `/watches/${brand}/:path*`, // route-literal-ok: retired brand
        destination: ROUTES.watches,
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
