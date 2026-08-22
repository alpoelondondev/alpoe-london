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
};

export default nextConfig;
