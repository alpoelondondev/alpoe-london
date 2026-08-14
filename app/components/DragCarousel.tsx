"use client";

import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Generous enough that a wobbly mouse click still follows the card link.
const DRAG_THRESHOLD = 12;

/** Short tap haptic on supporting devices; never blocks navigation. */
function tapHaptic() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(8);
  }
}

/**
 * Horizontal snap scroller with click-and-drag panning for mouse users.
 * Touch devices pan natively. Shared so every carousel on the site feels
 * identical — pass gaps, gutters and snap strength via `className`.
 */
export default function DragCarousel({
  className = "",
  ariaLabel,
  drift,
  driftTrigger,
  children,
}: {
  className?: string;
  ariaLabel?: string;
  /**
   * Opt in to a resting position driven by the page's vertical scroll,
   * "reverse" running the rail the other way. Off by default — every existing
   * carousel stays put until it is touched.
   */
  drift?: "forward" | "reverse";
  /**
   * The scroll track that drives the drift. Pass the tall, sticky-pinned
   * section and the rail travels across exactly the span that section is
   * parked — hand the same ref to several rails and they move as one. Omit it
   * and the rail drives itself off its own trip across the viewport.
   */
  driftTrigger?: RefObject<HTMLElement | null>;
  children: ReactNode;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const drag = useRef({
    active: false,
    startX: 0,
    startScroll: 0,
    moved: false,
    captured: false,
  });

  /** Where scroll progress alone would put the rail, before any manual drag. */
  const lastBase = useRef(0);
  /** How far the user has dragged away from that base. Kept, never reset. */
  const userOffset = useRef(0);
  /**
   * Counts writes this component made, so the scroll handler can tell its own
   * work from a genuine user scroll. A boolean would drop offsets when several
   * writes land before their scroll events do.
   */
  const pendingProgrammatic = useRef(0);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el || !drift) return;
    const track = driftTrigger?.current;

    // Below md the pin is dropped and the rails are simply swiped by hand, so
    // there is no track to read a position off. Reduced motion opts out on the
    // same grounds.
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const st = ScrollTrigger.create({
        trigger: track ?? el,
        // Against a pinned track, progress spans exactly the parked phase:
        // 0 as it takes hold, 1 as it lets go. Standalone, the rail drives
        // itself across its own trip through the viewport.
        start: track ? "top top" : "top bottom",
        end: track ? "bottom bottom" : "bottom top",
        onUpdate: (self) => {
          const max = el.scrollWidth - el.clientWidth;
          if (max <= 0) return;
          const p = drift === "reverse" ? 1 - self.progress : self.progress;
          lastBase.current = p * max;
          // Manual drags ride on top of the scroll position rather than
          // cancelling it, so the page never snatches the rail back from
          // under a finger that has just moved it.
          const target = Math.min(max, Math.max(0, lastBase.current + userOffset.current));
          if (Math.abs(el.scrollLeft - target) < 0.5) return;
          pendingProgrammatic.current += 1;
          el.scrollLeft = target;
        },
      });
      return () => st.kill();
    });

    return () => mm.revert();
  }, [drift, driftTrigger]);

  const onScroll = () => {
    if (!drift) return;
    if (pendingProgrammatic.current > 0) {
      pendingProgrammatic.current -= 1;
      return;
    }
    const el = scrollerRef.current;
    if (el) userOffset.current = el.scrollLeft - lastBase.current;
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Haptic whenever the press lands on a card link, mouse or touch. Cards
    // that aren't links opt in with data-haptic — otherwise a carousel of
    // plain panels feels dead under the thumb next to the linked ones.
    if ((e.target as HTMLElement).closest?.("a, [data-haptic]")) tapHaptic();

    if (e.pointerType !== "mouse") return;
    const el = scrollerRef.current;
    if (!el) return;
    // Deliberately no setPointerCapture here: capturing on pointerdown
    // retargets the following click to this container, so card links never
    // fire. Capture is taken in onPointerMove once a drag really starts.
    drag.current = {
      active: true,
      startX: e.clientX,
      startScroll: el.scrollLeft,
      moved: false,
      captured: false,
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el || !drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) <= DRAG_THRESHOLD) return; // still a click, not a drag
    if (!drag.current.captured) {
      drag.current.captured = true;
      drag.current.moved = true;
      el.setPointerCapture(e.pointerId);
      // Snap fights a manual drag, so suspend it until the pointer is released.
      el.style.scrollSnapType = "none";
    }
    el.scrollLeft = drag.current.startScroll - dx;
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el || !drag.current.active) return;
    drag.current.active = false;
    if (drag.current.captured) {
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      drag.current.captured = false;
      el.style.scrollSnapType = "";
    }
  };

  // A drag that ends on a card must not follow its link.
  const onClickCapture = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!drag.current.moved) return;
    e.preventDefault();
    e.stopPropagation();
    drag.current.moved = false;
  };

  return (
    <div
      ref={scrollerRef}
      role="region"
      aria-label={ariaLabel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={onClickCapture}
      onScroll={onScroll}
      // Snap is left off a drifting rail: it fights the scroll-driven
      // position, dragging the rail back to a card edge on every frame.
      className={`flex overflow-x-auto ${drift ? "" : "snap-x"} scrollbar-none touch-pan-x cursor-grab active:cursor-grabbing select-none ${className}`}
    >
      {children}
    </div>
  );
}
