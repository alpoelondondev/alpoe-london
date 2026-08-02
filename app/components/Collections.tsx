"use client";

import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import DragCarousel from "./DragCarousel";

const items: {
  title: string;
  href: string;
  blurb: string;
  /** Background photography. Cards fall back to the flat tint without one. */
  image?: string;
  /** Optional silent loop; `image` is its poster while it buffers. */
  video?: string;
}[] = [
  {
    title: "Luxury Watches",
    href: "/watches",
    blurb: "Rolex, Patek Philippe, AP and more — sourced worldwide.",
    image: "/alpoe-luxury-watches-rolex-dial-hatton-garden.jpg",
    video: "/alpoe-luxury-watches-rolex-dial-hatton-garden.mp4",
  },
  {
    title: "Bespoke Jewellery",
    href: "/jewellery",
    blurb: "One-off pieces designed around you and hand-set in Hatton Garden.",
    image: "/alpoe-bespoke-jewellery-stone-setting-hatton-garden.jpg",
  },
  {
    title: "Chains",
    href: "/jewellery/mens-jewellery",
    blurb: "Solid gold links, hand-finished to any width and length.",
    image: "/alpoe-diamond-link-chains-hatton-garden.jpg",
  },
  {
    title: "Statement Rings",
    href: "/jewellery/rings",
    blurb: "From GIA-certified solitaires to one-off cocktail pieces.",
    image: "/alpoe-statement-rings-diamond-pave-band-hatton-garden.jpg",
  },
];

export default function Collections() {
  return (
    <section
      id="collections"
      className="pt-14 pb-14 max-md:pt-10 max-md:pb-10"
    >
      <DragCarousel
        ariaLabel="Collections"
        className="snap-proximity gap-1.5 px-[52px] max-md:px-6 max-md:gap-2 max-md:snap-mandatory"
      >
        {items.map((item, i) => (
          <ScrollReveal
            key={item.title}
            // Desktop: all four fit the gutter exactly, so there is nothing to
            // scroll. Mobile keeps the swipeable 78vw carousel.
            className="flex-none w-[calc((100vw-122px)/4)] max-md:w-[78vw] snap-center"
            delay={i * 0.1}
          >
            <Link
              href={item.href}
              // Anchors are natively draggable, which would hijack the swipe.
              draggable={false}
              className="group relative block h-[170px] max-md:h-[160px] overflow-hidden border border-black/[0.08] bg-black/[0.03] transition-all duration-300 hover:border-black/[0.20] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(23,18,18,0.10)] active:scale-[0.98] active:duration-100"
              aria-label={`Explore ${item.title}`}
            >
              {item.image ? (
                <>
                  {/* draggable={false}: a native image drag would otherwise
                      swallow the click-and-drag that pans this strip. */}
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    draggable={false}
                    sizes="(max-width: 768px) 78vw, 25vw"
                    className="object-cover pointer-events-none transition-transform duration-500 group-hover:scale-[1.04]"
                  />
                  {item.video ? (
                    /* Silent decorative loop over its own poster; no UA controls. */
                    /* eslint-disable-next-line jsx-a11y/media-has-caption */
                    <video
                      data-decorative
                      autoPlay
                      muted
                      loop
                      playsInline
                      controls={false}
                      disablePictureInPicture
                      controlsList="nodownload noplaybackrate noremoteplayback"
                      preload="metadata"
                      poster={item.image}
                      onVolumeChange={(e) => {
                        const v = e.currentTarget;
                        if (!v.muted) v.muted = true;
                      }}
                      className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-transform duration-500 group-hover:scale-[1.04]"
                    >
                      <source src={item.video} type="video/mp4" />
                    </video>
                  ) : null}
                  {/* Scrim keeps the title readable over whatever the media does */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(6,6,8,0.85)] via-[rgba(6,6,8,0.25)] to-[rgba(6,6,8,0.05)] pointer-events-none" />
                </>
              ) : (
                /* Soft sheen — the flat-tint fallback before photography lands */
                <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_15%_100%,rgba(61,1,0,0.05),transparent_60%)] pointer-events-none" />
              )}
              <span
                aria-hidden="true"
                className={`absolute top-1/2 -translate-y-1/2 right-3.5 text-[20px] leading-none opacity-60 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1 ${
                  item.image ? "text-[#f0ece4]" : "text-accent"
                }`}
              >
                →
              </span>
              <div className="absolute bottom-2.5 left-3.5 right-10">
                <h3
                  className={`font-serif text-[clamp(18px,1.8vw,26px)] tracking-[0.02em] leading-none mb-1 ${
                    item.image ? "text-[#f0ece4]" : ""
                  }`}
                >
                  {item.title}
                </h3>
                {/* Fixed two-line box so every card's title sits on the same row */}
                <p
                  className={`text-[12px] leading-snug max-w-[46ch] h-[2.75em] line-clamp-2 ${
                    item.image ? "text-[rgba(240,236,228,0.75)]" : "text-dim"
                  }`}
                >
                  {item.blurb}
                </p>
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </DragCarousel>
    </section>
  );
}
