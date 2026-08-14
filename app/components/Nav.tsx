"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import SearchTrigger from "./SearchTrigger";
import {
  MONOGRAM_ASPECT,
  MONOGRAM_GLYPHS,
  MONOGRAM_VIEWBOX,
} from "./monogramPaths";
import type { SearchIndexEntry } from "@/lib/types";

type Suggestion = { name: string; url: string; kind: "Brand" | "Category" };

/**
 * Cap height of the monogram in the bar. The wordmark it replaces was a 48px
 * box only about half filled with ink, so matching its *drawn* height — rather
 * than its box — is what keeps the bar's weight unchanged.
 */
const MONOGRAM_HEIGHT = 28;

const LINKS = [
  { label: "Watches", href: "/watches" },
  { label: "Jewellery", href: "/jewellery" },
  { label: "Bespoke", href: "/bespoke" },
  { label: "Sell", href: "/sell" },
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
          {/* Sized from a height, since the viewBox is cropped tight to the ink
              and the lockup's width follows from its own aspect. */}
          <svg
            viewBox={MONOGRAM_VIEWBOX}
            height={MONOGRAM_HEIGHT}
            width={Math.round(MONOGRAM_HEIGHT * MONOGRAM_ASPECT)}
            aria-hidden="true"
            fill="var(--color-accent)"
            xmlns="http://www.w3.org/2000/svg"
          >
            {MONOGRAM_GLYPHS.map((glyph, i) => (
              <g key={i} transform={glyph.transform}>
                {glyph.paths.map((d, j) => (
                  <path key={j} d={d} />
                ))}
              </g>
            ))}
          </svg>
        </Link>
        <ul className="flex gap-11 list-none max-md:hidden">
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
