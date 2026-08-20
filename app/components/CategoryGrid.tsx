"use client";

import Image from "next/image";
import Link from "next/link";
import { useViewportVideos } from "./useViewportVideos";

const categories: {
  title: string;
  href: string;
  /** Poster: the film's own first frame, so the tile never paints empty. */
  image: string;
  /**
   * What the photograph shows, written out. These five tiles are the biggest
   * pictures on the site and every one of them shipped with `alt=""`, which
   * tells a screen reader to skip it entirely and tells Google Images there is
   * nothing here worth ranking — on a business whose product *is* the
   * photograph. The tile's own heading names the category; the alt describes
   * the piece, so the two are not read out twice.
   */
  alt: string;
  video: string;
  /**
   * Spans the whole grid as a banner instead of taking a square cell. Watches
   * lead the section, so they get the full width rather than a quarter of it.
   */
  wide?: boolean;
}[] = [
  {
    title: "Luxury Watches",
    alt: "Rose gold Rolex dial set with pavé diamonds, photographed at Alpoe London in Hatton Garden",
    href: "/watches",
    image: "/alpoe-luxury-watches-rolex-dial-hatton-garden.jpg",
    video: "/alpoe-luxury-watches-rolex-dial-hatton-garden.mp4",
    wide: true,
  },
  {
    title: "Rings",
    alt: "Hand-set diamond rings in white and rose gold, made at the Alpoe London bench in Hatton Garden",
    href: "/jewellery/rings",
    image: "/alpoe-diamond-rings-hatton-garden.jpg",
    video: "/alpoe-diamond-rings-hatton-garden.mp4",
  },
  {
    title: "Bracelets",
    alt: "Diamond tennis and cluster bracelets in 18ct gold, made to order by Alpoe London, Hatton Garden",
    href: "/jewellery/bracelets",
    image: "/alpoe-diamond-bracelets-hatton-garden.jpg",
    video: "/alpoe-diamond-bracelets-hatton-garden.mp4",
  },
  {
    title: "Earrings",
    alt: "Diamond stud, hoop and drop earrings in 18ct white gold, hand-set by Alpoe London in Hatton Garden",
    href: "/jewellery/earrings",
    image: "/alpoe-diamond-earrings-hatton-garden.jpg",
    video: "/alpoe-diamond-earrings-hatton-garden.mp4",
  },
  {
    title: "Necklaces & Chains",
    alt: "Diamond tennis necklaces and gold link chains, made in London by Alpoe London, Hatton Garden",
    href: "/jewellery/necklaces-pendants",
    image: "/alpoe-diamond-necklaces-chains-hatton-garden.jpg",
    video: "/alpoe-diamond-necklaces-chains-hatton-garden.mp4",
  },
];

export default function CategoryGrid() {
  const { registerVideo } = useViewportVideos();

  return (
    <section
      id="shop-by-category"
      aria-label="Shop by category"
      className="px-[52px] pt-8 pb-8 max-md:px-4 max-md:pt-6 max-md:pb-6"
    >
      {/* Two up on a phone, one row of four once there is width for it. The
          square tiles stay square at every size — the grid gains columns, not
          height — while the wide one spans the row as a banner. */}
      <ul className="grid grid-cols-4 gap-2 max-md:grid-cols-2 max-md:gap-1.5">
        {categories.map((category, i) => (
          <li
            key={category.title}
            className={category.wide ? "col-span-4 max-md:col-span-2" : undefined}
          >
            <Link
              href={category.href}
              aria-label={`Explore ${category.title}`}
              className={`group relative flex items-center justify-center overflow-hidden border border-fg/[0.10] transition-colors duration-300 hover:border-fg/25 ${
                category.wide
                  ? "aspect-[21/8] max-md:aspect-[16/9]"
                  : "aspect-square"
              }`}
            >
              <Image
                src={category.image}
                alt={category.alt}
                fill
                sizes={
                  category.wide
                    ? "100vw"
                    : "(max-width: 768px) 50vw, 25vw"
                }
                className="object-cover pointer-events-none transition-transform duration-500 group-hover:scale-[1.04]"
              />
              {/* Silent decorative loop over its own poster; no UA controls. */}
              {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
              <video
                ref={registerVideo(i)}
                data-decorative
                muted
                loop
                playsInline
                controls={false}
                disablePictureInPicture
                controlsList="nodownload noplaybackrate noremoteplayback"
                // Raised to "auto" by useViewportVideos; starting at "none"
                // keeps four clips off the critical path on first paint.
                preload="none"
                poster={category.image}
                onVolumeChange={(e) => {
                  const video = e.currentTarget;
                  if (!video.muted) video.muted = true;
                }}
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover pointer-events-none transition-transform duration-500 group-hover:scale-[1.04]"
              >
                <source src={category.video} type="video/mp4" />
              </video>
              {/* Flat scrim rather than a gradient — the title sits dead centre,
                  and diamond footage throws highlights everywhere, not just top. */}
              <div className="absolute inset-0 bg-[rgba(19,16,16,0.42)] pointer-events-none transition-colors duration-300 group-hover:bg-[rgba(19,16,16,0.28)]" />
              <h3
                className={`relative z-1 px-3 text-center font-serif leading-tight tracking-[0.02em] text-white ${
                  category.wide
                    ? "text-[clamp(24px,3vw,44px)]"
                    : "text-[clamp(17px,1.7vw,28px)]"
                }`}
              >
                {category.title}
              </h3>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
