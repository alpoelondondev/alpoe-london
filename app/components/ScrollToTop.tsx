"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Puts every navigation back at the top of the page.
 *
 * Next scrolls to the top on a route change by itself, and on most of this site
 * that works. It stops working where GSAP is involved: ScrollTrigger caches the
 * document height and every trigger's start and end position, and those caches
 * survive a client side navigation. The new page mounts with the previous
 * page's geometry still in memory, and the scroll position it settles on is
 * computed from a document that is no longer there. The symptom is arriving on
 * a page already scrolled part of the way down.
 *
 * `ScrollTrigger.refresh()` is what discards that. It has to happen after the
 * new page has laid out, hence the double `requestAnimationFrame` — one frame
 * to let React commit, the next to let the browser lay out what it committed.
 *
 * ── Why this keys on pathname only ──
 *
 * The ring builder writes the whole configuration into the query string and
 * calls `router.replace` on every selection, deliberately with `scroll: false`.
 * If this reacted to the full URL it would throw the customer back to the top of
 * the page each time they picked a metal, which is the exact behaviour that
 * option was added to prevent. The pathname does not change during a
 * configuration, so keying on it leaves the builder alone.
 *
 * A navigation carrying a hash is also left alone: somebody following a link to
 * a section wants that section, not the top.
 */
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.location.hash) return;

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
        ScrollTrigger.refresh();
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return null;
}
