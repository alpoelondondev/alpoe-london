# Ring Builder — Implementation Plan

Status: **not started**. This doc captures the full plan so we can resume cold.

## Goal

A 4-step bespoke engagement ring configurator:

1. Pick a setting style (solitaire, halo, trilogy, …)
2. Pick a diamond (shape, carat, colour, clarity)
3. Pick a metal (white gold, yellow gold, rose gold, platinum)
4. Review summary → WhatsApp enquiry (no cart / no Stripe)

Reference site inspected: `https://57-jewellers.com/ring-builder` — custom React + Vite + Supabase SPA. We'll build the equivalent on our existing Next.js stack, CSV-backed, reusing the WhatsApp enquiry flow already in `lib/whatsapp.ts`.

## Non-goals (v1)

- No live diamond feed (Nivoda / VDB / RapNet). Hand-curated CSV only.
- No 360° spin viewers.
- No saved/shareable builds beyond what the URL already encodes.
- No payments. Enquiry is via WhatsApp, same pattern as existing product CTAs.
- No hot-linking competitor imagery (explicitly rejected — see 57J teardown).

## Stack decisions

- **Routes**: App Router, nested under `app/ring-builder/`.
- **State**: URL params only. No React context, no Zustand. Shareable, back-button-safe, SSR-friendly.
- **Data**: CSV files under `data/`, loaded once at build via helpers in `lib/`, mirroring the existing `data/products.csv` + `lib/products.ts` pattern.
- **UI**: Reuse `app/components/Filters.tsx`, `app/components/ProductGrid.tsx`, Radix primitives already in the tree.
- **Checkout**: `lib/whatsapp.ts` — new template for ring-builder enquiries (see below).

## Routes

```
app/ring-builder/
  page.tsx                                        ← landing / style picker
  [setting]/
    diamond/
      page.tsx                                    ← diamond grid + filters
    [diamondId]/
      metal/
        page.tsx                                  ← metal + size picker
      [metal]/
        review/
          page.tsx                                ← summary + WhatsApp CTA
```

State flows entirely through URL segments + query params (e.g. `?carat=1-2&clarity=VS1,VS2&shape=round`).

## Data files

### `data/settings.csv`

Columns:
```
id,style,metal,price_from,image,compatible_shapes,description
```

- `style`: solitaire | halo | trilogy | pave | bezel | cathedral | hidden-halo
- `metal`: white-gold | yellow-gold | rose-gold | platinum
- `price_from`: GBP, setting only (excludes stone)
- `image`: path under `/public/ring-builder/settings/`
- `compatible_shapes`: `|`-separated, e.g. `round|oval|cushion`

### `data/diamonds.csv`

Columns:
```
id,shape,carat,colour,clarity,cut,certificate,price,image,video
```

- `shape`: round | oval | emerald | cushion | pear | princess | radiant | marquise
- `colour`: D–K
- `clarity`: FL | IF | VVS1 | VVS2 | VS1 | VS2 | SI1 | SI2
- `cut`: Excellent | Very Good | Good
- `certificate`: GIA | IGI | HRD (+ number if known)
- `price`: GBP total for the stone
- `image`: generic shape PNG — same image per shape is fine for v1
- `video`: optional, leave blank in v1

### `lib/settings.ts` and `lib/diamonds.ts`

Follow the exact pattern of `lib/products.ts` — sync CSV read at module scope, typed, cached by Node's module cache.

## Image inventory

All assets live under `public/ring-builder/`.

### Naming rules (strict — filenames are referenced from CSV)

- all lowercase
- hyphens between words (`white-gold`, not `white_gold` or `whiteGold`)
- no spaces, no apostrophes, no capitals
- `.png` preferred (transparency); `.jpg` only for hero

### Folders

```
public/ring-builder/
  hero.jpg                      ← optional landing hero, 1920×1080, <500 KB
  settings/                     ← one file per {style}-{metal}
  diamonds/                     ← one file per shape (generic, reused across carats)
  metals/                       ← 200×200 swatch circles for metal picker
  composed/                     ← (future) pre-rendered setting+metal+shape
```

