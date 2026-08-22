# Operations Guide

Day-to-day instructions for running and updating the Alpoe London site. Written for non-developers — copy/paste the commands.

## TL;DR

| I want to… | Do this |
|---|---|
| Edit a product (price, stock, condition) | Edit `data/products.csv` directly, save, commit |
| Remove a watch from the site | Delete its row from `data/products.csv` (or the Google Sheet). There is no sold / sourceable state — everything listed is held in stock. |
| Add new watch images | Add a row to `data/image-sources/{brand}.tsv`, run `python3 scripts/build-product-images.py {brand}`, `pnpm gen:data`, then upload `public/products` to R2 (see `lib/assets.ts`) |
| Add a new Rolex reference | Edit `scripts/build-rolex-catalogue.mjs`, add the entry, run `node scripts/build-rolex-catalogue.mjs` |
| Add a non-Rolex watch (Patek/AP/etc.) | Add a row to `data/products.csv` directly |
| Add a jewellery item | Add a row to `data/products.csv` directly |
| Preview the site locally | `pnpm dev`, open <http://localhost:3000> |
| Push changes live | `git add . && git commit -m "..." && git push` |
| Change the WhatsApp number | Edit `NEXT_PUBLIC_WA_NUMBER` in your `.env.local` and redeploy |

---

## 1. Editing existing products

The catalogue lives in **`data/products.csv`**. One row = one product page. To change anything visible on a product page (title, description, condition, year, materials, stock state, featured flag) just edit the cell, save, commit.

### Quickest way to edit

Open `data/products.csv` in any spreadsheet app (Numbers, Excel, Google Sheets) — it's plain CSV.

**Save in CSV format** (not `.xlsx`). When Excel asks "keep current format?", say yes.

### What each column means

| Column | What it does | Example |
|---|---|---|
| `id` | Unique internal ID. Do not change once set. | `w-rolex-126610lv` |
| `type` | `watch` or `jewellery` | `watch` |
| `brand` | Watch brand name. Must match `lib/taxonomy.ts` exactly. | `Rolex` |
| `category` | Jewellery category. Empty for watches. | `Engagement Rings` |
| `model` | Watch model. Must be in the brand's `models` list in `lib/taxonomy.ts`. | `Submariner` |
| `nickname` | Collector nickname, no quotes. | `Starbucks` |
| `slug` | URL slug. Stable — don't change after launch. | `rolex-submariner-starbucks-126610lv` |
| `title` | Page title shown in big serif | `Rolex Submariner Date "Starbucks" 126610LV` |
| `description` | 1–2 sentence body copy | |
| `stock_state` | always `in_stock` (the column is kept for compatibility; the site no longer shows a stock tier) | `in_stock` |
| `materials` | Case material(s) | `Oystersteel` |
| `gemstones` | Empty for most watches; `Diamond` for diamond-set bezels | |
| `carat` | Diamond carat weight (jewellery) | `2.00ct` |
| `dial` | Dial colour | `Black` |
| `case_size` | Diameter | `41mm` |
| `movement` | Caliber | `Automatic Cal. 3235` |
| `reference_number` | Manufacturer reference, uppercase | `126610LV` |
| `year` | Production year | `2024` |
| `condition` | `Unworn`, `Pre-owned`, `Vintage`, or `New` for jewellery | `Unworn` |
| `bracelets` | Pipe-separated bracelet options (Rolex). Empty for non-Rolex. | `Oyster\|Jubilee` |
| `images` | Pipe-separated image paths | `/products/rolex/126610lv/1.png\|/products/rolex/126610lv/2.png` |
| `featured` | `true` to highlight on the homepage | `false` |
| `meta_title` | SEO title | |
| `meta_description` | SEO description | |
| `placeholder` | `true` for seed/demo rows, `false` for real listings | `false` |

### Common edits

**A watch has been sold or is no longer held**

Delete its row from `data/products.csv` (or from the Google Sheet / `data/catalogue-extra.csv`
if it came from there) and commit. The site no longer has a sold or sourceable state —
everything listed is presented as held in stock, so a piece that is not should not be listed.

**Update a description**

1. Find the row, edit the `description` cell.
2. If the description contains a comma, wrap the whole cell in double quotes.
3. If it contains a quote character, double the quote: `"a ""quoted"" word"`.

