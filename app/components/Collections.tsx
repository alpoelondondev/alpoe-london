"use client";

import Link from "next/link";
import ScrollReveal from "./ScrollReveal";

const items: {
  title: string;
  href: string;
  blurb: string;
}[] = [
  {
    title: "Bespoke Jewellery",
    href: "/jewellery",
    blurb: "One-off pieces designed around you and hand-set in Hatton Garden.",
  },
  {
    title: "Cuban Chains",
    href: "/jewellery/mens-jewellery",
    blurb: "Solid gold links, hand-finished to any width and length.",
  },
  {
    title: "Statement Rings",
    href: "/jewellery/rings",
    blurb: "From GIA-certified solitaires to one-off cocktail pieces.",
  },
  {
    title: "Luxury Watches",
    href: "/watches",
    blurb: "Rolex, Patek Philippe, AP and more — sourced worldwide.",
  },
];

export default function Collections() {
  return (
    <section
      id="collections"
      className="pt-14 pb-14 max-md:pt-10 max-md:pb-10"
    >
      <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 px-[52px] scrollbar-none max-md:px-6">
        {items.map((item, i) => (
          <ScrollReveal
            key={item.title}
            className="flex-none w-[26vw] max-md:w-[78vw] snap-center"
            delay={i * 0.1}
          >
            <Link
              href={item.href}
              onPointerDown={() => {
                // Tap haptic on supporting devices; never blocks navigation.
                if (typeof navigator !== "undefined" && "vibrate" in navigator) {
                  navigator.vibrate(8);
                }
              }}
              className="group relative block h-[170px] max-md:h-[160px] overflow-hidden border border-black/[0.08] bg-black/[0.03] transition-all duration-300 hover:border-black/[0.20] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(23,18,18,0.10)] active:scale-[0.98] active:duration-100"
              aria-label={`Explore ${item.title}`}
            >
              {/* Soft sheen */}
              <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_15%_100%,rgba(61,1,0,0.05),transparent_60%)] pointer-events-none" />
              <span
                aria-hidden="true"
                className="absolute top-1/2 -translate-y-1/2 right-5 text-[20px] leading-none text-accent opacity-50 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1"
              >
                →
              </span>
              <div className="absolute bottom-3.5 left-5 right-12">
                <h3 className="font-serif text-[clamp(18px,1.8vw,26px)] tracking-[0.02em] leading-none mb-1">
                  {item.title}
                </h3>
                <p className="text-[12px] leading-snug text-dim max-w-[46ch]">
                  {item.blurb}
                </p>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
