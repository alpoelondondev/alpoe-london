"use client";

import LogoLoop, { LogoItem } from "./LogoLoop";

// Each mark links through to that brand's own selection on the site. Slugs
// match lib/taxonomy.ts, which is what /watches/[brand] resolves against.
const brandLogos: LogoItem[] = [
  { src: "/logos/rolex-watches-logo.png", alt: "Rolex", href: "/watches/rolex" },
  {
    src: "/logos/patek-philippe-watches-logo.png",
    alt: "Patek Philippe",
    href: "/watches/patek-philippe",
  },
  {
    src: "/logos/audemars-piguet-watches-logo.png",
    alt: "Audemars Piguet",
    href: "/watches/audemars-piguet",
  },
  {
    src: "/logos/cartier-watches-logo.png",
    alt: "Cartier",
    href: "/watches/cartier",
  },
  {
    src: "/logos/hublot-watches-logo.png",
    alt: "Hublot",
    href: "/watches/hublot",
  },
  { src: "/logos/omega-watches-logo.png", alt: "Omega", href: "/watches/omega" },
];

export default function Marquee() {
  return (
    <div className="relative overflow-hidden border-y border-fg/[0.10] py-10">
      <LogoLoop
        logos={brandLogos}
        speed={60}
        direction="left"
        logoHeight={44}
        gap={80}
        scaleOnHover
        draggable
        fadeOut
        fadeOutColor="#131010"
        ariaLabel="Watch brands sourced by Alpoe London"
      />
    </div>
  );
}
