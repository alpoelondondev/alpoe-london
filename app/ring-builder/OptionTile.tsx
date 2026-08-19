"use client";

/**
 * One option: its icon, with its name underneath.
 *
 * ── Why a plain <img> ──
 *
 * These are the reference library's own selector icons — 100px line drawings at
 * three to twenty kilobytes, and SVG for the metals. Putting them through
 * next/image would add an optimisation round trip that cannot make a 3 KB PNG
 * smaller, and SVG needs `dangerouslyAllowSVG` turned on globally to pass
 * through at all. They are served straight from /public with a year-long cache
 * and a content hash in the filename, which is the whole benefit next/image
 * would have provided here.
 *
 * `width`/`height` are set so the browser reserves the box before the icon
 * arrives. Forty-six tiles reflowing as they load is the entire page jumping.
 */

type Props = {
  label: string;
  icon?: string;
  active: boolean;
  /**
   * Offered, but not for the current stone. Shown rather than hidden — a rail
   * that silently loses four of its fifteen cards when you change shape reads
   * as a bug, and the customer cannot learn the constraint from an absence.
   */
  unavailable?: boolean;
  title?: string;
  onSelect: () => void;
  /**
   * Fetch this option's render before it is chosen.
   *
   * Fired on pointer entry rather than on click, which buys the 200–300ms
   * between a mouse arriving on a tile and the button going down — long enough
   * for a 21 KB WebP on nearly any connection, so the ring changes in the same
   * frame as the press. On touch there is no hover, but `pointerdown` still
   * lands roughly 100ms ahead of the click, which is not nothing.
   */
  onPrefetch?: () => void;
};

export default function OptionTile({
  label,
  icon,
  active,
  unavailable,
  title,
  onSelect,
  onPrefetch,
}: Props) {
  return (
    <button
      type="button"
      onClick={onSelect}
      onPointerEnter={onPrefetch}
      onPointerDown={onPrefetch}
      onFocus={onPrefetch}
      title={title ?? label}
      aria-pressed={active}
      // `data-haptic` is what DragCarousel looks for when deciding whether a
      // press deserves a tick — it only does that automatically for links, and
      // a rail of buttons feels dead under the thumb without it.
      data-haptic
      className={`group flex w-[86px] shrink-0 snap-start flex-col items-center gap-1.5 border px-1.5 py-2 transition-[border-color,transform,background-color,opacity] duration-200 max-sm:w-[76px] ${
        active
          ? "border-accent-deep bg-accent/[0.10]"
          : unavailable
            ? "border-sheet-line opacity-40 hover:opacity-70"
            : "border-sheet-line hover:border-sheet-ink/40 active:scale-[0.97]"
      }`}
    >
      <span className="relative flex aspect-square w-full items-center justify-center overflow-hidden bg-white">
        {icon ? (
          // eslint-disable-next-line @next/next/no-img-element -- see the note above
          <img
            src={icon}
            alt=""
            width={100}
            height={100}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-contain p-1"
          />
        ) : (
          // A hairline ring rather than a grey box: it reads as part of the
          // design instead of as absence.
          <span aria-hidden className="block h-[38%] w-[38%] rounded-full border border-sheet-line" />
        )}
      </span>
      <span
        className={`block text-center text-[8px] leading-[1.25] tracking-[0.08em] uppercase transition ${
          active ? "text-sheet-ink" : "text-sheet-ink/60 group-hover:text-sheet-ink/90"
        }`}
      >
        {label}
      </span>
    </button>
  );
}
