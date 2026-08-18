"use client";

import { useEffect, useRef, useState } from "react";
// Statically, not inside the effect. `await import()` of a stylesheet returns
// a module the bundler is free to treat as a side-effect-free no-op, and
// without Leaflet's own CSS the map panes lose their absolute positioning:
// the tiles never paint, the marker lands in the corner instead of the middle
// and the strip reads as an empty black box.
import "leaflet/dist/leaflet.css";
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

/**
 * The top and bottom fade. Written as a long ramp with intermediate stops
 * rather than transparent → opaque: a straight two-stop gradient concentrates
 * the whole transition into a short run and the eye reads that as a band. The
 * middle stops ease it, so the map simply stops being there.
 */
const MAP_FADE =
  "linear-gradient(to bottom, " +
  "rgba(0,0,0,0) 0%, rgba(0,0,0,0.15) 6%, rgba(0,0,0,0.5) 13%, " +
  "rgba(0,0,0,0.85) 21%, #000 30%, #000 70%, rgba(0,0,0,0.85) 79%, " +
  "rgba(0,0,0,0.5) 87%, rgba(0,0,0,0.15) 94%, rgba(0,0,0,0) 100%)";

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
          .bindPopup(
            `${SITE.name}<br/>The Garden, ${SITE.address.streetAddress}`,
          );

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
        {/* Full-bleed: the map runs edge to edge, no gutter and no border.
            Relative, because the address plate is laid over it. */}
        <div className="relative">
          {/* Masked top and bottom so the map dissolves into the page instead
            of butting against it on two hard horizontals. A mask rather than
            gradient overlays: overlays would have to match whatever colour is
            behind the strip, and this simply lets the page through. */}
          <div
            className="overflow-hidden"
            style={{
              maskImage: MAP_FADE,
              WebkitMaskImage: MAP_FADE,
            }}
          >
            {failed ? (
              // Tiles unreachable — never leave a dead grey box.
              <a
                href={DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-[380px] w-full items-center justify-center bg-fg/[0.04] max-md:h-[280px]"
              >
                <span className="t-eyebrow !text-accent">View on map →</span>
              </a>
            ) : (
              // No scrim: the tiles run at their own brightness and the edge
              // fade above is what settles them into the page.
              <div ref={holder} className="h-[380px] w-full max-md:h-[280px]" />
            )}
          </div>

          {/* Laid over the map rather than above it. The plate is what makes it
            legible over light tiles, and the overlay takes no pointer events
            so the map underneath still pans and zooms — only the directions
            link inside it accepts a click. */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center px-6">
            <div className="pointer-events-auto bg-bg/80 px-10 py-7 text-center backdrop-blur-sm max-md:px-7 max-md:py-6">
              <h2 className="t-section">Visit Us</h2>
              <p className="t-sub mt-3">{SITE.name}</p>
              <p className="mt-2 text-[13px] tracking-[0.14em] uppercase text-dim">
                The Garden, {SITE.address.streetAddress}
              </p>
              <p className="mt-1 text-[13px] tracking-[0.14em] uppercase text-dim">
                {SITE.address.postalCode}
              </p>
              <a
                href={DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="t-eyebrow mt-4 inline-block !text-accent transition hover:!text-champagne"
              >
                Get directions →
              </a>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