**Mark something as featured (homepage)**

Change `featured` to `true`. Featured products appear in the highlights strip on the homepage.

**Stop selling a product**

Easiest: delete its row. The page disappears at the next build. The image folder under `public/` can stay — Next.js won't expose it without a CSV row pointing at it.

There is no "sold out" or "sourceable" state any more: a listing is either on the site, in stock, or it is not on the site.

---

> **Since 22 Aug 2026 product images are WebP and served from the R2 bucket.** The files in
> `public/products/{brand}/{ref}/{n}.webp` are built from `data/image-sources/{brand}.tsv`
> (reference, source URL, provenance) by `scripts/build-product-images.py` — 800px wide, q80 —
> and mirrored to `r2:alpoe-ring-renders/site/products/` with:
>
>     rclone copy public/products r2:alpoe-ring-renders/site/products \
>       --header-upload "Cache-Control: public, max-age=31536000, immutable" --s3-no-check-bucket
>
> The manifest stamps every path with `?v=<hash>`, so replacing a file and re-uploading is safe.
> Listings the Google Sheet does not carry yet go in `data/catalogue-extra.csv` (same four columns);
> a row there disappears automatically once the sheet has the same brand / reference / variant.
> The PNG drop-in instructions below still describe the folder layout but the format is now WebP.

## 2. Adding new Rolex images

You already have 142 Rolex press-kit images organised under `public/products/rolex/{ref}/`. To add more:

1. Get the new images. Naming should be `1.png`, `2.png`, `3.png` per reference.
2. Drop them into `public/products/rolex/{ref-lowercase}/`. If the folder doesn't exist, create it.
3. From the project root, run:
   ```
   node scripts/build-rolex-catalogue.mjs
   ```
4. The script auto-discovers the new files and updates `data/products.csv`. Commit.

If the new images come straight from Rolex's press kit (filenames like `imgi_42_m126610lv-0001.png`), drop them all into `public/products/rolex/` and run:

```
node scripts/organize-rolex-images.mjs
```

That script sorts them into per-reference folders. Then run the catalogue script as above.

---

## 3. Adding a new Rolex reference

If Rolex releases something new or you want to offer a reference not yet in the catalogue:

1. Open `scripts/build-rolex-catalogue.mjs`.
2. Find the section for the model (Submariner, Daytona, etc.).
3. Copy an existing entry and edit it:
   ```js
   { ref: "126613LB", model: "Submariner", caseSize: "41mm",
     materials: "Oystersteel & 18ct Yellow Gold",
     nickname: "Bluesy", bracelets: ["Oyster"] }
   ```
4. If you have images, drop them into `public/products/rolex/{ref}/`.
5. Run `node scripts/build-rolex-catalogue.mjs`.
6. Run `pnpm build` to confirm it compiles.
7. Commit.

---

## 4. Adding a non-Rolex watch

For Patek, AP, Cartier, Omega, etc., **edit `data/products.csv` directly** — no script. The catalogue script only handles Rolex.

1. Open the CSV.
2. Copy an existing watch row.
3. Edit every column to match the new watch.
4. For images: drop them into `public/products/{brand-slug}/{slug}/` (e.g. `public/products/patek-philippe/patek-nautilus-5711/1.jpg`). Reference them in the `images` column with `|` separators.
5. Save, commit.

The brand must already exist in `lib/taxonomy.ts`. Currently supported: Rolex, Patek Philippe, Audemars Piguet, Richard Mille, Cartier, Hublot, Omega, Breitling, IWC, Panerai, Vacheron Constantin. To add a brand not on that list, edit `lib/taxonomy.ts` first.

---

## 5. Adding a jewellery item

Same as non-Rolex watches:

1. Open `data/products.csv`.
2. Copy an existing jewellery row.
3. Set `type=jewellery`, leave `brand` empty, set `category` to one of: Engagement Rings, Wedding Rings & Bands, Men's Jewellery, Bracelets, Earrings, Necklaces & Pendants, Rings.
4. Drop images into `public/products/{category-slug}/{slug}/`.
5. Save, commit.

---

## 6. Previewing the site locally

```
pnpm dev
```

Open <http://localhost:3000>. The site rebuilds on every file save. Press `Ctrl+C` to stop.

