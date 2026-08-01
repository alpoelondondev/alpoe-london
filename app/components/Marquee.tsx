"use client";

import LogoLoop, { LogoItem } from "./LogoLoop";

const brandLogos: LogoItem[] = [
  { src: "/alpoe-london-logo-transparent.svg", alt: "Alpoe London" },
  { src: "/logos/rolex.png", alt: "Rolex" },
  { src: "/logos/patek-philippe.png", alt: "Patek Philippe" },
  { src: "/logos/audemars-piguet.png", alt: "Audemars Piguet" },
  { src: "/logos/cartier.png", alt: "Cartier" },
  { src: "/logos/hublot.png", alt: "Hublot" },
];

export default function Marquee() {
  return (
    <div className="relative overflow-hidden border-y border-white/[0.06] py-10">
      <LogoLoop
        logos={brandLogos}
        speed={60}
        direction="left"
        logoHeight={48}
        gap={80}
        scaleOnHover
        fadeOut
        fadeOutColor="#0a0a0a"
        ariaLabel="Brand partners"
      />
    </div>
  );
}
