/* "AP" monogram — a crossbar-less serif A beside a bowl form, in the house
   rose gold.

   The two glyphs arrived as separate drawings in different coordinate systems
   (the A in a 400x400 box, the bowl in a 450x440 one) and at different sizes:
   measured on their ink rather than their boxes, the A stood 302.2 units tall
   and the bowl 332.4, so dropping them side by side would have set the bowl
   about 10% taller than the A.

   They are composed here rather than in the markup. Each glyph keeps its
   original path data untouched and is placed by a transform that normalises its
   *ink* — not its viewBox — to a shared 300-unit cap height, tops and bottoms
   flush, with a 44-unit gap between them. That keeps the lockup's geometry in
   one place and leaves the source drawings editable.

   The supplied artwork also carried an opaque #1a1a1a background rect. It is
   dropped: the mark sits on the translucent, blurred nav bar, where a solid
   plate would read as a dark square punched through it. */

/** Ink-tight: no padding, so the mark can be positioned off its own edges. */
export const MONOGRAM_SIZE = { width: 704.6, height: 300 };

export const MONOGRAM_VIEWBOX = `0 0 ${MONOGRAM_SIZE.width} ${MONOGRAM_SIZE.height}`;

/** For sizing the lockup from a height, or a width, alone. */
export const MONOGRAM_ASPECT = MONOGRAM_SIZE.width / MONOGRAM_SIZE.height;

export const MONOGRAM_GLYPHS: { transform: string; paths: string[] }[] = [
  {
    // A — scaled 0.99272, ink origin shifted to 0,0.
    transform: "translate(-39.71,-49.44) scale(0.99272)",
    paths: [
      "M 160 54 L 160 50 L 260 50 L 260 54 C 245 54, 235 56, 230 70 L 320 330 C 325 345, 340 348, 360 348 L 360 352 L 220 352 L 220 348 C 240 348, 250 345, 255 330 L 195 100 L 120 330 C 125 345, 140 348, 160 348 L 160 352 L 40 352 L 40 348 C 60 348, 80 345, 95 330 L 180 70 C 175 56, 165 54, 160 54 Z",
    ],
  },
  {
    // P — scaled 0.90253 to match the A's cap height, then set to its right.
    // One stroke only: the bowl and its two bars. An earlier drawing carried a
    // second path spurring off the stem at x-height; the current artwork drops
    // it. Its ink sat inside the bowl's own bounds (x 40–265 of 40–420,
    // y 105–125 of 50–390), so removing it leaves the glyph's box — and the
    // cap-height normalisation above — untouched.
    transform: "translate(325.57,-48.56) scale(0.90253)",
    paths: [
      "M 40 50 L 220 50 A 200 170 0 0 1 220 390 L 130 390 L 130 355 L 220 355 A 110 132.5 0 0 0 220 85 L 40 85 Z",
    ],
  },
];

/**
 * The lockup as a standalone SVG document, for use as a CSS `mask-image`.
 * Explicit width/height give it an intrinsic aspect ratio, without which
 * `mask-size: <width> auto` has nothing to resolve the `auto` against.
 */
export const MONOGRAM_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${MONOGRAM_SIZE.width}" height="${MONOGRAM_SIZE.height}" viewBox="${MONOGRAM_VIEWBOX}">` +
    MONOGRAM_GLYPHS.map(
      (glyph) =>
        `<g transform="${glyph.transform}">` +
        glyph.paths.map((d) => `<path d="${d}" fill="#000"/>`).join("") +
        `</g>`,
    ).join("") +
    `</svg>`,
)}")`;
