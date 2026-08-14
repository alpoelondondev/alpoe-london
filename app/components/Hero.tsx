"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShuffleText } from "./Loader";
import { LOGO_PATHS } from "./logoPaths";

gsap.registerPlugin(ScrollTrigger);

/**
 * One length drives the knockout mask, the hairline that traces it and the
 * eyebrow's offset below it, so the three can never drift out of register.
 * The cap wins on desktop; the vw term takes over on phones.
 */
const MARK_WIDTH = "min(86vw, 560px)";
/** Half the wordmark's height, as a fraction of its width (126 ÷ 201 ÷ 2). */
const MARK_HALF_HEIGHT_RATIO = 0.3134;

/**
 * The wordmark as a mask image. Explicit width/height give the SVG an intrinsic
 * aspect ratio, without which `mask-size: <width> auto` has nothing to resolve
 * the `auto` against.
 */
const WORDMARK_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="201" height="126" viewBox="12 42 201 126">${LOGO_PATHS.map(
    (d) => `<path d="${d}" fill="#000"/>`,
  ).join("")}</svg>`,
)}")`;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // React only reflects `muted` on first render, so anything that flips it later
  // (an extension, a restored media session) would leave the hero audible.
  const keepMuted = () => {
    const video = videoRef.current;
    if (video && !video.muted) video.muted = true;
  };

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
      className="h-screen relative overflow-hidden flex flex-col justify-end bg-bg px-[52px] pb-[60px] max-md:px-3 max-md:pb-12"
    >
      {/* Decorative footage, full-bleed: silent, uninteractive, and no
          user-agent transport controls. It keeps its full framing — the
          overlay above decides how much of it you actually see. */}
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
        poster="/alpoe-luxury-watches-hero-hatton-garden.jpg"
        onVolumeChange={keepMuted}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover pointer-events-none"
      >
        <source
          src="/alpoe-luxury-watches-hero-hatton-garden.mp4"
          type="video/mp4"
        />
      </video>

      {/* Solid page ground laid over the whole hero with the wordmark punched
          out of it, so the only footage that shows is what falls inside the
          letterforms. Two mask layers composited as XOR do the punching: the
          gradient covers everything, the wordmark subtracts itself from it.
          Should a browser ignore mask-composite the layers simply add, the
          overlay stays solid, and the hairline below leaves an outlined
          wordmark on off-black — dulled, but never broken. */}
      <div
        className="absolute inset-0 z-3 bg-bg pointer-events-none"
        style={{
          maskImage: `${WORDMARK_MASK}, linear-gradient(#000, #000)`,
          WebkitMaskImage: `${WORDMARK_MASK}, linear-gradient(#000, #000)`,
          maskSize: `${MARK_WIDTH} auto, auto`,
          WebkitMaskSize: `${MARK_WIDTH} auto, auto`,
          maskPosition: "center, center",
          WebkitMaskPosition: "center, center",
          maskRepeat: "no-repeat, no-repeat",
          WebkitMaskRepeat: "no-repeat, no-repeat",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
        }}
      />

      <div
        ref={eyebrowRef}
        className="absolute inset-0 z-4 opacity-0 pointer-events-none"
      >
        {/* Hairline tracing the cutout. Watch footage runs dark, and without an
            edge the letterforms dissolve into the off-black around them. */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 aspect-[201/126]"
          style={{ width: MARK_WIDTH }}
        >
          <svg
            viewBox="12 42 201 126"
            className="h-full w-full"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
            aria-label="Alpoe London"
          >
            {LOGO_PATHS.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="0.7"
              />
            ))}
          </svg>
        </div>

        {/* Pinned below the cutout rather than flowed after it, since the mask
            centres the wordmark on the section and not on this pair. Set to the
            mark's own width and justified, so the line runs exactly as long as
            LONDON does above it whichever phrase is showing; the size tracks the
            same length so the pairing holds from phone to desktop. */}
        <p
          className="absolute left-1/2 flex -translate-x-1/2 uppercase text-accent"
          style={{
            top: `calc(50% + (${MARK_WIDTH}) * ${MARK_HALF_HEIGHT_RATIO} + 30px)`,
            width: MARK_WIDTH,
            fontSize: `calc((${MARK_WIDTH}) * 0.038)`,
          }}
        >
          <ShuffleText fill />
        </p>
      </div>
      <div ref={contentRef} className="relative z-4">
        <h1 className="sr-only">
          Alpoe London — Luxury Watches &amp; Bespoke Jewellery, Hatton Garden
        </h1>
      </div>
    </section>
  );
}
