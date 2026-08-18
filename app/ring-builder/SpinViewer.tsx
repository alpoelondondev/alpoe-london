"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SPIN_FRAMES } from "@/lib/ring/spins";

/**
 * Drag to rotate a real, photographed ring.
 *
 * A flipbook, and deliberately so — no WebGL, no geometry, no shader. The
 * pointer moves, the frame index changes, an image swaps. Every frame is a
 * photograph of the actual piece, which is why it looks the way it looks.
 *
 * Three things carry the whole illusion:
 *
 *  1. **Every frame is decoded before the first drag.** Fetching on demand
 *     means the first turn stutters through a spinner at each new angle, and
 *     the object stops feeling like an object. So the sequence loads, reports
 *     progress, and only then becomes draggable.
 *
 *  2. **All frames stay in the DOM, stacked, with visibility toggled.** The
 *     obvious implementation swaps one `<img>`'s `src`, but a browser will
 *     happily present a blank frame for one paint while it decodes, and at
 *     drag speed that reads as flicker. Keeping decoded elements and changing
 *     which is visible costs a little memory and removes the problem entirely.
 *
 *  3. **The drag wraps.** A ring photographed all the way round has no ends,
 *     so keep turning and it keeps turning. Clamping at frame 0 or 35 would
 *     make the object feel like a slider, which is exactly what it isn't.
 */

type Props = {
  frames: string[];
  /** For the alt text and the loading line. */
  label: string;
  className?: string;
};

/** Pixels of horizontal travel per frame. Tuned so a full turn is a comfortable
 *  sweep rather than a flick — about 430px across the whole 36. */
const PX_PER_FRAME = 12;

export default function SpinViewer({ frames, label, className }: Props) {
  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(0);
  const [index, setIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Preload. Decoding up front is what makes the first drag smooth.
  useEffect(() => {
    if (frames.length === 0) return;
    let cancelled = false;
    let done = 0;

    const images = frames.map((src) => {
      const img = new Image();
      const tick = () => {
        if (cancelled) return;
        done++;
        setLoaded(done);
        if (done === frames.length) setReady(true);
      };
      img.onload = tick;
      // A missing frame must not hang the sequence for ever — count it and move
      // on, so a gap in the shoot degrades to a small jump rather than a
      // permanently loading viewer.
      img.onerror = tick;
      img.src = src;
      return img;
    });

    return () => {
      cancelled = true;
      for (const img of images) {
        img.onload = null;
        img.onerror = null;
      }
    };
  }, [frames]);

  const drag = useRef({ active: false, startX: 0, startIndex: 0, moved: false });

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!ready) return;
      drag.current = {
        active: true,
        startX: e.clientX,
        startIndex: index,
        moved: false,
      };
      // Safe to capture immediately here, unlike in the option carousel: there
      // is nothing inside this to click, so retargeting the click costs nothing.
      e.currentTarget.setPointerCapture(e.pointerId);
      if (navigator.vibrate) navigator.vibrate(6);
    },
    [ready, index],
  );

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.startX;
    if (Math.abs(dx) > 3) drag.current.moved = true;

    // Dragging right turns the ring towards you, which is the direction people
    // expect when they think they have taken hold of the object itself.
    const steps = Math.round(-dx / PX_PER_FRAME);
    const next = (((drag.current.startIndex + steps) % SPIN_FRAMES) + SPIN_FRAMES) % SPIN_FRAMES;
    setIndex(next);
  }, []);

  const endDrag = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    drag.current.active = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }, []);

  // Keyboard access: a drag-only control is unusable without a pointer.
  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const delta = e.key === "ArrowRight" ? 1 : -1;
    setIndex((i) => (((i + delta) % SPIN_FRAMES) + SPIN_FRAMES) % SPIN_FRAMES);
  }, []);

  if (frames.length === 0) return null;

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={`${label}, rotatable`}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={onKeyDown}
      className={`relative touch-none select-none outline-none ${
        ready ? "cursor-grab active:cursor-grabbing" : "cursor-progress"
      } ${className ?? ""}`}
    >
      {/* Every frame stays mounted. See note 2 — swapping a single src flickers
          at drag speed, because the browser can paint before it has decoded. */}
      {frames.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt={i === 0 ? label : ""}
          aria-hidden={i !== 0}
          draggable={false}
          className={`absolute inset-0 h-full w-full object-contain p-12 max-md:p-8 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}

      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-[10px] tracking-[0.2em] uppercase text-sheet-dim">
            Loading the turn… {Math.round((loaded / frames.length) * 100)}%
          </p>
        </div>
      )}

      {ready && (
        <p className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.2em] uppercase text-sheet-dim">
          Drag to turn
        </p>
      )}
    </div>
  );
}
