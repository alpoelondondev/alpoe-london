/**
 * LEGACY — superseded, and a no-op as things stand.
 *
 * This sorted a bulk download of Rolex press-kit PNGs (named
 * `imgi_{order}_m{ref}-{variant}.png`) out of `public/products/rolex/` and into
 * per-reference folders as `{ref}/1.png`, `2.png`, …
 *
 * Two things have moved since:
 *
 *   1. There are no `imgi_*` files under `public/` any more, and nothing loose
 *      at the root of `public/products/rolex/`, so running this today finds
 *      zero files and does nothing.
 *   2. The naming it produces is obsolete. Images are now
 *      `{ref}/01-<what-it-is>.webp` — the number orders the set and the words
 *      say which configuration it is, which is what `describe()` in
 *      scripts/build-product-images.py relies on and what the site shows. A
 *      bare `1.png` carries neither, and is not the optimised 800px WebP the
 *      rest of the pipeline produces.
 *
 * The current path for adding photography is a row in
 * `data/image-sources/rolex.tsv` plus
 * `python3 scripts/build-product-images.py rolex`. Kept only in case another
 * bulk press-kit drop arrives in the old shape; if you use it, rename the
 * output before running the catalogue script, or you will put unoptimised,
 * undescribed images into data/products.csv.
 */

import { readdirSync, mkdirSync, renameSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(process.cwd(), "public", "products", "rolex");

const files = readdirSync(ROOT).filter((f) => f.endsWith(".png") && f.startsWith("imgi_"));

const groups = new Map();
for (const file of files) {
  const match = file.match(/^imgi_(\d+)_m([a-z0-9]+)-(\d+)\.png$/);
  if (!match) {
    console.warn("skip (no match):", file);
    continue;
  }
  const [, order, ref, variant] = match;
  if (!groups.has(ref)) groups.set(ref, []);
  groups.get(ref).push({ file, order: Number(order), variant: Number(variant) });
}

for (const [ref, items] of groups) {
  items.sort((a, b) => a.variant - b.variant || a.order - b.order);
  const dir = join(ROOT, ref);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  items.forEach((item, i) => {
    const dest = join(dir, `${i + 1}.png`);
    const src = join(ROOT, item.file);
    renameSync(src, dest);
    console.log(`${item.file}  →  ${ref}/${i + 1}.png`);
  });
}

console.log(`\nDone. ${groups.size} references, ${files.length} files organized.`);
