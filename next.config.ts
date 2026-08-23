import type { NextConfig } from "next";

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
    return ["iwc", "panerai", "vacheron-constantin"].map((brand) => ({
      source: `/watches/${brand}/:path*`,
      destination: "/watches",
      permanent: true,
    }));
  },
};

export default nextConfig;
