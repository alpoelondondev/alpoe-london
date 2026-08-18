"use client";

import type { ReactNode } from "react";
import DragCarousel from "../components/DragCarousel";

/**
 * One row of options: a label, the current choice, and a horizontal rail.
 *
 * The rail is the site's own `DragCarousel`, which already solves the part of
 * this that is genuinely hard — a drag must never fire a selection, and a tap
 * must never be swallowed by the drag handler. Its trick is withholding
 * `setPointerCapture` on pointerdown: capturing there silently retargets the
 * following click to the container, so nothing inside the rail ever receives
 * it. Capture is taken only once movement passes a 12px threshold, and a
 * click-capture guard cancels the click if a drag did happen. Touch is left to
 * the platform, which gives real momentum scrolling for free and behaves better
 * than any hand-rolled inertia.
 *
 * What it does not do on its own is fire a haptic for anything that is not a
 * link — it looks for `a, [data-haptic]`. The tiles here are buttons, so they
 * opt in with `data-haptic`, and a rail of them feels alive under the thumb
 * rather than dead.
 *
 * A note on "desktop haptics": there is no haptic API on the desktop web.
 * `navigator.vibrate` is Android-only and silently ignored by iOS and every
 * desktop browser. So on a pointer device the equivalent feedback has to be
 * visual and immediate — a border that responds on hover and a press state that
 * moves — which is what the tiles do.
 */
export default function OptionRow({
  label,
  value,
  children,
  hint,
}: {
  label: string;
  /** The current choice, shown beside the label rather than below the rail. */
  value?: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="py-10 max-md:py-8">
      <div className="mx-auto flex max-w-6xl items-baseline justify-between gap-6 px-[52px] max-md:px-6">
        <p className="text-[10px] tracking-[0.22em] uppercase text-dim">{label}</p>
        {value && (
          <p className="text-right text-[13px] tracking-[0.04em] text-blush">{value}</p>
        )}
      </div>

      {/* The rail bleeds to the page edges so a card can sit half off-screen —
          that overflow is the affordance telling you there is more to scroll,
          and boxing it inside the gutter loses it. The first and last cards get
          the gutter back as padding so nothing starts flush against the edge. */}
      <DragCarousel
        ariaLabel={label}
        className="mt-4 gap-3 px-[52px] py-1 max-md:px-6"
      >
        {children}
      </DragCarousel>

      {hint && (
        <div className="mx-auto mt-4 max-w-6xl px-[52px] max-md:px-6">{hint}</div>
      )}
    </section>
  );
}
