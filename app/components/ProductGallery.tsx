"use client";

import Image from "next/image";
import { useState } from "react";

export default function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [idx, setIdx] = useState(0);
  const hero = images[idx];

  if (!images.length) {
    return (
      <div className="aspect-[4/5] w-full bg-fg/[0.04] border border-fg/[0.10] flex items-center justify-center text-dim text-[11px] tracking-[0.18em] uppercase">
        High-resolution photography on request
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/5] w-full bg-fg/[0.04]">
        <Image
          src={hero}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 640px"
          className="object-cover"
          priority
        />
      </div>
      {images.length > 1 ? (
        <div className="grid grid-cols-5 gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIdx(i)}
              aria-label={`View image ${i + 1}`}
              className={`relative aspect-square bg-fg/[0.04] overflow-hidden transition ${
                i === idx ? "ring-1 ring-accent" : "ring-1 ring-transparent hover:ring-fg/30"
              }`}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
