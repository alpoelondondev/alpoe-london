"use client";

import { useRef, type ReactNode, type RefObject } from "react";

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
  scrollerRef: externalRef,
  onScroll,
  noSnap = false,
  children,
}: {
  className?: string;
  ariaLabel?: string;
  /**
   * Handle on the scroll container, for callers that position the rail
   * themselves — a scroll-driven rail needs to write `scrollLeft` from outside.
   */
  scrollerRef?: RefObject<HTMLDivElement | null>;
  onScroll?: () => void;
  /**
   * Drop scroll snapping. Required of any rail whose position is being driven
   * from outside: snap fights the write and drags the rail back to a card edge
   * on every frame.
   */
  noSnap?: boolean;
  children: ReactNode;
}) {
  const internalRef = useRef<HTMLDivElement>(null);
  const scrollerRef = externalRef ?? internalRef;
  const drag = useRef({
    active: false,
    startX: 0,
    startScroll: 0,
    moved: false,
    captured: false,
  });

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
      className={`flex overflow-x-auto ${noSnap ? "" : "snap-x"} scrollbar-none touch-pan-x cursor-grab active:cursor-grabbing select-none ${className}`}
    >
      {children}
    </div>
  );
}
