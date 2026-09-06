# Rolex Catalogue

Status: **live.** The 94 Rolex references in `scripts/build-rolex-catalogue.mjs`
are in `data/products.csv` and rendering on the site. (Said "84 unique sheet
references plus 9 orphan/2 legacy rows" until 6 Sep 2026; the mapping has grown
to 94 and the orphan/legacy split no longer changes what is emitted.)

> **Two bugs in this pipeline were fixed on 6 Sep 2026.** Both meant that
> running step 3 below — the documented way to add a reference — silently
> damaged data that was already correct:
>
> 1. `listImages()` filtered for `.png`, but every Rolex image has been `.webp`
>    since the images moved to `scripts/build-product-images.py`. It matched
>    nothing, so a regeneration blanked the `images` column on **51 rows** and
>    dropped the photography from 51 product pages.
> 2. The generator still wrote "Sourced to order through Alpoe London" into
>    descriptions and `stock_state: "sourceable"` on legacy/orphan rows. The
>    rest of the codebase settled on in-stock only — `StockState` in
>    `lib/types.ts` admits one value — so a regeneration reverted **94 meta
>    descriptions and 92 descriptions** and put the "In Stock" badge back into
>    contradiction with the copy beneath it.
>
> Both are fixed, and the script now reproduces the committed
> `data/products.csv` byte-for-byte. That is worth re-checking after any change
> here: `cp data/products.csv /tmp/before && node scripts/build-rolex-catalogue.mjs && diff /tmp/before data/products.csv`
> should print nothing.

## How the catalogue is generated

Source of truth for the **`data/products.csv` Rolex slice**: the `REFS` object
inside `scripts/build-rolex-catalogue.mjs`.

Not to be confused with the *other* catalogue: `data/catalogue.csv` (300 rows)
is the live-sheet stock list, refreshed from Joe's published Google Sheet by
`pnpm refresh:catalogue` and read from disk at build time by `lib/catalogue.ts`.
The site no longer fetches that sheet at runtime — see commit dae469d, "Read the
catalogue from a file, not from Google". The two feed different pages and
neither writes to the other.

The pipeline is:

1. Joe edits the sheet.
2. Sheet exported as CSV (or pasted into the build script).
3. `node scripts/build-rolex-catalogue.mjs` regenerates the Rolex slice of `data/products.csv`. **Idempotent** — running twice produces zero diff.
4. `pnpm build` rebuilds the site.

The 84-ref mapping lives **inline** in `scripts/build-rolex-catalogue.mjs` as a JS object. To update the catalogue, edit that object and re-run the script. Non-Rolex rows are preserved untouched.

## Image organisation

Every reference that has photography lives at:

```
public/products/rolex/{ref-lowercase}/01-<what-it-is>.webp, 02-…, 03-…, …
```

The build script auto-discovers files in each folder and builds the `images` column. References with no folder (or empty folders) emit empty `images` and the PDP shows the "High-resolution photography on request" placeholder from `app/components/ProductGallery.tsx`.

To add images to a reference:

1. Build the images with `python3 scripts/build-product-images.py rolex` from a
   row in `data/image-sources/rolex.tsv` — that writes
   `public/products/rolex/{ref-lowercase}/01-<what-it-is>.webp`, `02-…`, etc.
   (This step said "drop PNGs" until 6 Sep 2026. The tree holds 142 images and
   every one is WebP; the script that reads them accepts `.webp`, `.png`,
   `.jpg` and `.jpeg`, so a hand-dropped file still works, but WebP built from
   the TSV is the real path.)
2. Re-run `node scripts/build-rolex-catalogue.mjs`.
3. Commit the changes to `data/products.csv`.

`scripts/organize-rolex-images.mjs` sorted a bulk press-kit drop named
`imgi_{order}_m{ref}-{variant}.png` into per-reference folders. It is **legacy**
as of 6 Sep 2026: no `imgi_*` files remain under `public/`, so it is a no-op,
and it emits `1.png` rather than the `01-<what-it-is>.webp` the rest of the
pipeline expects. Use `data/image-sources/rolex.tsv` +
`python3 scripts/build-product-images.py rolex` instead.

## Bracelet selection

