#!/usr/bin/env node
/**
 * Write public/alpoe-london-lockup-mark.svg from the same path data the hero
 * uses, so the file and the inline artwork cannot drift apart.
 *
 * The lockup is one compound path of about 28,000 characters. It was rendered
 * inline by LockupMark, which the bar and the footer both draw — so every
 * document on the site carried it twice, and carried it twice again inside the
 * RSC payload: roughly 100KB of identical artwork per page that no browser
 * could ever cache between pages. As a file it is fetched once for the whole
 * site and cached like any other asset.
 *
 * It is emitted black and used as a CSS mask, not as paint: the colour comes
 * from `background-color` on the element, so one file serves every place the
 * mark appears in any colour, which an <img> could not do.
 *
 * There is deliberately no font here and nothing to outline — LOCKUP_WORDS and
 * LOCKUP_RULES have been empty since ALPOE and LONDON were merged into the
 * compound path, so the mark has been pure geometry for some time.
 *
 *     node scripts/build-lockup-svg.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SRC = join(process.cwd(), "app", "components", "heroLockupShapes.ts");
const OUT = join(process.cwd(), "public", "alpoe-london-lockup-mark.svg");

const ts = readFileSync(SRC, "utf8");

const box = ts.match(
  /export const LOCKUP_BOX = \{ x: (-?[\d.]+), y: (-?[\d.]+), width: ([\d.]+), height: ([\d.]+) \}/,
);
if (!box) throw new Error("LOCKUP_BOX not found — has heroLockupShapes.ts changed shape?");
const [, x, y, w, h] = box;

const block = ts.match(/export const LOCKUP_MONOGRAM_PATHS = \[(.*?)\n\];/s);
if (!block) throw new Error("LOCKUP_MONOGRAM_PATHS not found");
const paths = [...block[1].matchAll(/"(M [^"]+)"/g)].map((m) => m[1]);
if (!paths.length) throw new Error("no path data in LOCKUP_MONOGRAM_PATHS");

// fill-rule nonzero is the SVG default and the counters in A, P, O and the
// frame depend on it — stated rather than assumed, since this file is read by
// the mask compositor rather than by the renderer the paths were authored for.
const svg =
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}">` +
  paths.map((d) => `<path fill="#000" fill-rule="nonzero" d="${d}"/>`).join("") +
  `</svg>\n`;

writeFileSync(OUT, svg);
console.log(
  `alpoe-london-lockup-mark.svg written: ${paths.length} path(s), ${Math.round(svg.length / 1024)}KB`,
);
