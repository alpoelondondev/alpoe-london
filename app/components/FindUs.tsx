"use client";

import { useEffect, useRef, useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { SITE } from "@/lib/site";

// Hatton Garden, London — the jewellery quarter our showroom sits in.
const LAT = 51.52045;
const LON = -0.10855;

// Leaflet on CARTO's Positron raster tiles: dynamic, no account and no API key.
// Raster means no Web Worker and no WebGL, which is why this survives the
// Turbopack bundle where a vector engine silently never spawns its worker.
const TILES = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

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

    // Loaded on demand — only this strip needs Leaflet.
    (async () => {
      try {
        const L = await import("leaflet");
        await import("leaflet/dist/leaflet.css");
        if (cancelled || !holder.current) return;

        const m = L.map(holder.current, {
          center: [LAT, LON],
          zoom: 16,
          scrollWheelZoom: false, // page scroll wins; pinch and buttons still zoom
          attributionControl: true,
        });
        L.tileLayer(TILES, { attribution: ATTRIBUTION, maxZoom: 20 }).addTo(m);

        // divIcon avoids Leaflet's bundled marker-image path problem entirely.
        L.marker([LAT, LON], {
          icon: L.divIcon({
            className: "",
            html: '<span class="map-pin"><span class="map-pin__ring"></span><span class="map-pin__dot"></span></span>',
            iconSize: [16, 16],
            iconAnchor: [8, 8],
          }),
          keyboard: false,
        })
          .addTo(m)
          .bindPopup(`${SITE.name}<br/>The Garden, ${SITE.address.streetAddress}`);

        map = m;
      } catch (e) {
        console.error("[FindUs] map init failed", e);
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
