"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * The phone's standing navigation: four destinations pinned to the bottom of
 * every page, under the thumb.
 *
 * The top bar carries the whole route list, but behind a menu button and above
 * the fold — on a phone that is two taps and a scroll back up for the things
 * people actually came for. This bar is those four, always reachable,
 * and it leaves the menu to everything else. It is phone-only: on a desktop
 * the bar is already on screen and a fixed strip along the bottom would just
 * be taking a row off the page.
 *
 * It floats: a pill held off the screen edges rather than a strip welded to
 * the bottom, so the page is visibly passing underneath it and it reads as a
 * control rather than a chrome bar. The inset keeps it clear of the curved
 * corners and the home indicator, which the old edge-to-edge strip sat on.
 *
 * Solid `bg-bg`, not a tint — the same reason Nav gives. The ring pages are
 * white, and a translucent bar over them turns the house off-black into grey.
 * Floating on white, the solid off-black pill is the house mark at its best.
 *
 * Its footprint lives in `--tab-h` (globals.css) because two other things
 * have to clear it: the page itself, via body padding, and the WhatsApp badge.
 */

/** Gap between the pill and the screen's bottom edge. Mirrored in --tab-h. */
const FLOAT_GAP = 12;

/** House icon set: 24 box, hairline stroke, round joins. Matches FAQ's watch. */
function Glyph({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[22px] w-[22px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

/** Strap stubs, case, crown, hands — the same watch the FAQ draws. */
const WATCH = (
  <Glyph>
    <path d="M9 3.4h6l-.5 3.2M9 20.6h6l-.5-3.2M9.5 6.6L9 3.4" />
    <circle cx="12" cy="12" r="5.4" />
    <path d="M17.7 10.9h1.1v2.2h-1.1" />
    <path d="M12 9.1V12l1.9 1.2" />
  </Glyph>
);

/** A pendant on a chain — jewellery that is deliberately not a ring. */
const JEWELLERY = (
  <Glyph>
    <path d="M4.6 3.6c0 4.7 3.3 8.1 7.4 8.1s7.4-3.4 7.4-8.1" />
    <path d="M12 13.1 14.4 15.9 12 20.4 9.6 15.9 Z" />
    <path d="M9.6 15.9h4.8" />
  </Glyph>
);

/** A solitaire in plan: band below, stone above, the way the ring pages draw it. */
const RING = (
  <Glyph>
    <path d="M12 2.9 14.7 5.6 12 8.3 9.3 5.6 Z" />
    <path d="M9.3 5.6h5.4" />
    <circle cx="12" cy="15.2" r="5.6" />
  </Glyph>
);

/**
 * Round brilliant in plan — girdle, table, star facets — with a plus set into
 * the corner. Same stone MentorshipStrip draws, held at 86% and nudged clear
 * of the badge so the two marks never touch.
 */
const ELITE = (
  <Glyph>
    <g transform="translate(-0.6 2.2) scale(0.86)">
      <path d="M12 3 L20 9 L12 21 L4 9 Z" />
      <path d="M4 9 H20" />
      <path d="M12 3 L8 9 L12 21" />
      <path d="M12 3 L16 9 L12 21" />
    </g>
    <path d="M19.2 2.6v4.4M17 4.8h4.4" />
  </Glyph>
);

/**
 * `elite` paints the tab in the sapphire rather than the house rose, which is
 * the point of it: this one is not another aisle of the shop, it is the way
 * into the programme, and it should not read as a third category.
 */
const TABS: { label: string; href: string; icon: ReactNode; elite?: boolean }[] = [
  { label: "Watches", href: "/watches", icon: WATCH },
  { label: "Jewellery", href: "/jewellery", icon: JEWELLERY },
  { label: "Rings", href: "/rings", icon: RING },
  { label: "Elite", href: "/mentorship", icon: ELITE, elite: true },
];

export default function MobileTabBar() {
  const pathname = usePathname();

  // A brand page is still the Watches tab, so the whole subtree counts as
  // current — but `/jewellery` must not light up for `/jewellery-x`.
  const isCurrent = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);
  const active = TABS.findIndex((t) => isCurrent(t.href));
  const activeTab = active >= 0 ? TABS[active] : undefined;

  return (
    <nav
      aria-label="Primary"
      className="fixed left-4 right-4 z-[150] rounded-full border border-fg/[0.12] bg-bg shadow-lg shadow-black/40 md:hidden"
      style={{ bottom: `calc(${FLOAT_GAP}px + env(safe-area-inset-bottom))` }}
    >
      <ul className="relative grid grid-cols-4 overflow-hidden rounded-full p-1">
        {/*
          One highlight for the whole bar rather than one per tab, so moving
          between sections slides it across instead of snapping it off one
          tab and on to the next. It is a quarter of the inner width and
          translated by whole multiples of itself; on a page that belongs to
          no tab it fades out in place rather than jumping to a corner.
          Sapphire when it lands on Elite, for the same reason that tab is.
        */}
        <span
          aria-hidden="true"
          className={`pointer-events-none absolute bottom-1 left-1 top-1 w-[calc((100%-0.5rem)/4)] rounded-full transition-[transform,opacity,background-color] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none ${
            activeTab?.elite ? "bg-elite/[0.12]" : "bg-fg/[0.07]"
          } ${active < 0 ? "opacity-0" : "opacity-100"}`}
          style={{ transform: `translateX(${Math.max(active, 0) * 100}%)` }}
        />
        {TABS.map((tab) => {
          const current = isCurrent(tab.href);
          const tone = tab.elite
            ? "text-elite"
            : current
              ? "text-accent"
              : "text-dim";
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={current ? "page" : undefined}
                className={`relative flex h-[50px] flex-col items-center justify-center gap-1 rounded-full text-[9px] tracking-[0.16em] uppercase transition-colors ${tone} ${
                  current ? "" : "hover:text-fg"
                }`}
              >
                {/* The current tab sits on the sliding pill above rather than
                    being marked by colour alone, so it still reads for anyone
                    who cannot separate the rose from the cream. */}
                {tab.icon}
                <span>{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
