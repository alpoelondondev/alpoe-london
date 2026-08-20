"use client";

import LogoLoop, { LogoItem } from "./LogoLoop";

/*
 * Each mark links through to that brand's own selection on the site. Slugs
 * match lib/taxonomy.ts, which is what /watches/[brand] resolves against.
 *
 * The width and height are the files' real pixel dimensions, and they are here
 * rather than left to the browser because without them nothing reserves space
 * for a mark until its file arrives — the strip collapses and then snaps open,
 * a layout shift on the first thing under the hero. The rendered size still
 * comes from `logoHeight`; these only set the ratio.
 *
 * WebP at 120px tall, not the 500px-tall PNGs these replaced. The strip draws
 * them at 30px, so nine tenths of every one of those files was being
 * downloaded and thrown away — 412KB across six marks, on the homepage, above
 * the fold. They are also run through `filter: brightness(0) invert(1)` (see
 * LogoLoop.css), which discards the colour data entirely and keeps only the
 * alpha, so there was never any colour fidelity to lose. 412KB to 56KB.
 */
const brandLogos: LogoItem[] = [
  {
    src: "/logos/rolex-watches-logo.webp",
    width: 209,
    height: 120,
    alt: "Rolex",
    href: "/watches/rolex",
  },
  {
    src: "/logos/patek-philippe-watches-logo.webp",
    width: 246,
    height: 120,
    alt: "Patek Philippe",
    href: "/watches/patek-philippe",
  },
  {
    src: "/logos/audemars-piguet-watches-logo.webp",
    width: 281,
    height: 120,
    alt: "Audemars Piguet",
    href: "/watches/audemars-piguet",
  },
  {
    src: "/logos/cartier-watches-logo.webp",
    width: 352,
    height: 120,
    alt: "Cartier",
    href: "/watches/cartier",
  },
  {
    src: "/logos/hublot-watches-logo.webp",
    width: 216,
    height: 120,
    alt: "Hublot",
    href: "/watches/hublot",
  },
  {
    src: "/logos/omega-watches-logo.webp",
    width: 234,
    height: 120,
    alt: "Omega",
    href: "/watches/omega",
  },
];

export default function Marquee() {
  return (
    <div className="relative overflow-hidden border-y border-fg/[0.10] py-4">
      <LogoLoop
        logos={brandLogos}
        speed={60}
        direction="left"
        logoHeight={30}
        gap={64}
        scaleOnHover
        draggable
        fadeOut
        fadeOutColor="#131010"
        ariaLabel="Watch brands sourced by Alpoe London"
      />
    </div>
  );
}
