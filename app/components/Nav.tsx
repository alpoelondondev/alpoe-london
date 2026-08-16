"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import SearchTrigger from "./SearchTrigger";
import LockupMark from "./LockupMark";
import { LOCKUP_ASPECT } from "./heroLockupShapes";
import type { SearchIndexEntry } from "@/lib/types";

type Suggestion = { name: string; url: string; kind: "Brand" | "Category" };

/**
 * Height of the lockup in the bar. Taller than the 28px the bare monogram used
 * to run at: the lockup carries ALPOE LONDON inside the same box, and below
 * about 40px those words stop resolving. Drop it and the wordmark turns to mud.
 */
const MONOGRAM_HEIGHT = 42;

/**
 * The site-wide mark is the live rose gold monogram. Still loaded dynamically:
 * three.js arrives after hydration rather than inside every page's first
 * bundle, and the flat SVG holds the slot until it does.
 */
const Monogram3D = dynamic(() => import("./Monogram3D"), {
  ssr: false,
  // The flat mark holds the slot while the 3D chunk loads, so the bar never
  // shows a hole and non-WebGL browsers keep a logo.
  loading: () => <MonogramFlat />,
});

/**
 * The flat mark — now the loading state while the 3D one arrives, and the
 * permanent mark on browsers without WebGL. Draws the same full lockup as the
 * GLB (monogram, both words, frame rules) so the bar never swaps artwork
 * underneath the viewer as the 3D chunk lands.
 */
function MonogramFlat() {
  return (
    <LockupMark
      width={Math.round(MONOGRAM_HEIGHT * LOCKUP_ASPECT)}
      fill="var(--color-accent)"
    />
  );
}


const LINKS = [
  { label: "Watches", href: "/watches" },
  { label: "Jewellery", href: "/jewellery" },
  { label: "Bespoke", href: "/bespoke" },
  { label: "Sell", href: "/sell" },
  { label: "Mentorship", href: "/mentorship" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Nav({
  searchIndex,
  suggestions,
}: {
  searchIndex: SearchIndexEntry[];
  suggestions: Suggestion[];
}) {
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      setHidden(y > 80 && y > lastY.current);
      lastY.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-200 px-[52px] py-4 flex justify-between items-center bg-bg/80 backdrop-blur-md border-b border-fg/[0.10] max-md:px-6 max-md:py-3 transition-transform duration-300 ${
          hidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        {/* Inside the bar rather than fixed alongside it, so it travels with
            the hide-on-scroll transform. Fixed, it stayed put once the bar had
            gone and sat over the page — worst on a phone, where there is no
            margin for it to hide in. The h-10 keeps the bar the height its
            40px spacer used to set, so nothing below it shifts. */}
        <Link
          href="/"
          className="flex h-10 shrink-0 items-center"
          aria-label="Alpoe London — Home"
        >
          <Monogram3D height={40} />
        </Link>
        {/* Tightens below lg: seven links at the full gap overflow the bar on a
            small laptop once the logo and search have taken their share. */}
        <ul className="flex gap-11 list-none max-lg:gap-6 max-md:hidden">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-[11px] tracking-[0.14em] uppercase text-fg no-underline opacity-70 transition-opacity duration-200 hover:opacity-100"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-5">
          {/* Booking sits outside the link list on purpose: eight plain links
              overflow the bar on a small laptop, and this is the one action
              the bar should carry rather than another destination. */}
          <Link
            href="/book-appointment"
            className="border border-accent px-4 py-2 text-[10px] tracking-[0.16em] uppercase text-accent transition hover:bg-accent hover:text-bg max-md:hidden"
          >
            Book
          </Link>
          <SearchTrigger index={searchIndex} suggestions={suggestions} />
          <button
            type="button"
            aria-label="Menu"
            className="hidden max-md:inline-flex text-[11px] tracking-[0.14em] uppercase text-fg/80"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[199] bg-bg/95 backdrop-blur-md pt-20 px-6 hidden max-md:block">
          <ul className="flex flex-col gap-6">
            <li>
              <Link
                href="/book-appointment"
                onClick={() => setMobileOpen(false)}
                className="font-serif text-3xl tracking-[0.02em] text-accent"
              >
                Book an Appointment
              </Link>
            </li>
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-serif text-3xl tracking-[0.02em]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}
