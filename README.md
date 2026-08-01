# Alpoe London

Luxury watches and bespoke jewellery — Hatton Garden, London. Live at [alpoelondon.com](https://alpoelondon.com).

Next.js (App Router) + Tailwind CSS 4 + GSAP. Product data comes from `data/products.csv` and a live Google Sheet catalogue (with a bundled fallback); watch photography is matched by reference number from `public/products/<brand>/<reference>/`.

## Commands

```bash
pnpm dev        # regenerate data manifests and start the dev server
pnpm build      # production build (prerenders every product page)
pnpm start      # serve the production build
pnpm gen:data   # regenerate image manifest + research index only
pnpm lint       # eslint
```

## Structure

- `app/` — routes and components (App Router)
- `lib/` — site config (`site.ts`), catalogue, products, SEO/JSON-LD helpers
- `data/` — `products.csv`, watch research JSON, catalogue fallback
- `docs/` — operations guide, photo audit, ring builder spec
- `scripts/` — build-time data generators

## Deploy

Set `NEXT_PUBLIC_SITE_URL=https://alpoelondon.com` (and optionally `NEXT_PUBLIC_WA_NUMBER`) in the deployment environment so canonical URLs, sitemap and structured data point at the live domain.
