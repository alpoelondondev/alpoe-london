"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import SearchTrigger from "./SearchTrigger";
import MarketTicker, { type TickerItem } from "./MarketTicker";
import LockupMark from "./LockupMark";
import { LOCKUP_ASPECT } from "./heroLockupShapes";
import type { SearchIndexEntry } from "@/lib/types";

type Suggestion = { name: string; url: string; kind: "Brand" | "Category" };

/**
 * Height of the lockup in the bar. Taller than the 28px the bare monogram used
 * to run at: the lockup carries ALPOE LONDON inside the same box, and below
 * about 40px those words stop resolving. Drop it and the wordmark turns to mud.
 * Now scaled up with the rest of the bar, which runs deliberately tall.
 */
const MONOGRAM_HEIGHT = 50;

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


/**
 * `hidden` keeps a route in the list but out of the menu — the page is still
 * built and still reachable by URL, it just is not advertised yet. Delete the
 * flag to put it back; that is the whole restore.
 */
const LINKS: { label: string; href: string; hidden?: boolean }[] = [
  { label: "Watches", href: "/watches" },
  { label: "Jewellery", href: "/jewellery" },
  // Not ready to be shown to visitors yet.
  { label: "Ring Builder", href: "/ring-builder", hidden: true },
  { label: "Bespoke", href: "/bespoke" },
  { label: "Sell & Trade", href: "/sell" },
  { label: "Mentorship", href: "/mentorship" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Nav({
  searchIndex,
  suggestions,
  ticker,
  tickerStale,
}: {
  searchIndex: SearchIndexEntry[];
  suggestions: Suggestion[];
  /** Live spot for the announcement strip; omitted, the strip is not drawn. */
  ticker?: TickerItem[];
  tickerStale?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  // The panel is now the only route list on every screen, so it needs the
  // escape hatch a full-screen overlay is expected to have.
  useEffect(() => {
    if (!menuOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <>
      {/* Pinned for the whole page rather than hiding on a downward scroll:
          the bar carries the only route list, the search field and the live
          spot strip, so it has to be reachable wherever the reader is. */}
      <nav className="fixed top-0 left-0 right-0 z-200 px-[52px] pt-6 pb-4 bg-bg/80 backdrop-blur-md border-b border-fg/[0.10] max-md:px-6 max-md:pt-5 max-md:pb-3">
        {/* Three equal-weight columns rather than a flex row, so the lockup is
            centred against the bar itself and not against whatever the menu
            and Book button happen to measure. The outer columns are free to
            differ in width — and on a phone, where Book is hidden, they do. */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
          {/* The three lines are the whole navigation now: every route lives
              behind them at every screen size, which is why they lead the bar
              rather than hiding on the right the way the old Menu word did. */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="group flex h-14 w-10 shrink-0 flex-col justify-center gap-[5px] justify-self-start"
          >
            {/* The rules are shorter than the button: the hit area stays a
                comfortable 40px wide while the mark itself stays a fine
                three-line glyph, scaled to the trimmed bar. The middle line fades and
                the outer two meet in the centre, so the open state reads as a
                close control without swapping in a second icon. */}
            <span
              className={`h-px w-[18px] bg-fg transition-all duration-300 group-hover:bg-accent ${
                menuOpen ? "translate-y-[6px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-px w-[18px] bg-fg transition-all duration-300 group-hover:bg-accent ${
                menuOpen ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`h-px w-[18px] bg-fg transition-all duration-300 group-hover:bg-accent ${
                menuOpen ? "-translate-y-[6px] -rotate-45" : ""
              }`}
            />
          </button>

          {/* Inside the bar rather than fixed alongside it, so it is laid out
              against the bar's own rows. The h-14 sets the row's floor height,
              so the mark and the menu share one baseline. */}
          <Link
            href="/"
            className="flex h-14 shrink-0 items-center justify-self-center"
            aria-label="Alpoe London — Home"
          >
            <Monogram3D height={48} />
          </Link>

          {/* Booking is the one action the bar carries rather than another
              destination, so it keeps its place out here while the routes sit
              behind the menu. */}
          <Link
            href="/book-appointment"
            className="justify-self-end border border-accent px-5 py-2.5 text-[11px] tracking-[0.16em] uppercase text-accent transition hover:bg-accent hover:text-bg max-md:hidden"
          >
            Book
          </Link>
        </div>

        {/* Search gets its own row under the lockup: a bar wide enough to
            invite a query but narrower than the mark, so it reads as a field
            hung under the lockup rather than a second banner. */}
        <div className="mt-3 flex justify-center">
          <div className="w-full max-w-md">
            <SearchTrigger index={searchIndex} suggestions={suggestions} />
          </div>
        </div>
        {/* Full-bleed along the bar's bottom edge — the negative margins undo
            the bar's own gutters and bottom padding so the strip meets the
            border rather than floating above it. */}
        {ticker?.length ? (
          <div className="-mx-[52px] -mb-4 mt-3 max-md:-mx-6 max-md:-mb-3">
            <MarketTicker items={ticker} stale={tickerStale} />
          </div>
        ) : null}
      </nav>

      {menuOpen ? (
        // Cleared off the bar by the bar's own measured height rather than a
        // hand-set padding — the bar has grown twice (search row, then the
        // spot strip) and a fixed pt- went under it both times.
        <div
          className="fixed inset-0 z-[199] overflow-y-auto bg-bg/95 backdrop-blur-md px-[52px] pb-16 max-md:px-6"
          style={{ paddingTop: "calc(var(--nav-h) + 24px)" }}
        >
          {/* Ruled rather than spaced: at this size a gap alone left the
              labels reading as one column of words, so each route gets its own
              row with a hairline under it. divide-y draws the rules between
              rows only, so the list does not close itself off top and bottom. */}
          <ul className="mx-auto flex w-full max-w-xl flex-col divide-y divide-fg/[0.12]">
            <li>
              <Link
                href="/book-appointment"
                onClick={() => setMenuOpen(false)}
                className="t-sub block py-4 !text-accent"
              >
                Book an Appointment
              </Link>
            </li>
            {LINKS.filter((link) => !link.hidden).map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="t-sub block py-4 transition-colors hover:!text-accent"
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
