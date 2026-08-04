// Downloads manufacturer stock photography into public/products/<brand>/<refKey>/.
//
// Source maps live in data/image-sources/<brand-slug>.tsv as
//   <reference>\t<url>\t<provenance note>
// with "#" comment lines. Reference -> folder uses the same fold as referenceKey()
// in lib/catalogue.ts, so "5811/1G-001" lands in "5811-1g-001".
//
// Brand DAMs serve originals at 3000px+/10MB; the site only ever renders these at
// card and detail width, so each is resampled to 600px wide to match the existing
// Rolex set. Re-running is safe: an existing file is left alone unless --force.
//
// Usage: node scripts/fetch-catalogue-images.mjs <brand-slug> [--force] [--dry-run]
import { readFileSync, existsSync, mkdirSync, writeFileSync, rmSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TARGET_WIDTH = 600;

const [brandSlug, ...flags] = process.argv.slice(2);
const force = flags.includes("--force");
const dryRun = flags.includes("--dry-run");

if (!brandSlug) {
  console.error("usage: node scripts/fetch-catalogue-images.mjs <brand-slug> [--force] [--dry-run]");
  process.exit(1);
}

const srcPath = join(ROOT, "data", "image-sources", `${brandSlug}.tsv`);
if (!existsSync(srcPath)) {
  console.error(`no source map at data/image-sources/${brandSlug}.tsv`);
  process.exit(1);
}

const referenceKey = (r) =>
  r.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const rows = readFileSync(srcPath, "utf8")
  .split("\n")
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith("#"))
  .map((l) => {
    const [reference, url, note] = l.split("\t");
    return { reference, url, note };
  });

let written = 0;
let skipped = 0;
let failed = 0;

for (const { reference, url, note } of rows) {
  if (!reference || !url) {
    console.warn(`skip (malformed row): ${reference ?? "?"}`);
    failed++;
    continue;
  }
  const dir = join(ROOT, "public", "products", brandSlug, referenceKey(reference));
  const dest = join(dir, "1.png");

  if (existsSync(dest) && !force) {
    console.log(`· ${reference.padEnd(14)} exists, skipping`);
    skipped++;
    continue;
  }
  if (dryRun) {
    console.log(`→ ${reference.padEnd(14)} would fetch ${url}`);
    continue;
  }

  mkdirSync(dir, { recursive: true });
  const tmp = join(dir, ".download.tmp");
  try {
    execFileSync("curl", ["-sS", "-L", "--fail", "--max-time", "120", "-o", tmp, url]);
    // sips resamples in place; width-only keeps the DAM's portrait aspect.
    execFileSync("sips", ["--resampleWidth", String(TARGET_WIDTH), tmp, "--out", dest], {
      stdio: "ignore",
    });
    const kb = Math.round(statSync(dest).size / 1024);
    console.log(`✓ ${reference.padEnd(14)} ${referenceKey(reference)}/1.png  ${kb}KB  — ${note ?? ""}`);
    written++;
  } catch (err) {
    console.error(`✗ ${reference.padEnd(14)} ${err.message.split("\n")[0]}`);
    failed++;
  } finally {
    if (existsSync(tmp)) rmSync(tmp);
  }
}

console.log(`\n${written} written, ${skipped} skipped, ${failed} failed (${rows.length} rows)`);
if (written) console.log("run `pnpm gen:data` to refresh the image manifest");
