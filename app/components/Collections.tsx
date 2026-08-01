"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

const items: {
  title: string;
  tag: string;
  href: string;
  blurb: string;
  num: string;
  image?: string;
  video?: string;
}[] = [
  {
    title: "Bespoke Jewellery Service",
    tag: "Bespoke",
    href: "/jewellery",
    blurb: "One-off pieces designed around you and hand-set in Hatton Garden.",
    num: "01",
    image: "/alpoe-bespoke-jewellery-service-hatton-garden.jpg",
    video: "/alpoe-bespoke-jewellery-service-hatton-garden.mp4",
  },
  {
    title: "Cuban Chains",
    tag: "Chains",
    href: "/jewellery/mens-jewellery",
    blurb: "Solid gold links, hand-finished to any width and length.",
    num: "02",
    image: "/alpoe-cuban-chains-hatton-garden.jpg",
    video: "/alpoe-cuban-chains-hatton-garden.mp4",
  },
  {
    title: "Statement Rings",
    tag: "Rings",
    href: "/jewellery/rings",
    blurb: "From GIA-certified solitaires to one-off cocktail pieces.",
    num: "03",
  },
  {
    title: "Luxury Watches",
    tag: "Watches",
    href: "/watches",
    blurb: "Rolex, Patek Philippe, AP and more — sourced worldwide.",
    num: "04",
  },
];