Use `pnpm build` to do a full production build — useful before deploying. If `pnpm build` fails, the deploy will fail too. Fix the errors before pushing.

---

## 7. Deploying

The site is deployed via git push (Vercel or similar). After committing changes:

```
git add .
git commit -m "describe what changed"
git push
```

The deploy runs automatically. Check the deploy URL after 1–2 minutes.

If you need to revert a bad deploy: `git revert HEAD && git push`.

---

## 8. Image guidelines

- **Format**: PNG preferred (transparency); JPG fine for product photography.
- **Size**: 1600×1600 pixels max. Anything larger gets resampled by Next.js anyway.
- **Naming**: lowercase, hyphens, no spaces. `1.png`, `2.png`, etc., for multi-angle.
- **Where**: `public/products/{brand-or-category}/{ref-or-slug}/`. The path you put in the CSV must exactly match the actual file path.
- **What not to do**: don't hot-link images from other websites. Always host your own.

The site automatically converts to AVIF/WebP and serves the right resolution per device. No manual optimisation needed.

---

## 9. WhatsApp enquiries

Every product page has an "Enquire on WhatsApp" button. The message is auto-composed from the product data, including the bracelet the customer chose (for multi-bracelet Rolex refs).

The phone number lives in environment variable `NEXT_PUBLIC_WA_NUMBER`. To change it:

1. Edit `.env.local` (locally) or your hosting provider's environment variables.
2. Redeploy.

Never hardcode the number in components.

---

## 10. Troubleshooting

**A product page is showing "404 Not Found"**

Check the slug column in `data/products.csv`. It must match the URL exactly. Check `pnpm build` output — if the page didn't prerender, the slug or another required field is malformed.

**An image isn't showing**

Open the product page, right-click the broken image, view the URL. Then check that the file exists at `public/{that-url}`. Most often it's a typo in the `images` column.

**The site won't build after my edit**

Run `pnpm build` and read the error message. Most common causes:
- A CSV row is missing a column (count the commas)
- A brand or model name doesn't match `lib/taxonomy.ts` exactly (case-sensitive, hyphens matter)
- A required field is empty (id, type, slug, title)

**The bracelet selector is showing on a single-bracelet product**

That means the `bracelets` column has multiple values when it should have one. Edit the CSV — for Submariners, set `bracelets` to just `Oyster` (no pipe).

**The bracelet selector isn't showing when it should**

Check the `bracelets` column. If empty, no selector. If single value, no selector. If `Oyster|Jubilee`, the selector appears with two radios.

---

## 11. File map (where things live)

| Thing | Path |
|---|---|
| All product data | `data/products.csv` |
| Product images | `public/products/{brand-or-category}/{ref-or-slug}/` |
| Brand list | `lib/taxonomy.ts` |
| Category list | `lib/taxonomy.ts` |
| WhatsApp message format | `lib/whatsapp.ts` |
| WhatsApp number | `.env.local` (`NEXT_PUBLIC_WA_NUMBER`) |
| Site config (name, contact) | `lib/site.ts` |
| Product page template | `app/watches/[brand]/[slug]/page.tsx` and `app/jewellery/[category]/[slug]/page.tsx` |
| Brand grid page | `app/watches/[brand]/page.tsx` |
| Catalogue grid (filters) | `app/components/Filters.tsx`, `app/components/ProductGrid.tsx` |
| Bracelet selector | `app/components/BraceletSelector.tsx` |
| Rolex build script | `scripts/build-rolex-catalogue.mjs` |
| Rolex image organiser | `scripts/organize-rolex-images.mjs` |
| Detailed Rolex catalogue notes | `docs/rolex-catalogue.md` |
| Ring builder spec (future) | `docs/ring-builder.md` |

---

## 12. What to do before pushing changes

Quick checklist:

1. `pnpm build` — must succeed, no errors.
2. `pnpm dev` and click through the page(s) you changed. Check images load and the WhatsApp button opens with the right message.
3. `git status` — review what's changed.
4. `git diff data/products.csv` — sanity-check CSV edits.
5. Commit with a descriptive message: `git commit -m "add Patek Nautilus 5811/1A"`.
6. `git push`.

If the build fails or you're unsure, don't push until it's fixed.
