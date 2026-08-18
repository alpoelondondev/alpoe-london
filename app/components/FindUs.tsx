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

// Leaflet on CARTO's dark raster tiles: dynamic, no account and no API key.
// Raster means no Web Worker and no WebGL, which is why this survives the
// Turbopack bundle where a vector engine silently never spawns its worker.
//
// Dark rather than Positron because the site is off-black — a paper-white map
// read as a hole punched in the page. The gold is ours, not CARTO's: no
// provider ships a black-and-gold basemap, so `.map-gold` in globals.css puts
// a filter over the tile pane (see there for why it is on the pane and not the
// container). Delete that one class and this is a plain dark map again.
const TILES = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
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
const MAP_FADE_TOP = 30; // % of the map's height the top edge fades across
// Longer than the top: below the map is the address line and then the footer,
// so the map has to give way to type rather than to more page.
const MAP_FADE_BOTTOM = 46;
const MAP_FADE_STEP = 2;

function mapFade() {
  const stops: string[] = [];
  for (let p = 0; p <= MAP_FADE_TOP; p += MAP_FADE_STEP) {
    const t = p / MAP_FADE_TOP;
    const alpha = t * t * (3 - 2 * t);
    stops.push(`rgba(0,0,0,${alpha.toFixed(3)}) ${p}%`);
  }
  // The bottom edge is the same curve walked backwards over its own ramp.
  for (let p = MAP_FADE_BOTTOM; p >= 0; p -= MAP_FADE_STEP) {
    const t = p / MAP_FADE_BOTTOM;
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
        <h2 className="t-section mb-6 px-[52px] text-center max-md:mb-4 max-md:px-6">
          Visit Us
        </h2>

        {/* Full-bleed: the map runs edge to edge, no gutter and no border.
            Masked top and bottom so it dissolves into the page rather than
            butting against it on two hard horizontals. A mask rather than
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
            <div
              ref={holder}
              className="map-gold h-[380px] w-full max-md:h-[280px]"
            />
          )}
        </div>

        {/* One line, not three: under a full-bleed map this is a caption, and
            a stacked block there reads as a second section starting. */}
        <p className="mt-5 px-[52px] text-center text-[12px] tracking-[0.14em] uppercase text-dim max-md:mt-4 max-md:px-6">
          {SITE.name} · The Garden, {SITE.address.streetAddress} ·{" "}
          {SITE.address.postalCode} ·{" "}
          <a
            href={DIRECTIONS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent transition hover:text-champagne"
          >
            Get directions →
          </a>
        </p>
      </ScrollReveal>
    </section>
  );
}
