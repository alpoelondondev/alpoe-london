"use client";

import { useCallback, useRef, useState } from "react";

/**
 * One frame of the viewer, with press-and-hold to magnify.
 *
 * ── The gesture, and why it needs a delay ──
 *
 * Hold to zoom and drag to change view are the same two events — pointer down,
 * pointer move — so something has to tell them apart. The rule is time before
 * movement: hold still for a moment and you are inspecting; move first and you
 * are swiping. `HOLD_MS` is the fork.
 *
 * 260ms is deliberate. Much shorter and a slow swipe zooms by accident, which
 * is maddening because it fights the thing you were doing. Much longer and it
 * stops feeling like a response to your finger and starts feeling like a bug
 * you triggered. It is roughly where iOS puts its own long press.
 *
 * Movement before the timer cancels it outright, so the carousel gets the drag
 * it was expecting and the zoom never fires. Movement *after* it pans instead,
 * because by then the customer is holding a magnifier, not a page.
 *
 * ── Why the events stop here once zoomed ──
 *
 * The rail underneath is a DragCarousel listening for exactly these events on
 * its container. While the zoom is active every move is consumed with
 * `stopPropagation`, or panning the magnifier would scroll the rail sideways at
 * the same time and the ring would run away from the finger examining it.
 *
 * ── Panning ──
 *
 * `transform-origin` rather than translating the image. Origin is expressed as
 * a percentage of the element, which is exactly what a pointer position gives
 * you, so the point under the finger stays under the finger at any scale — no
 * arithmetic relating scale to offset, and nothing to get wrong at the edges.
 */

const HOLD_MS = 260;
const MOVE_CANCELS_PX = 10;
const SCALE = 2.4;

/** Short tap, matching DragCarousel's. Android only; silently ignored elsewhere. */
function haptic() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) navigator.vibrate(8);
}

export default function ZoomView({
  src,
  alt,
  eager,
}: {
  src: string;
  alt: string;
  eager: boolean;
}) {
  const [zoomed, setZoomed] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const box = useRef<HTMLDivElement>(null);
  const timer = useRef<number | null>(null);
  const start = useRef({ x: 0, y: 0 });

  const cancelTimer = () => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  };

  /** Pointer position as a percentage of the frame, clamped to it. */
  const originFrom = useCallback((clientX: number, clientY: number) => {
    const el = box.current;
    if (!el) return "50% 50%";
    const r = el.getBoundingClientRect();
    const x = Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100));
    const y = Math.min(100, Math.max(0, ((clientY - r.top) / r.height) * 100));
    return `${x}% ${y}%`;
  }, []);

  const onPointerDown = (e: React.PointerEvent) => {
    // A right-click or a second finger is not an inspection gesture.
    if (e.button !== 0 && e.pointerType === "mouse") return;
    start.current = { x: e.clientX, y: e.clientY };
    const { clientX, clientY, pointerId } = e;
    const el = e.currentTarget as HTMLElement;
    cancelTimer();
    timer.current = window.setTimeout(() => {
      setOrigin(originFrom(clientX, clientY));
      setZoomed(true);
      haptic();
      // Capture so the zoom survives the pointer leaving the frame — without
      // it, panning to the edge of the ring drops you out of the gesture at
      // exactly the moment you were trying to look at something.
      try {
        el.setPointerCapture(pointerId);
      } catch {
        /* Capture can be refused if the pointer has already gone. */
      }
    }, HOLD_MS);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (zoomed) {
      // See the note above: the rail must not also receive this.
      e.stopPropagation();
      setOrigin(originFrom(e.clientX, e.clientY));
      return;
    }
    const dx = Math.abs(e.clientX - start.current.x);
    const dy = Math.abs(e.clientY - start.current.y);
    if (dx > MOVE_CANCELS_PX || dy > MOVE_CANCELS_PX) cancelTimer();
  };

  const end = (e: React.PointerEvent) => {
    cancelTimer();
    if (!zoomed) return;
    const el = e.currentTarget as HTMLElement;
    if (el.hasPointerCapture?.(e.pointerId)) el.releasePointerCapture(e.pointerId);
    setZoomed(false);
  };

  return (
    <div
      ref={box}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={end}
      onPointerCancel={end}
      // `none` only while zoomed: the rest of the time the browser needs
      // pan-x back, or the carousel cannot be swiped on a phone at all.
      style={{ touchAction: zoomed ? "none" : "pan-x" }}
      className="relative h-full w-full overflow-hidden"
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- see renderCache.ts */}
      <img
        src={src}
        width={900}
        height={900}
        alt={alt}
        decoding="async"
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "low"}
        draggable={false}
        style={{
          transform: zoomed ? `scale(${SCALE})` : "scale(1)",
          transformOrigin: origin,
        }}
        className="h-full w-full select-none object-contain transition-transform duration-200 ease-out"
      />
    </div>
  );
}
