import {
  LOCKUP_ASPECT,
  LOCKUP_BOX,
  LOCKUP_MONOGRAM_PATHS,
  LOCKUP_RULES,
  LOCKUP_WORDS,
  LOCKUP_VIEWBOX,
} from "./heroLockupShapes";

/**
 * How far past the lockup's own box its ground is painted, in artwork units.
 * The box is ~2100 units wide, so this covers any viewport the lockup could
 * sit in with room to spare.
 */
const BLEED = 20000;

/**
 * The lockup as a window onto the hero's footage.
 *
 * Rather than painting the mark, this paints the page ground *around* it: a
 * rect covering the lockup's box, masked so that everywhere the lockup's shapes
 * fall is cut away. The video sits behind it in the hero, so it shows through
 * the monogram, the frame and both words at once.
 *
 * It is masked inside SVG — mask on an <svg> rect — rather than with a CSS
 * mask-image on a div. That is the part that lets the words stay live text: a
 * CSS mask has to point at an image, and a data-URI SVG is a separate document
 * with no access to the page's fonts, so <text> in one falls back to a system
 * face. Here the mask content renders in the page and picks up the webfonts.
 *
 * The hero is responsible for covering the rest of itself; this only owns its
 * own box.
 */
export default function HeroLockup({
  width,
  maskId = "hero-lockup-mask",
}: {
  width: string;
  /** Distinct per instance — two lockups on a page would collide on one id. */
  maskId?: string;
}) {
  return (
    <svg
      viewBox={LOCKUP_VIEWBOX}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      // overflow-visible is what lets the ground rect below paint past this
      // element's own box and cover the rest of the hero.
      style={{ width, aspectRatio: `${LOCKUP_ASPECT}`, overflow: "visible" }}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Alpoe London"
    >
      <defs>
        <mask id={maskId}>
          {/* White keeps, black cuts: cover the box, then subtract the mark. */}
          <rect
            x={LOCKUP_BOX.x - BLEED}
            y={LOCKUP_BOX.y - BLEED}
            width={LOCKUP_BOX.width + BLEED * 2}
            height={LOCKUP_BOX.height + BLEED * 2}
            fill="#fff"
          />
          <g fill="#000">
            {LOCKUP_MONOGRAM_PATHS.map((d, i) => (
              <path key={i} d={d} />
            ))}
            {LOCKUP_RULES.map((r, i) => (
              <rect key={i} {...r} />
            ))}
            {LOCKUP_WORDS.filter((w) => w.knockout).map((w) =>
              w.glyphs.map((g, i) => (
                <g key={`${w.word}-${i}`} transform={g.transform}>
                  <path d={g.d} />
                </g>
              )),
            )}
          </g>
        </mask>
      </defs>

      {/* Deliberately far larger than the lockup: this single rect is the hero's
          entire ground, so there is no seam between it and a separate backdrop
          to leak a hairline of footage at the box's edge. */}
      <rect
        x={LOCKUP_BOX.x - BLEED}
        y={LOCKUP_BOX.y - BLEED}
        width={LOCKUP_BOX.width + BLEED * 2}
        height={LOCKUP_BOX.height + BLEED * 2}
        fill="var(--color-bg)"
        mask={`url(#${maskId})`}
      />

      {/* Painted over the ground rather than cut out of it. */}
      {LOCKUP_WORDS.filter((w) => !w.knockout).map((w) =>
        w.glyphs.map((g, i) => (
          <g key={`${w.word}-${i}`} transform={g.transform} fill="var(--color-accent)">
            <path d={g.d} />
          </g>
        )),
      )}
    </svg>
  );
}
