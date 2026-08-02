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
    <div className="relative overflow-hidden border-y border-black/[0.08] py-10">
      <LogoLoop
        logos={brandLogos}
        speed={60}
        direction="left"
        logoHeight={32}
        gap={80}
        scaleOnHover
        fadeOut
        fadeOutColor="#f4f2ee"
        ariaLabel="Watch brands sourced by Alpoe London"
      />
    </div>
  );
}
