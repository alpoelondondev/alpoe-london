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