### Required images

#### `public/ring-builder/diamonds/` — **user has these**

Shapes to stock (pick subset based on what we actually offer):
```
round.png
oval.png
emerald.png
cushion.png
pear.png
princess.png
radiant.png
marquise.png
```
Specs: 800×800 px, transparent PNG, centred, <150 KB.

#### `public/ring-builder/settings/` — **user to provide**

Pattern: `{style}-{metal}.png`. Minimum to ship MVP = 1 style × 4 metals = 4 photos.

```
solitaire-white-gold.png
solitaire-yellow-gold.png
solitaire-rose-gold.png
solitaire-platinum.png
halo-white-gold.png
halo-yellow-gold.png
halo-rose-gold.png
halo-platinum.png
trilogy-white-gold.png
trilogy-yellow-gold.png
trilogy-rose-gold.png
trilogy-platinum.png
…
```

Specs: 1200×1200 px, white or transparent background, 3/4 angle, <300 KB each. Ideally photographed with empty prongs so the diamond can be composited on top in CSS; photos with a generic stone already set are acceptable (we just skip the composite).

#### `public/ring-builder/metals/` — **user to provide, or generate from CSS**

```
white-gold.png
yellow-gold.png
rose-gold.png
platinum.png
```
Specs: 200×200 px, transparent PNG. Used as ~40px swatches in the picker. If the user doesn't want to provide these, generate equivalents from CSS gradients and skip the image files.

## Open questions to resolve before building

1. **Which setting styles do we offer?** — drives how many setting photos we need.
2. **Which diamond shapes do we offer?** — subset of the eight listed.
3. **Pricing model** — real £/ct numbers or plausible placeholders for MVP?
4. **Setting prices** — per-style base price in GBP.
5. **WhatsApp enquiry template** — reuse existing `lib/whatsapp.ts` format, or a ring-builder-specific one? Proposed:
   > Hi, interested in building: {style} setting with {shape} {carat}ct {colour}/{clarity} (Cert: {certificate}) in {metal}. Total ~£{total}. Is this available?

## WhatsApp CTA

- Use `NEXT_PUBLIC_WA_NUMBER` via `lib/whatsapp.ts` — **never** hard-code the number.
- Add a ring-builder-specific template function (e.g. `buildRingEnquiryMessage(...)`) to `lib/whatsapp.ts` rather than inlining string concatenation in the review page.

## Review-page composition

Layer the diamond shape PNG on top of the setting photo using absolute positioning. Each setting image has an implicit "stone socket" centre; for v1 assume centre of the frame. If photos vary, add `socket_x,socket_y` columns to `data/settings.csv` later.

## Phased rollout

1. **Phase 1 — scaffold with placeholders**: routes, CSV loaders, UI shell, placeholder coloured boxes in the shape/size of each image slot. Proves the flow works end-to-end without needing photography.
2. **Phase 2 — drop in diamonds**: user adds the 8 shape PNGs. Diamond picker becomes real.
3. **Phase 3 — drop in settings**: user adds setting photos starting with solitaire × 4 metals. Style picker becomes real.
4. **Phase 4 — polish**: metal swatches, hero image, real copy, price tuning.
5. **Phase 5 (future)**: 360° spin, live diamond feed, saved builds.

## Resume checklist

When picking this up:

- [ ] Confirm list of setting styles we offer
- [ ] Confirm list of diamond shapes we offer
- [ ] Confirm WhatsApp enquiry template
- [ ] Collect setting photos into `public/ring-builder/settings/` with the naming above
- [ ] Collect metal swatches or decide to CSS-generate
- [ ] Scaffold routes and CSV loaders (Phase 1)
- [ ] Seed `data/diamonds.csv` with real or placeholder stones
- [ ] Seed `data/settings.csv`
- [ ] Wire review page to `lib/whatsapp.ts`
