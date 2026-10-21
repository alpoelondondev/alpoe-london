# Alpoe London

Luxury watches and bespoke jewellery — Hatton Garden, London. Live at [alpoelondon.com](https://alpoelondon.com).

Next.js (App Router) + Tailwind CSS 4 + GSAP. Product data comes from `data/products.csv` and a live Google Sheet catalogue (with a bundled fallback); watch photography is matched by reference number from `public/products/<brand>/<reference>/`.

## Commands

```bash
pnpm dev        # regenerate data manifests and start the dev server
pnpm build      # production build (prerenders every product page)
pnpm start      # serve the production build
pnpm gen:data   # regenerate image manifest + research index only
pnpm check:routes # verify every internal path against the route registry
pnpm lint       # eslint
```

`pnpm build` runs `check:routes` first and fails the build on any violation.

## Structure

- `app/` — routes and components (App Router)
- `lib/` — site config (`site.ts`), the route registry (`routes.ts`), catalogue,
  products, SEO/JSON-LD helpers
- `data/` — `products.csv`, watch research JSON, catalogue fallback
- `docs/` — operations guide, photo audit, ring builder spec
- `scripts/` — build-time data generators

## Routes

Every internal path is named once in `lib/routes.ts` and used through a token —
`ROUTES.watches`, `ROUTES.watchBrand(slug)` — never as a string literal.
`scripts/check-routes.mjs` enforces it and runs first in the build. It fails on
a page with no token, a token with no page, a hardcoded path, a builder whose
route has been deleted, a static page shadowing a dynamic sibling, an orphan
route nothing links to, a retired-brand redirect shadowing a live brand, and a
URL in `public/llms.txt` that nothing serves.

Adding a page means adding a token. A page nothing links to must declare
`unlinked: "<why>"`; a page kept out of the sitemap must declare
`excludedBecause`. To allow a deliberate path literal, end the line with
`// route-literal-ok`.

## Deploy

Hosted on **Vercel** (moved from Netlify on 22 Aug 2026; Vercel also manages
DNS). The apex is canonical — `www` 301s to it via `next.config.ts`.

Environment variables the deployment needs:

| Variable | Required | What breaks without it |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | yes | Canonical URLs, sitemap and structured data point at the wrong origin. Set to `https://alpoelondon.com`. |
| `NEXT_PUBLIC_RING_RENDERS_URL` | yes | The ring builder shows specification cards instead of photographs. |
| `NEXT_PUBLIC_ASSETS_URL` | no | Already committed in `.env.production`; a host-level value overrides it. Unset entirely, the films 404 — they are not in `public/`. |
| `NEXT_PUBLIC_WA_NUMBER` | no | Falls back to the number in `lib/site.ts`. |

All four are `NEXT_PUBLIC_*`, so they are **inlined at build time**. Adding or
changing one requires a redeploy — editing the value alone does nothing.