Many Rolex references can be supplied on multiple bracelets (Datejusts on Oyster *or* Jubilee, Sky-Dwellers on Oyster/Jubilee/Oysterflex). The catalogue stores all valid bracelets per reference in the `bracelets` CSV column (pipe-separated).

On the product page:

- **Multiple bracelets** → `BraceletSelector` renders a radio group. Customer picks one. The WhatsApp enquiry link reflects that choice at click time.
- **Single bracelet** → no selector shown. The WhatsApp message does not mention the bracelet (it's implicit in the reference).

WhatsApp message format with bracelet:

> Hi, I'm interested in the Rolex Datejust 41 (Ref: 126334) on Jubilee bracelet. Is it available?

The component graph:

```
app/watches/[brand]/[slug]/page.tsx (server)
└─ <WatchOptions product={product} /> (client)
   ├─ <BraceletSelector /> (when bracelets.length > 1)
   └─ <EnquireCTA product={product} bracelet={selected} /> (recomputes href on every render)
```

`buildEnquiryMessage(product, opts)` in `lib/whatsapp.ts` is the message composer. The `opts` shape (`EnquiryOptions`) is forward-compatible — when we later add dial selection ("INCLUDE ALL DIAL VARIATIONS" in the sheet for Day-Date and Datejust), pass `{ dial }` alongside `bracelet` and the message picks it up without a refactor.

## Reference inventory

As of last script run (counts may drift as Joe updates the sheet):

| Bucket | Count |
|---|---|
| Total Rolex rows in CSV | 94 |
| Sheet refs with images | 51 |
| Sheet refs image-on-request | 33 |
| Orphans (have images, not in sheet — kept as `sourceable`) | 9 |
| Legacy placeholders (116610LN, 116500LN — preserved) | 2 |

The 9 orphans (mostly Yacht-Master 40/42/37 and one Datejust 31): 126621, 126622, 126655, 226627, 226658, 226659, 268622, 279178, 336235.

## Schema notes

`data/products.csv` columns (header order):

```
id,type,brand,category,model,nickname,slug,title,description,
stock_state,materials,gemstones,carat,dial,case_size,movement,
reference_number,year,condition,bracelets,images,featured,
meta_title,meta_description,placeholder
```

`bracelets` column is pipe-separated (e.g. `Oyster|Jubilee`). Empty for non-Rolex products.

`lib/types.ts` `Product.bracelets?: string[]`. `lib/products.ts` parses the column tolerantly — if the column is missing or empty, the field is `undefined`.

## Defaults applied to new rows

When the build script generates a row for a sheet entry without per-piece data, it uses:

- `stock_state`: `in_stock` (Rolex sheet refs are real held stock; orphans and legacy placeholders fall back to `sourceable`)
- `condition`: `Unworn`
- `year`: `2024`
- `featured`: `false` (except Batman, which is `true` from the legacy row)
- `dial`: empty (will be populated when dial selection is wired up)

## When Joe updates the sheet

To add new references or change existing ones:

1. Edit the inline mapping in `scripts/build-rolex-catalogue.mjs`. The mapping mirrors the sheet structure with one entry per reference.
2. If new images, drop them into `public/products/rolex/{ref-lowercase}/`.
3. Run `node scripts/build-rolex-catalogue.mjs`.
4. Run `pnpm build` to confirm everything compiles and the new pages prerender.
5. Commit `data/products.csv`, the script change, and any new images together.

## Out of scope (future tickets)

- **Per-piece pricing** — schema unchanged; "Price on Request" remains the displayed price.
- **In-stock tagging** — Joe will mark individual references `in_stock` per their inventory.
- **Dial variation selection** — the sheet flags "INCLUDE ALL DIAL VARIATIONS" for Day-Date and Datejust. Implement using the same pattern as bracelet selection: add `dials?: string[]` to `Product`, render a second selector, pass `dial` through `buildEnquiryMessage`.
- **Other watch brands** — Patek/AP/Cartier/etc. use placeholder rows until Joe adds their tabs to the sheet. Same script pattern can fan out to per-brand builders.
- **Jewellery sheet ingestion** — same approach: separate sheet/script when ready.
- **Multi-tab Google Sheets fetch** — currently a manual paste-as-CSV import. If Joe updates the sheet often, automate via the published-CSV URL or Sheets API.
