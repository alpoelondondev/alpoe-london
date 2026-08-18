"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShuffleText } from "./Loader";
import HeroLockup from "./HeroLockup";
import { LOCKUP_ASPECT } from "./heroLockupShapes";

gsap.registerPlugin(ScrollTrigger);

/**
 * One length drives the whole hero: the lockup's own size and the eyebrow
 * below it. The cap wins on desktop, the vw term takes over on phones, and the
 * vh term stops the lockup outgrowing a short window — the section is well
 * short of a full viewport now, and the bar eats the top of what is left, so
 * height is the binding constraint on anything but a tall desktop.
 */
/**
 * The vh term is written as a height and converted, rather than carried as a
 * hand-tuned width. It guards against a short window, so what it is really
 * capping is the lockup's height — and a width that was correct for one
 * artwork stops being correct the moment the artwork's proportions change.
 * Derived from the aspect, it holds at 55vh whatever the lockup does next.
 */
const LOCKUP_MAX_HEIGHT_VH = 44;
const LOCKUP_WIDTH = `min(92vw, 1100px, ${(LOCKUP_MAX_HEIGHT_VH * LOCKUP_ASPECT).toFixed(1)}vh)`;
/**
 * How far the lockup's box is lifted off the hero's floor. The eyebrow sits
 * ~34px below the mark and is only ever a line tall, so centring the mark on
 * its own leaves the pair sitting low in the band. Half the eyebrow block,
 * give or take, puts the *group* on the centre line instead.
 */
const LOCKUP_GROUP_LIFT = "48px";

/** Half the lockup's height as a fraction of its width, for the eyebrow. */
const LOCKUP_HALF_HEIGHT_RATIO = 1 / (2 * LOCKUP_ASPECT);

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
      // Short of the viewport by the brand strip's height plus a little, so
      // that strip is already on screen at rest rather than needing a scroll
      // to discover — but only a little: cut deeper and the bar eats so much
      // of what is left that the lockup has nowhere to sit. The 70px is the
      // strip — py-4 (32) + hairline borders (2) + the loop, which is its logo
      // height plus the 10% hover padding either side (30 * 1.2 = 36). The vh
      // term absorbs the strip's slimming so the hero itself stays put and
      // the saved height goes to the page below. Retune both if that logo
      // height changes; the min-h keeps the lockup breathing on a short
      // laptop.
      className="h-[calc(92svh-70px)] min-h-[600px] relative overflow-hidden flex flex-col justify-end bg-bg px-[52px] pb-[60px] max-md:px-3 max-md:pb-12"
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

      {/* The page ground, with the mark cut out of it for the footage to play
          through. It paints the whole hero on its own — see the bleed in
          HeroLockup — rather than being a patch inside a separate backdrop,
          which is what previously left a hairline of video along the top edge
          wherever the two disagreed by a sub-pixel. */}
      {/* Inset from the top by the bar's height so the mark centres in the
          band you can actually see, not in the section's own box — half of
          which the bar sits over. The floor is lifted by LOCKUP_GROUP_LIFT
          because the eyebrow hangs below the mark: centre the mark alone and
          the pair reads low. The ground bleeds far past this layer (see
          HeroLockup), so offsetting it leaves no seam. */}
      <div
        className="absolute inset-x-0 z-3 pointer-events-none"
        style={{ top: "var(--nav-h)", bottom: LOCKUP_GROUP_LIFT }}
        aria-hidden="true"
      >
        <HeroLockup width={LOCKUP_WIDTH} />
      </div>

      {/* Shares the lockup layer's box exactly — the eyebrow is positioned
          off the same 50% line, so the two have to be measuring the same
          band or the line drifts away from the mark. */}
      <div
        ref={eyebrowRef}
        className="absolute inset-x-0 z-4 opacity-0 pointer-events-none"
        style={{ top: "var(--nav-h)", bottom: LOCKUP_GROUP_LIFT }}
      >
        {/* Pinned below the lockup rather than flowed after it, since the
            lockup is centred on the section and not on this pair. It takes the
            frame's full width and justifies into it, so the line runs exactly
            as long as the frame whichever phrase is showing. The size tracks
            that same length, holding the pairing from phone to desktop. */}
        <p
          className="absolute left-1/2 flex -translate-x-1/2 font-medium uppercase text-accent"
          style={{
            top: `calc(50% + (${LOCKUP_WIDTH}) * ${LOCKUP_HALF_HEIGHT_RATIO} + 34px)`,
            width: LOCKUP_WIDTH,
            // Sized off the lockup so the pairing holds — but with a floor, or
            // a phone's narrow lockup drives this down to about 7px, which is
            // where the rose on off-black stops being readable at all.
            fontSize: `max(12px, calc((${LOCKUP_WIDTH}) * 0.019))`,
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
