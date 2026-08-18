"use client";

import Image from "next/image";

/**
 * One option: a picture of the ring, with its name underneath.
 *
 * Images only. There was a live-render fallback here that generated the ring
 * from geometry whenever no photograph existed; it has gone along with the rest
 * of the 3D. A tile now shows a picture, or it shows its name — and the name is
 * where the meaning lives either way, which is also what keeps the grid usable
 * for anyone browsing with images off.
 */

type Props = {
  value: string;
  label: string;
  /** The artwork for this option, if we have it. */
  photo?: string;
  active: boolean;
  disabled?: boolean;
  title?: string;
  onSelect: () => void;
};

export default function OptionTile({
  label,
  photo,
  active,
  disabled,
  title,
  onSelect,
}: Props) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      title={title ?? label}
      aria-pressed={active}
      // `data-haptic` is what DragCarousel looks for when deciding whether a
      // press deserves a tick — it only does that automatically for links, and
      // a rail of buttons feels dead under the thumb without it.
      data-haptic
      className={`group flex w-[124px] shrink-0 snap-start flex-col items-center gap-2 border p-2 transition-[border-color,transform,background-color] duration-200 max-sm:w-[104px] ${
        active
          ? "border-accent bg-accent/[0.07]"
          : disabled
            ? "cursor-not-allowed border-fg/[0.06] opacity-30"
            : "border-fg/[0.12] hover:border-fg/45 active:scale-[0.97]"
      }`}
    >
      <span className="relative block aspect-square w-full overflow-hidden bg-white">
        {photo ? (
          <Image
            src={photo}
            alt=""
            fill
            sizes="(max-width: 640px) 30vw, 160px"
            className="object-cover"
          />
        ) : (
          // A hairline ring rather than a grey box: it reads as part of the
          // design instead of as absence, which matters when several tiles are
          // waiting on artwork at once.
          <span aria-hidden className="absolute inset-0 flex items-center justify-center">
            <span className="block h-[42%] w-[42%] rounded-full border border-sheet-line" />
          </span>
        )}
      </span>
      <span
        className={`block text-center text-[9px] leading-tight tracking-[0.12em] uppercase transition ${
          active ? "text-fg" : "text-fg/65 group-hover:text-fg/90"
        }`}
      >
        {label}
      </span>
    </button>
  );
}
