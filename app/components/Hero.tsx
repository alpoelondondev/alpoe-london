"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShuffleText } from "./Loader";
import { LOGO_PATHS } from "./logoPaths";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const reveal = () => {
      if (eyebrowRef.current) {
        gsap.to(eyebrowRef.current, { opacity: 1, duration: 0.8 });
      }
    };

    // The Loader also kicks the video off inside the click gesture for iOS;
    // this is the belt-and-braces attempt once the splash clears.
    const onLoaded = () => {
      const video = videoRef.current;
      if (video) {
        video.muted = true;
        video.play().catch(() => {});
      }
      reveal();
    };

    window.addEventListener("page-loaded", onLoaded);

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
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="h-screen relative overflow-hidden flex flex-col justify-end px-[52px] pb-[60px] max-md:px-3 max-md:pb-12"
    >
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        ref={videoRef}
        data-hero
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/alpoe-luxury-watches-hero-hatton-garden.jpg"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="/alpoe-luxury-watches-hero-hatton-garden.mp4"
          type="video/mp4"
        />
      </video>
      {/* Warm scrim keeps the oxblood wordmark legible over the footage */}
      <div className="absolute inset-0 bg-bg/70 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_50%,transparent_25%,rgba(244,242,238,0.55)_100%)] pointer-events-none" />
      <div
        ref={eyebrowRef}
        className="absolute inset-0 z-4 flex flex-col items-center justify-center gap-8 opacity-0 pointer-events-none"
      >
        <svg
          viewBox="12 42 201 126"
          className="w-[min(72vw,560px)] max-md:w-[82vw]"
          xmlns="http://www.w3.org/2000/svg"
          role="img"
          aria-label="Alpoe London"
        >
          {LOGO_PATHS.map((d, i) => (
            <path key={i} d={d} fill="#3d0100" />
          ))}
        </svg>
        <p className="text-[16px] tracking-[0.2em] uppercase text-accent">
          <ShuffleText />
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
