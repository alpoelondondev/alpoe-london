import { LOCKUP_ASPECT } from "./heroLockupShapes";

/** Generated from the same path data by scripts/build-lockup-svg.mjs. */
const LOCKUP_SRC = "/alpoe-london-lockup-mark.svg";

/**
 * The full lockup — AP monogram, frame and both words — painted flat in one
 * colour.
 *
 * ── Why this is a mask and not inline SVG ──
 *
 * It used to render the compound path inline: about 28,000 characters of
 * geometry. The bar and the footer both draw it, so every document on the site
 * carried it twice over — and twice again inside the RSC payload, since both
 * are server-rendered. That is roughly 100KB of identical artwork in every
 * page, which no browser can cache between pages because it is not a file.
 *
 * As a CSS mask it is one 27KB file, fetched once for the whole site and cached
 * like any other asset. A mask rather than an `<img>` because every call site
 * passes a colour: the artwork supplies the alpha and `background-color`
 * supplies the paint, so one file serves the mark in any colour.
 *
 * Nothing was outlined to make this work. LOCKUP_WORDS and LOCKUP_RULES have
 * been empty since ALPOE and LONDON were merged into the compound path, so the
 * words are geometry and always were — there is no webfont in the mark to lose.
 *
 * The hero keeps the inline paths, because it punches the footage through them
 * with an SVG mask element and needs the geometry in the document to do it.
 */
export default function LockupMark({
  width,
  fill = "currentColor",
  className = "",
}: {
  /** Any CSS length — the height follows from the artwork's aspect. */
  width: string | number;
  fill?: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{
        display: "block",
        width,
        aspectRatio: `${LOCKUP_ASPECT}`,
        backgroundColor: fill,
        maskImage: `url(${LOCKUP_SRC})`,
        WebkitMaskImage: `url(${LOCKUP_SRC})`,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        // `contain` rather than the default, so the mark scales to whatever
        // width it is given instead of being cropped at its natural size.
        maskSize: "contain",
        WebkitMaskSize: "contain",
        maskPosition: "center",
        WebkitMaskPosition: "center",
      }}
    />
  );
}
