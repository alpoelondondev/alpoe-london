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
 * the platform, which gives real momentum scrolling for free.
 *
 * What it does not do on its own is fire a haptic for anything that is not a
 * link — it looks for `a, [data-haptic]`. The tiles here are buttons, so they
 * opt in with `data-haptic`.
 *
 * ── Gutters ──
 *
 * This component no longer owns them. It used to bleed to the page edges with
 * a hard-coded `px-[52px]`, which was right when the rails ran the full width
 * of the page and wrong the moment they moved into a column beside the
 * viewport — the rail would have started 52px in from a column that is itself
 * inset. The parent sets the inset now, and passes it back as `bleed` so the
 * first and last card still clear the edge while the rail itself overflows.
 */
export default function OptionRow({
  label,
  value,
  children,
  hint,
  action,
  bleed = "px-6",
}: {
  label: string;
  /** The current choice, shown beside the label rather than below the rail. */
  value?: string;
  hint?: ReactNode;
  /**
   * A link that belongs to the row itself, set beside its label.
   *
   * Origin is the only row with something genuinely worth reading elsewhere,
   * and a paragraph of explanation under the rail is the wrong place for it —
   * it pushes every following control down the page to say something the
   * customer can get in one word. A link beside the label costs nothing and is
   * where somebody looks when they want to know more.
   */
  action?: ReactNode;
  /** Horizontal padding for the rail's own edges — the parent's inset. */
  bleed?: string;
  children: ReactNode;
}) {
  return (
    <section className="py-5">
      <div className={`flex items-baseline justify-between gap-4 ${bleed}`}>
        {/* Both weighted up. The site's body weight is 300, which is right for
            paragraphs on a dark ground and much too faint for an eleven-pixel
            uppercase label on white — the row headings and the current value
            are the two things a customer scans to know where they are, and at
            300 they read as greyed out rather than as headings. */}
        <p className="t-eyebrow flex items-baseline gap-3 font-semibold">
          {label}
          {action && (
            <span className="font-normal normal-case tracking-normal">{action}</span>
          )}
        </p>
        {value && (
          <p className="truncate text-right text-[13px] font-medium tracking-[0.02em] text-sheet-ink">
            {value}
          </p>
        )}
      </div>

      {/* The rail overflows its container so a card can sit half off-screen —
          that overflow is the affordance telling you there is more to scroll,
          and boxing it inside the inset loses it. The first and last cards get
          the inset back as padding so nothing starts flush against the edge. */}
      <DragCarousel ariaLabel={label} className={`mt-2.5 gap-2 py-1 ${bleed}`}>
        {children}
      </DragCarousel>

      {hint && <div className={`mt-3 ${bleed}`}>{hint}</div>}
    </section>
  );
}
