# Operations Guide

Day-to-day instructions for running and updating the Alpoe London site. Written for non-developers — copy/paste the commands.

## TL;DR

| I want to… | Do this |
|---|---|
| Edit a product (price, stock, condition) | Edit `data/products.csv` directly, save, commit |
| Remove a watch from the site | Delete its row from `data/products.csv` (or from the Google Sheet, then `pnpm refresh:catalogue`). There is no sold / sourceable state — everything listed is held in stock. |
| Add new watch images | Add a row to `data/image-sources/{brand}.tsv`, run `python3 scripts/build-product-images.py {brand}`, `pnpm gen:data`, then upload `public/products` to R2 (see `lib/assets.ts`) |
| Add a new Rolex reference | Edit `scripts/build-rolex-catalogue.mjs`, add the entry, run `node scripts/build-rolex-catalogue.mjs` |
| Add a non-Rolex watch (Patek/AP/etc.) | Add a row to `data/products.csv` directly |
| Add a jewellery item | Add a row to `data/products.csv` directly |
| Preview the site locally | `pnpm dev`, open <http://localhost:3000> |
| Push changes live | `git add . && git commit -m "..." && git push` |
| Change the WhatsApp number | Set `NEXT_PUBLIC_WA_NUMBER` in **Vercel's** environment variables and redeploy — see section 9. Editing `.env.local` only changes your own machine. |

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
| `images` | Pipe-separated image paths | `/products/rolex/126610lv/01-submariner-green.webp\|/products/rolex/126610lv/02-submariner-green-clasp.webp` |
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
>     rclone sync public/products r2:alpoe-ring-renders/site/products \
>       --header-upload "Cache-Control: public, max-age=31536000, immutable" --s3-no-check-bucket
>
> `sync`, not `copy`: renaming a file leaves the old object behind for ever otherwise, and the
> bucket pays for it. Sync deletes whatever is in `site/products` and not in `public/products`,
> so run it against a full, freshly built library — never against a partial one. Check the plan
> with `--dry-run` first if the rename touched many files.
>
> Every file is normalised on the way out: the watch is cut from its backdrop (a shot on white
> paper is flood-filled away from the edges), trimmed to what is actually visible — the Rolex
> renders' soft shadow is deliberately not counted — and re-mounted centred on a 4:5 canvas at a
> fixed size. That is why the brands look alike in one grid, and why `object-cover` on the product
> gallery no longer crops: the file is the same shape as the frame. Changing `CANVAS_RATIO`,
> `CONTENT_W/H` or `ALPHA_FLOOR` means rebuilding everything (`all --force`) and re-uploading.
>
> The manifest stamps every path with `?v=<hash>`, so replacing a file and re-uploading is safe.
> **The sheet is not live any more.** `data/catalogue.csv` is what the site reads.
> Edit the sheet, run `pnpm refresh:catalogue` to pull it into that file, check the
> diff, and commit — the deploy is what publishes it. The site used to fetch the
> sheet itself every ten minutes, which meant a spreadsheet edit changed the live
> site unreviewed and no page showing a listing could be static.
>
> Listings the Google Sheet does not carry yet go in `data/catalogue-extra.csv` (same four columns);
> a row there disappears automatically once the sheet has the same brand / reference / variant.
> The PNG drop-in instructions below still describe the folder layout but the format is now WebP.

## 2. Adding new Rolex images

You already have 142 Rolex press-kit images organised under `public/products/rolex/{ref}/`. To add more:

1. Get the new images. Name them `01-<what-it-is>.webp`, `02-…` per reference — the number orders the set (01 is the hero) and the rest says which configuration it is.
2. Drop them into `public/products/rolex/{ref-lowercase}/`. If the folder doesn't exist, create it.
3. From the project root, run:
   ```
   node scripts/build-rolex-catalogue.mjs
   ```
4. The script auto-discovers the new files and updates `data/products.csv`. Commit.

**Legacy path, for a bulk press-kit drop only.** If images arrive in the old
shape (`imgi_42_m126610lv-0001.png`) you can drop them into
`public/products/rolex/` and run `node scripts/organize-rolex-images.mjs` to
sort them into per-reference folders. Two warnings before you do:

- It is currently a no-op — there are no `imgi_*` files anywhere under
  `public/`, so it finds nothing.
- It names its output `1.png`, `2.png`, which is **not** the convention above.
  Rename to `01-<what-it-is>.webp` before running the catalogue script, or you
  will put unoptimised, undescribed images into `data/products.csv`.

