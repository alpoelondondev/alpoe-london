"use client";

import { useEffect, useRef, useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { SITE } from "@/lib/site";

// Hatton Garden, London — the jewellery quarter our showroom sits in.
const CENTRE: [number, number] = [-0.10855, 51.52045];

// MapLibre on OpenFreeMap tiles: fully dynamic, no account and no API key.
// Positron is the pale, low-chrome style that suits the page cream.
const STYLE = "https://tiles.openfreemap.org/styles/positron";

const DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${SITE.name}, ${SITE.address.streetAddress}, ${SITE.address.addressLocality} ${SITE.address.postalCode}`,
)}`;

export default function FindUs() {
  const holder = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!holder.current) return;
    let map: { remove: () => void } | null = null;
    let cancelled = false;

    // Loaded on demand — maplibre-gl is ~800kB and only this strip needs it.
    (async () => {
      try {
        // v6 ships named exports only; MapLibreMap is its alias for Map.
        const { MapLibreMap, Marker, NavigationControl } = await import("maplibre-gl");
        await import("maplibre-gl/dist/maplibre-gl.css");
        if (cancelled || !holder.current) return;

        const m = new MapLibreMap({
          container: holder.current,
          style: STYLE,
          center: CENTRE,
          zoom: 15.4,
          cooperativeGestures: true, // page scroll wins until the map is clicked
        });
        m.addControl(new NavigationControl({ showCompass: false }), "top-right");
        new Marker({ color: "#3d0100" }).setLngLat(CENTRE).addTo(m);
        m.on("error", () => setFailed(true));
        map = m;
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, []);

  return (
    <section id="find-us" className="pb-20 max-md:pb-14" aria-label="Find us">
      <ScrollReveal>
        {/* Full-bleed: the map runs edge to edge, no gutter and no border. */}
        <div className="overflow-hidden">
          {failed ? (
            // Tiles unreachable — never leave a dead grey box.
            <a
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-[380px] w-full items-center justify-center bg-black/[0.03] max-md:h-[280px]"
            >
              <span className="text-[11px] tracking-[0.18em] uppercase text-accent">
                View on map →
              </span>
            </a>
          ) : (
            <div ref={holder} className="h-[380px] w-full max-md:h-[280px]" />
          )}
        </div>

        <div className="mt-6 px-[52px] text-center max-md:px-6">
          <p className="font-serif text-[clamp(20px,2.2vw,28px)] tracking-[0.02em] leading-none">
            {SITE.name}
          </p>
          <p className="mt-2 text-[13px] tracking-[0.14em] uppercase text-dim">
            The Garden, {SITE.address.streetAddress}
          </p>
          <p className="mt-1 text-[13px] tracking-[0.14em] uppercase text-dim">
            {SITE.address.postalCode}
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
