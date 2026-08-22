"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShuffleText } from "./Loader";
import LockupMark from "./LockupMark";
import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";
import { LOCKUP_ASPECT } from "./heroLockupShapes";
import { supportsWebGL } from "./webgl";
import { useDeferredUntilIdle } from "./useDeferredUntilIdle";
import { asset } from "@/lib/assets";

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
/**
 * The mark's size, trimmed to make room for the two controls beneath it.
 *
 * The controls sit inside the lockup group, which is absolutely positioned
 * between the bar and a fixed offset from the bottom, so nothing added to it
 * changes the hero's height. What it does change is how much room the mark has,
 * and a mark at the old 44vh left the buttons crowding the wordmark. Down to
 * 38vh and 0.82 of the viewport width, which reads as deliberate rather than
 * shrunken and gives the group somewhere to breathe.
 */
const LOCKUP_MAX_HEIGHT_VH = 38;
const LOCKUP_MAX_WIDTH_PX = 980;
const LOCKUP_VIEWPORT_FRACTION = 0.82;

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
 * How far the mark's box is lifted off the hero's floor. The eyebrow sits
 * below it and is only ever a line tall, so centring the mark on its own
 * leaves the pair sitting low in the band.
 */
const LOCKUP_GROUP_LIFT = "48px";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
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
  // Not on mount — once the browser is idle. Half a megabyte of three.js
  // fetched and evaluated during the hero's paint is the single largest thing
  // standing between a phone and its largest contentful paint, and the flat
  // lockup is already on screen in the meantime. See useDeferredUntilIdle.
  const idle = useDeferredUntilIdle();

  /*
   * Attach the film after the page has painted, and pick the encode by
   * viewport.
   *
   * What shipped here was a 12.7MB, 1920x960, 4.1Mbps H.264 with
   * `preload="auto"` — several megabytes downloaded before the page settled,
   * for a silent decorative loop sitting at 45% opacity behind a scrim. Worse,
   * because this <video> is the page's largest element, Chrome would not
   * record a largest contentful paint until the film painted a frame: LCP was
   * measuring the download of a texture.
   *
   * Re-encoded at CRF 30 it is 6.6MB and frame-for-frame indistinguishable
   * (macro diamond sparkle is genuinely expensive to compress; this is as far
   * as it goes without visible mush), and phones get a 1080-wide cut at 2.5MB
   * — a viewport 390 CSS pixels across has no use for 1920 of them. Attaching
   * it after `load` means the preloaded poster satisfies LCP and the film
   * arrives into a page that has already finished being a page.
   */
  useEffect(() => {
    if (!idle) return;
    const video = videoRef.current;
    if (!video || video.src) return;
    video.src = asset(
      window.matchMedia("(max-width: 900px)").matches
        ? "/alpoe-london-hero-1080.mp4"
        : "/alpoe-london-hero.mp4",
    );
    video.load();
    video.muted = true;
    video.play().catch(() => {
      /* A browser that refuses is left on the poster, which is the same frame. */
    });
  }, [idle]);

  useEffect(() => {
    let cancelled = false;

    if (!supportsWebGL()) {
      setFlatOnly(true);
      return;
    }
    if (!idle) return;

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
  }, [idle]);

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
      // A beat behind the wordmark. They are an offer rather than the
      // identity, so they should arrive after it has been read.
      //
      // `fromTo`, not `to`, and no `opacity-0` in the class list. The eyebrow
      // can afford to start hidden because it is decoration: if the reveal
      // never fires, the page is missing a flourish. These are the only two
      // ways to contact the shop from the hero, and a button that starts
      // invisible and waits for an animation is a button that does not exist
      // whenever that animation fails. Starting visible means the worst case is
      // no fade rather than no call to action.
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.7, delay: 0.35 },
        );
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
      {/*
        Tell the browser about the poster before it reaches the <video>.

        Lighthouse measured 2,611ms of "load delay" on mobile — the gap between
        the page being ready to fetch the LCP resource and actually starting
        to. A poster attribute is discovered late and fetched at low priority,
        so it queued behind the fonts, the stylesheets and every script chunk
        while the largest thing on screen stayed empty. Preloading it at high
        priority moves it to the front, where the element that defines the
        page's LCP belongs.

        React 19 hoists a bare <link> into the head from wherever it is
        rendered, so this does not need to live in `metadata`.
      */}
      <link
        rel="preload"
        as="image"
        href="/alpoe-london-hero-poster.webp"
        fetchPriority="high"
      />

      {/* Decorative footage, full-bleed: silent, uninteractive, and no
          user-agent transport controls. It runs behind the mark now rather
          than through it, so it is held well back — see the scrim below. */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        ref={videoRef}
        data-hero
        muted
        // `loop` alone was never enough, because nothing was starting it. The
        // clip was written to hold its first frame until the splash's Enter
        // click, which is a real user gesture and therefore always permitted.
        // The splash is commented out of the layout, so that click never comes
        // and the effect below falls back to calling play() on mount instead —
        // which a browser is entitled to refuse, since it is not a gesture.
        //
        // `autoPlay` is the permission that does not depend on one. Muted and
        // playsInline together are what every browser asks for in return, and
        // both are already set, so the film starts on load and loop keeps it
        // running.
        autoPlay
        loop
        playsInline
        controls={false}
        disablePictureInPicture
        controlsList="nodownload noplaybackrate noremoteplayback"
        /*
         * Nothing to load until we say so. See the effect that sets `src`.
         */
        preload="none"
        /*
         * A WebP poster at 1280 wide rather than the 1920-wide JPEG.
         *
         * This element is the page's LCP, and with no source attached yet the
         * poster is what satisfies it — so LCP now measures how quickly one
         * preloaded 90KB image arrives, instead of how quickly several
         * megabytes of film do. It was a 189KB JPEG at a resolution no phone
         * can out-resolve.
         */
        poster="/alpoe-london-hero-poster.webp"
        onVolumeChange={keepMuted}
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-45 pointer-events-none"
      >
        {/*
          No <source> children on purpose — the effect above picks the encode
          and attaches it once the page has painted. A <source media="..."> is
          evaluated only at load time and never re-evaluated, so choosing in JS
          is both more predictable and lets us choose *when*.
        */}
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

            {/* Inside the lockup group, which is absolutely positioned between
                the bar and a fixed offset from the bottom. Anything added here
                costs the hero no height at all; it only takes room from the
                mark, which is why the mark came down a few vh.

                The group is pointer-events-none so the film behind it stays
                un-clickable, so these have to opt back in.

                Both go to WhatsApp rather than to a form. Somebody standing in
                front of a hero at eleven at night wants an answer, not a
                thread, and the shop already runs its enquiries there. The two
                messages differ because the two intentions do: one is a
                question, the other is a booking. */}
            <div
              ref={ctaRef}
              className="mt-7 flex flex-wrap items-center justify-center gap-3 pointer-events-auto max-md:mt-5 max-md:gap-2"
            >
              <a
                href={buildGeneralWhatsAppUrl(
                  "Hello, I would like to speak to a client advisor about a piece.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                data-haptic
                className="rounded-full border border-accent/70 px-5 py-2.5 text-[10px] font-semibold tracking-[0.18em] whitespace-nowrap text-accent uppercase transition hover:border-accent hover:bg-accent hover:text-bg max-md:px-4 max-md:py-2 max-md:text-[9px] max-md:tracking-[0.14em]"
              >
                Speak to a Client Advisor
              </a>
              <a
                href={buildGeneralWhatsAppUrl(
                  "Hello, I would like to book an appointment at your Hatton Garden showroom.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                data-haptic
                className="rounded-full bg-accent px-5 py-2.5 text-[10px] font-semibold tracking-[0.18em] whitespace-nowrap text-bg uppercase transition hover:bg-accent-deep max-md:px-4 max-md:py-2 max-md:text-[9px] max-md:tracking-[0.14em]"
              >
                Book Appointment
              </a>
            </div>
          </>
        ) : null}
      </div>

      <div ref={contentRef} className="relative z-4">
        {/*
          "Hatton Garden Jewellers", verbatim, first.
          
          That is not a stylistic choice — it is the one thing every jeweller
          currently ranking for the district does. Queensmith, Regal, MOUZA and
          Rennie & Co all run that exact phrase as their homepage h1, and three
          of the four put the brand name nowhere in it. The businesses that
          lead with their own name instead (Harper Tait among them) rank on
          reviews rather than on the page. The hero itself is the 3D lockup, so
          this is announced rather than drawn; the sentence after it says what
          the house actually makes.
        */}
        <h1 className="sr-only">
          Hatton Garden Jewellers — bespoke engagement rings, diamond
          jewellery and luxury watches, made and sourced in London
        </h1>
      </div>
    </section>
  );
}