The maintained path is a row in `data/image-sources/rolex.tsv` followed by
`python3 scripts/build-product-images.py rolex`, which writes the optimised
800px WebP with the descriptive name.

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
4. For images, **use the build script rather than dropping files in by hand** — see the TL;DR row above and section 3. Add a row to `data/image-sources/{brand}.tsv`, run `python3 scripts/build-product-images.py {brand}`, then `pnpm gen:data`. That writes `public/products/{brand-slug}/{reference-key}/{nn}-{description}.webp` — note it is keyed on the **reference**, not the slug, and the output is **WebP at 800px**, not a JPEG you supply. Then reference the paths in the `images` column with `|` separators, as bare `/products/…` paths:

   ```
   /products/patek-philippe/5726-1a-014/01-nautilus-5726-annual-calendar-steel-bracelet-blue.webp
   ```

   That is a real path from the current tree. Most references carry one image;
   where there are several they are numbered in order (`01-`, `02-`, …) and the
   row order in the TSV is the image order, so never reorder rows within a
   reference. `public/products/rolex/126234/` is a ten-image example.

   *(Corrected 6 Sep 2026. This step used to say "drop them into `public/products/{brand-slug}/{slug}/`" with a `1.jpg` example — the wrong directory key and the wrong file type, and it contradicted the TL;DR at the top of this document. The `|`-separated `images` column part was and remains right.)*
5. Save, commit.

The brand must already exist in `lib/taxonomy.ts`. Currently supported: Rolex, Patek Philippe, Audemars Piguet, Richard Mille, Cartier, Hublot, Omega, Breitling. To add a brand not on that list, edit `lib/taxonomy.ts` first.

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
- **Naming**: lowercase, hyphens, no spaces, `NN-` first. `01-royal-oak-blue-dial.webp`, `02-…` for multi-angle.
- **Where**: `public/products/{brand-or-category}/{ref-or-slug}/`. The path you put in the CSV must exactly match the actual file path.
- **What not to do**: don't hot-link images from other websites. Always host your own.

The site automatically converts to AVIF/WebP and serves the right resolution per device. No manual optimisation needed.

---

## 9. WhatsApp enquiries

Every product page has an "Enquire on WhatsApp" button. The message is auto-composed from the product data, including the bracelet the customer chose (for multi-bracelet Rolex refs).

The phone number is read from the environment variable `NEXT_PUBLIC_WA_NUMBER`,
**falling back to the number written in `lib/site.ts`** (`SITE.whatsapp`).

As of 6 Sep 2026 that variable is **not set anywhere**, so the live site is using
the fallback. Two consequences worth knowing before you change anything:

- **`.env.local` is gitignored and local-only.** It is not deployed, and it does
  not currently contain `NEXT_PUBLIC_WA_NUMBER` at all. Editing it changes the
  number on your machine and nowhere else — this document used to say "edit
  `.env.local` and redeploy", which would have looked like it worked in `pnpm
  dev` and changed nothing in production.
- `NEXT_PUBLIC_*` variables are **inlined at build time**, so setting one always
  needs a fresh deploy; editing the value alone does nothing.

To change the number for real, pick one:

1. **Set it in Vercel** → Project → Settings → Environment Variables →
   `NEXT_PUBLIC_WA_NUMBER` → all environments → redeploy. Best if the number
   may differ per environment.
2. **Edit the fallback** in `lib/site.ts` and commit. Simplest, and it is what
   the site is actually using today.

Note `SITE.phone` is a separate field (the display number, `+44 7380 401226`).
Change both, or the page will show one number and dial another.

Never hardcode the number in a component.

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

**The build stops with "Route guard found N problem(s)"**

This runs *before* the site build, so nothing has compiled yet — it is not a
broken page. Every internal link on the site is named once in `lib/routes.ts`,
and the guard refuses a build that would ship a dead or unreachable link. The
message names the file, the line and the fix. The usual causes:

- **"Unregistered page"** — a new page was added without a token. Add one to
  `STATIC_ROUTES` in `lib/routes.ts`.
- **"hardcoded ..."** — a link was written as a plain string like `"/watches"`.
  Use the token (`ROUTES.watches`) instead.
- **"public/llms.txt lists ..."** — that file names a URL nothing serves. Fix
  the URL or restore the page.
- **"Orphan route"** — a page exists but nothing links to it.

Run it on its own with `pnpm check:routes`. If you are only editing
`data/products.csv`, this check cannot be the cause — it does not read the CSV.

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
| WhatsApp number | `lib/site.ts` (`SITE.whatsapp`), overridable by `NEXT_PUBLIC_WA_NUMBER` in Vercel |
| Site config (name, contact) | `lib/site.ts` |
| Product page template | `app/watches/[brand]/[slug]/page.tsx` and `app/jewellery/[category]/[slug]/page.tsx` |
| Brand grid page | `app/watches/[brand]/page.tsx` |
| Catalogue grid (filters) | `app/components/Filters.tsx`, `app/components/ProductGrid.tsx` |
| Bracelet selector | `app/components/BraceletSelector.tsx` |
| Rolex build script | `scripts/build-rolex-catalogue.mjs` |
| Rolex image organiser (legacy, no-op) | `scripts/organize-rolex-images.mjs` |
| Product image builder (current) | `scripts/build-product-images.py` + `data/image-sources/*.tsv` |
| Detailed Rolex catalogue notes | `docs/rolex-catalogue.md` |
| Ring builder (live) | `app/ring-builder/`, `lib/ring/`, current doc `docs/ring-builder-renders.md` |
| Ring builder — original plan, superseded | `docs/ring-builder.md` |
| Route registry (every URL on the site) | `lib/routes.ts` |
| Route guard (runs in `pnpm build`) | `scripts/check-routes.mjs` |

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
