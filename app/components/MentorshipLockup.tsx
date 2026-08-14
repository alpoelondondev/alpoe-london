import {
  LOCKUP_BOX,
  LOCKUP_MONOGRAM_PATHS,
  LOCKUP_RULES,
  LOCKUP_TEXT,
} from "./heroLockupShapes";

/**
 * The hero lockup cut into a rose-gold ground, with MENTORSHIP set beneath it.
 *
 * The hero paints this same artwork as a *mask* so its footage plays through
 * the letterforms. There is no footage here — the ground is one flat colour —
 * so the shapes are painted straight on in the page ground's own colour. The
 * result on screen is identical to a knockout, without a mask to keep in
 * register.
 *
 * Everything stays in the artwork's coordinate space, as `heroLockupShapes`
 * insists: the monogram, the frame and the two words were drawn against each
 * other, and MENTORSHIP is positioned in those same units rather than in a box
 * of its own.
 */

/** Air between the frame's bottom rule and MENTORSHIP's cap line. */
const GAP = 170;
/** Cap height of MENTORSHIP, a little over LONDON's 69. */
const MENT_CAP = 104;
/** Open Sans' cap ratio, as used for LONDON in the lockup. */
const OPEN_SANS_CAP_RATIO = 0.7139;
const MENT_BASELINE = LOCKUP_BOX.y + LOCKUP_BOX.height + GAP + MENT_CAP;

/** Breathing room around the mark, inside the rose ground. */
const PAD_X = 260;
const PAD_TOP = 240;
const PAD_BOTTOM = 230;

const VIEW = {
  x: LOCKUP_BOX.x - PAD_X,
  y: LOCKUP_BOX.y - PAD_TOP,
  width: LOCKUP_BOX.width + PAD_X * 2,
  height: MENT_BASELINE - LOCKUP_BOX.y + PAD_TOP + PAD_BOTTOM,
};

export default function MentorshipLockup({
  className = "",
  ground = true,
}: {
  className?: string;
  /**
   * Paint the rose ground as part of the artwork. Turn it off where the ground
   * is already rose and something is sitting behind the mark — the panel's own
   * rect would paint straight over it.
   */
  ground?: boolean;
}) {
  return (
    <svg
      viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.width} ${VIEW.height}`}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Alpoe London Mentorship"
    >
      {/* The rose ground itself, so the panel is the artwork rather than a
          coloured box with artwork sitting on it. */}
      {ground ? (
        <rect
          x={VIEW.x}
          y={VIEW.y}
          width={VIEW.width}
          height={VIEW.height}
          fill="var(--color-accent)"
        />
      ) : null}

      <g fill="var(--color-bg)">
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
        {/* Tracked to the lockup's exact width, so the word reads as part of
            the mark rather than a caption parked under it. */}
        <text
          x={LOCKUP_BOX.x}
          y={MENT_BASELINE}
          fontSize={MENT_CAP / OPEN_SANS_CAP_RATIO}
          textLength={LOCKUP_BOX.width}
          lengthAdjust="spacing"
          className="font-opensans"
        >
          MENTORSHIP
        </text>
      </g>
    </svg>
  );
}
