"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShuffleText } from "./Loader";
import LockupMark from "./LockupMark";
import { LOCKUP_ASPECT } from "./heroLockupShapes";

gsap.registerPlugin(ScrollTrigger);

/**
 * The mark is now the live rose gold lockup — the same GLB, the same sway and
 * the same travelling highlight the bar carries, just larger. It replaces the
 * flat SVG that used to be cut out of the hero's ground for the footage to
 * play through: the film sits behind the mark now rather than inside it.
 *
 * Imported by hand rather than through next/dynamic because the flat mark has
 * to be swapped *out* when the 3D one lands, not drawn underneath it: two
 * copies of the same artwork stacked leave a halo wherever their edges
 * disagree by a pixel. This way there is exactly one mark on screen at a time,
 * and three.js still stays out of the homepage's first bundle.
 */
type MonogramProps = { width?: number; height?: number };

/**
 * One length drives the whole hero: the lockup's own size and the eyebrow
 * below it. The cap wins on desktop, the vw term takes over on phones, and the
 * vh term stops the lockup outgrowing a short window — the section is well
 * short of a full viewport, and the bar eats the top of what is left, so
 * height is the binding constraint on anything but a tall desktop.
 *
 * The vh term is written as a height and converted rather than carried as a
 * hand-tuned width: what it really caps is the lockup's height, and a width
 * that was right for one artwork stops being right the moment the artwork's
 * proportions change.
 */
const LOCKUP_MAX_HEIGHT_VH = 44;
const LOCKUP_MAX_WIDTH_PX = 1100;
const LOCKUP_VIEWPORT_FRACTION = 0.92;

/**
 * The 3D mark is sized in pixels, not CSS: three.js needs a drawing buffer of
 * a known size, so the expression the flat lockup wrote as `min(92vw, 1100px,
 * 76vh)` has to be evaluated here and handed over as a number.
 */
function lockupWidth() {
  return Math.round(
    Math.min(
      window.innerWidth * LOCKUP_VIEWPORT_FRACTION,
      LOCKUP_MAX_WIDTH_PX,
      window.innerHeight * (LOCKUP_MAX_HEIGHT_VH / 100) * LOCKUP_ASPECT,
    ),
  );
}

/**
 * Whether this browser can draw the live mark at all. Asked before the chunk
 * is fetched, so a browser that cannot goes straight to the flat lockup rather
 * than downloading three.js to find out.
 */
function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl")),
    );
  } catch {
    return false;
  }
}

/**
 * How far the mark's box is lifted off the hero's floor. The eyebrow sits
 * below it and is only ever a line tall, so centring the mark on its own
 * leaves the pair sitting low in the band.
 */
