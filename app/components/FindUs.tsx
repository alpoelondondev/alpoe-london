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
 * The top and bottom fade.
 *
 * Built rather than written out: a hand-set gradient needs a stop every couple
 * of percent to stop the eye finding the ramp, and thirty of those by hand is
 * both unreadable and easy to get subtly wrong on one side. This walks a
 * smoothstep curve — flat at both ends, steepest in the middle — so the map
 * eases out of the page instead of ramping out of it linearly, which is what
 * reads as a band however many stops a straight ramp is given.
 */
const MAP_FADE_RAMP = 34; // % of the map's height each edge fades across
const MAP_FADE_STEP = 2;

function mapFade() {
  const stops: string[] = [];
  for (let p = 0; p <= MAP_FADE_RAMP; p += MAP_FADE_STEP) {
    const t = p / MAP_FADE_RAMP;
    const alpha = t * t * (3 - 2 * t);
    stops.push(`rgba(0,0,0,${alpha.toFixed(3)}) ${p}%`);
  }
  // The bottom edge is the same curve walked backwards, so the two ends
  // cannot drift apart.
  for (let p = MAP_FADE_RAMP; p >= 0; p -= MAP_FADE_STEP) {
    const t = p / MAP_FADE_RAMP;
    const alpha = t * t * (3 - 2 * t);
    stops.push(`rgba(0,0,0,${alpha.toFixed(3)}) ${100 - p}%`);
  }
  return `linear-gradient(to bottom, ${stops.join(", ")})`;
}

const MAP_FADE = mapFade();

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
    <section
      id="find-us"
      // Top padding as well as bottom: the map used to sit straight under the
      // merchandise strip, and two full-bleed blocks meeting with no air read
      // as one block. The tail is short by comparison — the map's own bottom
      // edge already fades out, so a deep pad under it just doubled the gap
      // before the footer.
      className="pt-16 pb-8 max-md:pt-10 max-md:pb-6"
      aria-label="Find us"
    >
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