export default function Collections() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState<Record<number, boolean>>({});

  const handleScroll = useCallback(() => {
    const el = carouselRef.current;
    if (!el) return;
    const scrollLeft = el.scrollLeft;
    const cardWidth = el.scrollWidth / items.length;
    const index = Math.round(scrollLeft / cardWidth);
    setActiveIndex(Math.min(index, items.length - 1));
  }, []);

  const scrollByCard = (dir: 1 | -1) => {
    const el = carouselRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / items.length;
    el.scrollBy({ left: cardWidth * dir, behavior: "smooth" });
  };

  // Prerender/lazyload: buffer the tile videos in the background once the
  // splash has dismissed, so tapping a thumbnail plays instantly.
  useEffect(() => {
    const preload = () => {
      videoRefs.current.forEach((video, i) => {
        if (!video || video.readyState >= 2) return;
        setTimeout(() => {
          if (video.preload === "none") {
            video.preload = "auto";
            video.load();
          }
        }, i * 800);
      });
    };
    window.addEventListener("page-loaded", preload, { once: true });
    const fallback = setTimeout(preload, 3000);
    return () => {
      window.removeEventListener("page-loaded", preload);
      clearTimeout(fallback);
    };
  }, []);

  const togglePlay = (i: number) => {
    const video = videoRefs.current[i];
    if (!video) return;
    if (video.paused) {
      video.muted = true;
      if (video.preload === "none") {
        video.preload = "auto";
        video.load();
      }
      video.play().catch(() => {});
      setPlaying((p) => ({ ...p, [i]: true }));
    } else {
      video.pause();
      setPlaying((p) => ({ ...p, [i]: false }));
    }
  };

  return (
    <section
      id="collections"
      className="px-[52px] pt-14 pb-14 max-md:px-6 max-md:pt-10 max-md:pb-10"
    >
      <div
        ref={carouselRef}
        onScroll={handleScroll}
        className="grid grid-cols-4 gap-4 max-md:flex max-md:overflow-x-auto max-md:snap-x max-md:snap-mandatory max-md:gap-4 max-md:-mx-6 max-md:px-6 max-md:scrollbar-none"
      >
        {items.map((item, i) => (
          <ScrollReveal
            key={item.num}
            className="max-md:flex-none max-md:w-[85vw] max-md:snap-center"
            delay={i * 0.1}
          >
            {item.video && item.image ? (
              <div
                role="button"
                tabIndex={0}
                onClick={() => togglePlay(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") togglePlay(i);
                }}
                aria-label={`${playing[i] ? "Pause" : "Play"} ${item.title} film`}
                className="group relative block aspect-[3/4] overflow-hidden border border-black/[0.08] cursor-pointer"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 85vw, 25vw"
                  className="object-cover"
                />
                <video
                  ref={(el) => {
                    videoRefs.current[i] = el;
                  }}
                  muted
                  loop
                  playsInline
                  preload="none"
                  poster={item.image}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                    playing[i] ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                >
                  <source src={item.video} type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(6,6,8,0.85)] via-[rgba(6,6,8,0.15)] to-transparent pointer-events-none" />
                <span className="absolute top-[18px] left-5 text-[11px] tracking-[0.12em] uppercase text-[rgba(240,236,228,0.75)]">
                  {item.tag}
                </span>
                <span className="absolute top-[16px] right-5 text-[10px] tracking-[0.16em] uppercase text-[#f0ece4] border border-white/40 rounded-full px-3 py-1.5 backdrop-blur-sm bg-black/10">
                  {playing[i] ? "Pause" : "▶ Play"}
                </span>
                <div className="absolute bottom-5 left-5 right-5">
                  <h3 className="font-serif text-[clamp(22px,2.2vw,32px)] tracking-[0.02em] leading-none mb-2 text-[#f0ece4]">
                    {item.title}
                  </h3>
                  <p className="text-[12px] leading-relaxed text-[rgba(240,236,228,0.65)] mb-3">
                    {item.blurb}
                  </p>
                  <Link
                    href={item.href}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.16em] uppercase text-[#cbb98f] opacity-90 hover:opacity-100"
                  >
                    Explore →
                  </Link>
                </div>
              </div>
            ) : (
              <Link
                href={item.href}
                className="group relative block aspect-[3/4] overflow-hidden border border-black/[0.08] bg-black/[0.03] transition-colors duration-500 hover:border-black/[0.20]"
                aria-label={`Explore ${item.title}`}
              >
                {/* Oversized ghost numeral */}
                <span
                  aria-hidden="true"
                  className="absolute -top-4 right-2 font-serif text-[clamp(120px,12vw,190px)] leading-none text-black/[0.05] transition-colors duration-500 group-hover:text-black/[0.08] select-none"
                >
                  {item.num}
                </span>
                {/* Soft sheen */}
                <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_15%_100%,rgba(61,1,0,0.05),transparent_60%)] pointer-events-none" />
                <span className="absolute top-[18px] left-5 text-[11px] tracking-[0.12em] uppercase text-dim">
                  {item.tag}
                </span>
                <div className="absolute bottom-5 left-5 right-5">
                  <h3 className="font-serif text-[clamp(22px,2.2vw,32px)] tracking-[0.02em] leading-none mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[12px] leading-relaxed text-dim mb-3">
                    {item.blurb}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.16em] uppercase text-accent opacity-80 transition-opacity duration-300 group-hover:opacity-100">
                    Explore →
                  </span>
                </div>
              </Link>
            )}
          </ScrollReveal>
        ))}
      </div>

      {/* Mobile scroll arrows + indicator */}
      <div className="hidden max-md:flex justify-center items-center gap-6 mt-6">
        <button
          type="button"
          aria-label="Previous"
          onClick={() => scrollByCard(-1)}
          disabled={activeIndex === 0}
          className="text-[20px] text-dim disabled:opacity-30 px-2 cursor-pointer"
        >
          ←
        </button>
        <div className="flex items-center gap-2">
          {items.map((item, i) => (
            <span
              key={item.num}
              className={`block h-[2px] rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-6 bg-accent" : "w-2 bg-black/20"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label="Next"
          onClick={() => scrollByCard(1)}
          disabled={activeIndex === items.length - 1}
          className="text-[20px] text-dim disabled:opacity-30 px-2 cursor-pointer"
        >
          →
        </button>
      </div>
    </section>
  );
}