const LOCKUP_GROUP_LIFT = "48px";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  // Null until measured: the size depends on the window, which does not exist
  // until the client runs, and guessing would mean re-initialising the scene a
  // frame later at the real size.
  const [markWidth, setMarkWidth] = useState<number | null>(null);
  const [Monogram3D, setMonogram3D] = useState<ComponentType<MonogramProps> | null>(
    null,
  );
  // Only true once we know the live mark is not coming: the chunk failed, or
  // this browser has no WebGL to draw it with.
  const [flatOnly, setFlatOnly] = useState(false);

  // After hydration, never during it. The slot stays *empty* while the chunk
  // is in flight rather than showing the flat mark first — drawing the flat
  // one and replacing it a moment later is a visible swap, and the hero is the
  // first thing on the page. The flat mark appears only if the 3D one cannot.
  useEffect(() => {
    let cancelled = false;

    if (!hasWebGL()) {
      setFlatOnly(true);
      return;
    }

    import("./Monogram3D")
      .then((m) => {
        if (!cancelled) setMonogram3D(() => m.default);
      })
      .catch(() => {
        if (!cancelled) setFlatOnly(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // React only reflects `muted` on first render, so anything that flips it later
  // (an extension, a restored media session) would leave the hero audible.
  const keepMuted = () => {
    const video = videoRef.current;
    if (video && !video.muted) video.muted = true;
  };

  // Measured on mount and on resize, debounced: every change tears the WebGL
  // context down and builds it again, which is fine once and wasteful sixty
  // times through a window drag.
  useEffect(() => {
    setMarkWidth(lockupWidth());
    let t: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(() => setMarkWidth(lockupWidth()), 150);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    const reveal = () => {
      if (eyebrowRef.current) {
        gsap.to(eyebrowRef.current, { opacity: 1, duration: 0.8 });
      }
    };

    // The clip buffers behind the splash (preload="auto") but holds on its first
    // frame — there is no autoPlay. Playback starts from the Enter click, which
    // is a real user gesture, so by then the footage is ready and permitted.
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.volume = 0;
    }

    // Loader.dismiss() also calls play() synchronously inside the click stack
    // for iOS; this runs on the event it fires straight afterwards.
    let entered = false;
    const start = () => {
      if (!video) return;
      video.muted = true;
      video.play().catch(() => {});
    };

    const onLoaded = () => {
      entered = true;
      start();
      reveal();
    };

    window.addEventListener("page-loaded", onLoaded);

    // Navigating back to the homepage remounts Hero, but the splash lives in
    // the layout and already fired page-loaded — without this the wordmark
    // would stay at opacity 0 and the film would never start. The same holds
    // while the splash is commented out of the layout entirely: with no
    // #loader mounted, nothing will ever fire page-loaded.
    if (window.__alpoeEntered || !document.getElementById("loader")) onLoaded();

    // Only once past the splash: if the UA still refused the gesture it would
    // paint its own start-playback button, so retry quietly on later input.
    const retry = () => {
      if (entered && video?.paused) start();
    };
    document.addEventListener("visibilitychange", retry);
    window.addEventListener("pointerdown", retry, { passive: true });
    window.addEventListener("touchstart", retry, { passive: true });

    // Hero scroll-out: fade and shift content up as user scrolls past
    if (contentRef.current && sectionRef.current) {
      gsap.to(contentRef.current, {
        y: -80,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "60% top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }

    return () => {
      window.removeEventListener("page-loaded", onLoaded);
      document.removeEventListener("visibilitychange", retry);
      window.removeEventListener("pointerdown", retry);
      window.removeEventListener("touchstart", retry);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      // Short of the viewport by the brand strip's height plus a little, so
      // that strip is already on screen at rest rather than needing a scroll
      // to discover. The 70px is the strip — py-4 (32) + hairline borders (2)
      // + the loop, which is its logo height plus the 10% hover padding either
      // side (30 * 1.2 = 36). Retune both if that logo height changes; the
      // min-h keeps the lockup breathing on a short laptop.
      className="h-[calc(92svh-70px)] min-h-[600px] relative overflow-hidden flex flex-col justify-end bg-bg px-[52px] pb-[60px] max-md:px-3 max-md:pb-12"
    >
      {/* Decorative footage, full-bleed: silent, uninteractive, and no
          user-agent transport controls. It runs behind the mark now rather
          than through it, so it is held well back — see the scrim below. */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        ref={videoRef}
        data-hero
        muted
        loop
        playsInline
        controls={false}
        disablePictureInPicture
        controlsList="nodownload noplaybackrate noremoteplayback"
        preload="auto"
        poster="/alpoe-london-hero.jpg"
        onVolumeChange={keepMuted}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-45 pointer-events-none"
      >
        <source src="/alpoe-london-hero.mp4" type="video/mp4" />
      </video>

      {/* The page ground laid back over the film: flat at 55% so the footage
          reads as a dark texture rather than a picture, and darker still at
          the top and bottom edges so the bar above and the brand strip below
          meet black rather than a bright frame of video. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-2 bg-bg/55 pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-2 bg-gradient-to-b from-bg via-transparent to-bg pointer-events-none"
      />

      {/* Mark and eyebrow share one box, inset from the top by the bar's height
          so they centre in the band you can actually see rather than in the
          section's own box — half of which the bar sits over. */}
      <div
        className="absolute inset-x-0 z-3 flex flex-col items-center justify-center pointer-events-none"
        style={{ top: "var(--nav-h)", bottom: LOCKUP_GROUP_LIFT }}
      >
        {markWidth ? (
          <>
            {/* The box is the mark's exact size whatever is inside it, so
                nothing below shifts as the live mark arrives. */}
            <div
              className="flex items-center justify-center"
              style={{
                width: markWidth,
                height: Math.round(markWidth / LOCKUP_ASPECT),
              }}
            >
              {Monogram3D ? (
                <Monogram3D
                  width={markWidth}
                  height={Math.round(markWidth / LOCKUP_ASPECT)}
                />
              ) : flatOnly ? (
                <LockupMark width={markWidth} fill="var(--color-accent)" />
              ) : null}
            </div>

            {/* Justified across the mark's own width, which is the device the
                wordmark uses to run LONDON the full width of ALPOE. Sized off
                that same length, with a floor: on a phone the proportional
                size lands around 7px, where rose on off-black stops being
                readable at all. */}
            <div ref={eyebrowRef} className="mt-[34px] opacity-0">
              <p
                className="flex font-medium uppercase text-accent"
                style={{
                  width: markWidth,
                  fontSize: Math.max(12, Math.round(markWidth * 0.019)),
                }}
              >
                <ShuffleText fill />
              </p>
            </div>
          </>
        ) : null}
      </div>

      <div ref={contentRef} className="relative z-4">
        <h1 className="sr-only">
          Alpoe London — Luxury Watches &amp; Bespoke Jewellery, Hatton Garden
        </h1>
      </div>
    </section>
  );
}
