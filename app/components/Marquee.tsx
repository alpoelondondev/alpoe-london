"use client";

import LogoLoop, { LogoItem } from "./LogoLoop";

const brandLogos: LogoItem[] = [
  { src: "/logos/rolex-watches-logo.png", alt: "Rolex" },
  { src: "/logos/patek-philippe-watches-logo.png", alt: "Patek Philippe" },
  { src: "/logos/audemars-piguet-watches-logo.png", alt: "Audemars Piguet" },
  { src: "/logos/cartier-watches-logo.png", alt: "Cartier" },
  { src: "/logos/hublot-watches-logo.png", alt: "Hublot" },
  { src: "/logos/omega-watches-logo.png", alt: "Omega" },
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
        fadeOut
        fadeOutColor="#131010"
        ariaLabel="Watch brands sourced by Alpoe London"
      />
    </div>
  );
}
