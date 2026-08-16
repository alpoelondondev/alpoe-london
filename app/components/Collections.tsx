"use client";

import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import DragCarousel from "./DragCarousel";

const items: {
  title: string;
  /** Omitted while a card is a teaser — it then renders inert, with no arrow. */
  href?: string;
  blurb: string;
  /** Background photography. Cards fall back to the flat tint without one. */
  image?: string;
  /** Optional silent loop; `image` is its poster while it buffers. */
  video?: string;
  /**
   * Overrides the default framing when object-cover alone leaves the subject
   * too small in the card. Carries its own hover step, since it replaces the
   * shared one rather than stacking with it.
   */
  imageScale?: string;
}[] = [
  // Luxury Watches leads the category grid below as its full-width banner, and
  // Chains and Statement Rings are reachable from that grid too — see
  // CategoryGrid. This strip is the editorial run: guide, workshop, teaser.
  {
    title: "Diamonds",
    href: "/guides/natural-vs-lab-grown-diamonds",
    blurb: "Natural vs lab diamonds — what's the difference, and what works for you?",
    image: "/alpoe-natural-vs-lab-grown-diamonds-hatton-garden.jpg",
  },
  {
    title: "Bespoke Jewellery",
    href: "/jewellery",
    blurb: "One-off pieces designed around you and hand-set in Hatton Garden.",
    image: "/alpoe-bespoke-jewellery-stone-setting-hatton-garden.jpg",
  },
  {
    title: "Merchandise",
    blurb: "Alpoe London custom merch coming soon.",
    image: "/alpoe-london-merchandise-cap-gift-bag-hatton-garden.jpg",
    // The cap and bag sit small in a wide shot with dark air above and below —
    // pushed in so the embroidery and foil read at card size.
    imageScale: "scale-[1.35] group-hover:scale-[1.4]",
  },
];

export default function Collections() {
  return (
    <section
      id="collections"
      className="pt-8 pb-8 max-md:pt-6 max-md:pb-6"
    >
      <DragCarousel
        ariaLabel="Collections"
        className="snap-proximity gap-1.5 px-6 max-md:px-4 max-md:gap-2 max-md:snap-mandatory"
      >
        {items.map((item, i) => {
          // Taller than the old four-up strip: at a third of the viewport each,
          // 170px left these cards a ~4:1 sliver that cropped the art to a
          // band. Retune alongside the width calc below.
          const cardClass = `group relative block h-[240px] max-md:h-[160px] overflow-hidden border border-fg/[0.10] bg-fg/[0.04] transition-all duration-300 ${
            item.href
              ? "hover:border-fg/25 hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)] active:scale-[0.98] active:duration-100"
              : ""
          }`;

          const card = (
            <>
              {item.image ? (
                <>
                  {/* draggable={false}: a native image drag would otherwise
                      swallow the click-and-drag that pans this strip. */}
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    draggable={false}
                    sizes="(max-width: 768px) 82vw, 50vw"
                    className={`object-cover pointer-events-none transition-transform duration-500 ${
                      item.imageScale ?? "group-hover:scale-[1.04]"
                    }`}
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(19,16,16,0.85)] via-[rgba(19,16,16,0.25)] to-[rgba(19,16,16,0.05)] pointer-events-none" />
                </>
              ) : (
                /* Soft sheen — the flat-tint fallback before photography lands */
                <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_15%_100%,color-mix(in_srgb,var(--color-accent)_5%,transparent),transparent_60%)] pointer-events-none" />
              )}
              {/* No arrow on a teaser — it promises a destination there isn't one of. */}
              {item.href ? (
                <span
                  aria-hidden="true"
                  className={`absolute top-1/2 -translate-y-1/2 right-3.5 text-[20px] leading-none opacity-60 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1 ${
                    item.image ? "text-fg" : "text-accent"
                  }`}
                >
                  →
                </span>
              ) : null}
              <div className="absolute bottom-2.5 left-3.5 right-10">
                <h3
                  className={`font-serif text-[clamp(18px,1.8vw,26px)] tracking-[0.02em] leading-none mb-1 ${
                    item.image ? "text-fg" : ""
                  }`}
                >
                  {item.title}
                </h3>
                {/* Fixed two-line box so every card's title sits on the same row */}
                <p
                  className={`text-[12px] leading-snug max-w-[46ch] h-[2.75em] line-clamp-2 ${
                    item.image ? "text-fg/75" : "text-dim"
                  }`}
                >
                  {item.blurb}
                </p>
              </div>
            </>
          );

          return (
            <ScrollReveal
              key={item.title}
              // Desktop: all three fit the gutter exactly, so there is nothing
              // to scroll. Mobile keeps the swipeable carousel. The subtrahend
              // is the px-6 gutter plus the gaps between cards — retune both it
              // and the divisor if the number of cards changes again.
              className="flex-none w-[calc((100vw-60px)/3)] max-md:w-[82vw] snap-center"
              delay={i * 0.1}
            >
              {item.href ? (
                <Link
                  href={item.href}
                  // Anchors are natively draggable, which would hijack the swipe.
                  draggable={false}
                  className={cardClass}
                  aria-label={`Explore ${item.title}`}
                >
                  {card}
                </Link>
              ) : (
                // A teaser with nowhere to go yet, so it is not a link at all —
                // no focus stop, no pointer, no click that goes nowhere.
                <div className={cardClass}>{card}</div>
              )}
            </ScrollReveal>
          );
        })}
      </DragCarousel>
    </section>
  );
}
