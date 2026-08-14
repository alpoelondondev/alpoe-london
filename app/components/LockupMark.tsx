import {
  LOCKUP_ASPECT,
  LOCKUP_MONOGRAM_PATHS,
  LOCKUP_RULES,
  LOCKUP_TEXT,
  LOCKUP_VIEWBOX,
} from "./heroLockupShapes";

/**
 * The full lockup — AP monogram, frame and both words — painted flat in one
 * colour.
 *
 * The hero draws this same artwork as a mask so its footage plays through the
 * letterforms; wherever the ground is a flat colour there is nothing to see
 * through, so the shapes are simply painted. Sized from a width, since the
 * artwork's own aspect decides the height.
 *
 * The words stay live `<text>` rather than outlines, which is only possible
 * because this is inline SVG in the page and can reach the webfonts.
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
    <svg
      viewBox={LOCKUP_VIEWBOX}
      className={className}
      style={{ width, aspectRatio: `${LOCKUP_ASPECT}` }}
      fill={fill}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      {LOCKUP_MONOGRAM_PATHS.map((d, i) => (
        <path key={i} d={d} />
      ))}
      {LOCKUP_RULES.map((r, i) => (
        <rect key={i} {...r} />
      ))}
      {LOCKUP_TEXT.map((t) => (
        <text
          key={t.word}
          x={t.x}
          y={t.y}
          fontSize={t.fontSize}
          textLength={t.textLength}
          lengthAdjust="spacing"
          className={t.className}
        >
          {t.word}
        </text>
      ))}
    </svg>
  );
}
