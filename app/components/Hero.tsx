"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ShuffleText } from "./Loader";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reveal = () => {
      if (eyebrowRef.current) {
        gsap.to(eyebrowRef.current, { opacity: 1, duration: 0.8 });
      }
      if (bottomRef.current) {
        gsap.to(bottomRef.current, { opacity: 1, duration: 0.8, delay: 0.5 });
      }
    };

    // The Loader's click handler now starts the hero video synchronously
    // inside the user gesture, so iOS accepts it. We just reveal text on cue.
    const onLoaded = () => {
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
        poster="/poster-hero.jpg"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/alpoe-hero.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/40" />
      <p
        ref={eyebrowRef}
        className="absolute inset-0 z-4 flex items-center justify-center text-[16px] tracking-[0.2em] uppercase text-accent opacity-0 pointer-events-none"
      >
        <ShuffleText />
      </p>
      <div ref={contentRef} className="relative z-4">
        <h1 className="text-[16px] tracking-[0.2em] uppercase text-accent text-center mb-12">
          Alpoe London <span aria-hidden="true">·</span> Alpoe Luxe
        </h1>
        <div
          ref={bottomRef}
          className="flex justify-between items-end opacity-0 max-md:flex-col max-md:items-start max-md:gap-6"
        >
          <a
            className="text-[11px] tracking-[0.14em] uppercase text-dim no-underline border-b border-dim pb-[3px]"
            href="#collections"
          >
            View Collection
          </a>
        </div>
      </div>
    </section>
  );
}
