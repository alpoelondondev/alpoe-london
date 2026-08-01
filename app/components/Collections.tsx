"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

const items: {
  title: string;
  tag: string;
  href: string;
  blurb: string;
  num: string;
  colSpan: string;
}[] = [
  {
    title: "Bespoke Jewellery Service",
    tag: "Bespoke",
    href: "/jewellery",
    blurb: "One-off pieces designed around you and hand-set in Hatton Garden.",
    num: "01",
    colSpan: "col-span-7 max-md:col-span-12",
  },
  {
    title: "Cuban Chains",
    tag: "Chains",
    href: "/jewellery/mens-jewellery",
    blurb: "Solid gold links, hand-finished to any width and length.",
    num: "02",
    colSpan: "col-span-5 max-md:col-span-12",
  },
  {
    title: "Statement Rings",
    tag: "Rings",
    href: "/jewellery/rings",
    blurb: "From GIA-certified solitaires to one-off cocktail pieces.",
    num: "03",
    colSpan: "col-span-5 max-md:col-span-12",
  },
  {
    title: "Luxury Watches",
    tag: "Watches",
    href: "/watches",
    blurb: "Rolex, Patek Philippe, AP and more — sourced worldwide.",
    num: "04",
    colSpan: "col-span-7 max-md:col-span-12",
  },
];

export default function Collections() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

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

  return (
    <section
      id="collections"
      className="px-[52px] pt-14 pb-14 max-md:px-6 max-md:pt-10 max-md:pb-10"
    >
      <ScrollReveal>
        <p className="section-label text-[11px] tracking-[0.2em] uppercase text-accent mb-[72px] flex items-center gap-[18px]">
          Collections
        </p>
      </ScrollReveal>
      <div
        ref={carouselRef}
        onScroll={handleScroll}
        className="grid grid-cols-12 gap-5 max-md:flex max-md:overflow-x-auto max-md:snap-x max-md:snap-mandatory max-md:gap-4 max-md:-mx-6 max-md:px-6 max-md:scrollbar-none"
      >
        {items.map((item, i) => (
          <ScrollReveal
            key={item.num}
            className={`${item.colSpan} max-md:!col-auto max-md:flex-none max-md:w-[85vw] max-md:snap-center`}
            delay={i * 0.1}
          >
            <Link
              href={item.href}
              className="group relative block aspect-[4/3] overflow-hidden border border-white/[0.06] bg-white/[0.02] transition-colors duration-500 hover:border-white/[0.14]"
              aria-label={`Explore ${item.title}`}
            >
              {/* Oversized ghost numeral */}
              <span
                aria-hidden="true"
                className="absolute -top-6 right-2 font-serif text-[clamp(140px,18vw,260px)] leading-none text-white/[0.04] transition-colors duration-500 group-hover:text-white/[0.07] select-none"
              >
                {item.num}
              </span>
              {/* Soft sheen */}
              <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_15%_100%,rgba(184,160,112,0.08),transparent_60%)] pointer-events-none" />
              <span className="absolute top-[18px] left-6 text-[11px] tracking-[0.12em] uppercase text-dim">
                {item.tag}
              </span>
              <div className="absolute bottom-[22px] left-6 right-6">
                <h3 className="font-serif text-[clamp(24px,3vw,42px)] tracking-[0.02em] leading-none mb-2.5">
                  {item.title}
                </h3>
                <p className="text-[12px] leading-relaxed text-dim max-w-[36ch] mb-3">
                  {item.blurb}
                </p>
                <span className="inline-flex items-center gap-1.5 text-[10px] tracking-[0.16em] uppercase text-accent opacity-80 transition-opacity duration-300 group-hover:opacity-100">
                  Explore →
                </span>
              </div>
            </Link>
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
                i === activeIndex ? "w-6 bg-accent" : "w-2 bg-white/20"
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
