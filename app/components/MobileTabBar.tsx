"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { ROUTES } from "@/lib/routes";

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
 * ── Glass ──
 *
 * It was solid `bg-bg` for a long time, on the argument that a translucent bar
 * over the white ring pages turns the house off-black into grey. What it
 * actually did was make the pill read as a slab bolted over the page rather
 * than a control floating above it, which is the opposite of the point of
 * floating it.
 *
 * So: blurred and saturated backdrop with the house off-black at 72% on top.
 * That is dark enough to stay off-black over white (72% of #131010 over paper
 * lands near #4f4e4d, not grey), and the blur is what sells it as glass — a
 * flat tint alone just looks like a mistake. The opaque `bg-bg` stays as the
 * base declaration and the tint is applied only inside
 * `@supports (backdrop-filter: blur(0))`, so a browser without it gets the old
 * solid pill rather than a see-through one. Tailwind emits the `-webkit-`
 * prefix alongside, which is what Safari on iOS still needs.
 *
 * ── Drag across to choose ──
 *
 * The highlight is a physical thing on glass, so it can be pushed. Put a
 * finger anywhere on the bar and slide: the pill follows under it and the tab
 * it lands on is the one that opens on release. A tap is untouched — the drag
 * only takes over past a few pixels of travel, and the anchors underneath stay
 * ordinary links, so keyboard, screen reader and middle-click all still work
 * and the whole thing degrades to four links if the JS never arrives.
 *
 * `touch-action: pan-y` is what makes it feel native: the browser keeps
 * vertical scrolling for itself and hands us the horizontal axis, instead of
 * the two fighting over the same gesture.
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
  { label: "Watches", href: ROUTES.watches, icon: WATCH },
  { label: "Jewellery", href: ROUTES.jewellery, icon: JEWELLERY },
  { label: "Rings", href: ROUTES.rings, icon: RING },
  { label: "Elite", href: ROUTES.mentorship, icon: ELITE, elite: true },
];

/** How far a finger has to travel before it counts as a drag and not a tap. */
const DRAG_THRESHOLD = 8;

export default function MobileTabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const listRef = useRef<HTMLUListElement>(null);
  const startX = useRef(0);
  /** Set on release after a drag, so the click it produces is not a second navigation. */
  const swallowClick = useRef(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  // A brand page is still the Watches tab, so the whole subtree counts as
  // current — but `/jewellery` must not light up for `/jewellery-x`.
  const isCurrent = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);
  const active = TABS.findIndex((t) => isCurrent(t.href));
  const activeTab = active >= 0 ? TABS[active] : undefined;

  /** Which tab a page x-coordinate is over, clamped to the ends of the bar. */
  const indexAt = (clientX: number) => {
    const box = listRef.current?.getBoundingClientRect();
    if (!box) return null;
    const inner = box.width - 8; // the ul's p-1 either side
    const i = Math.floor(((clientX - box.left - 4) / inner) * TABS.length);
    return Math.min(TABS.length - 1, Math.max(0, i));
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLUListElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    startX.current = e.clientX;
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLUListElement>) => {
    // Buttons is 0 for a finger merely hovering a trackpad or a mouse moving
    // across the bar; only a held pointer drags.
    if (e.buttons === 0) return;
    if (dragIndex === null && Math.abs(e.clientX - startX.current) < DRAG_THRESHOLD) return;
    if (dragIndex === null) listRef.current?.setPointerCapture(e.pointerId);
    const i = indexAt(e.clientX);
    if (i !== null) setDragIndex(i);
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLUListElement>) => {
    if (dragIndex === null) return;
    const target = TABS[dragIndex];
    setDragIndex(null);
    listRef.current?.releasePointerCapture?.(e.pointerId);
    // The release lands on whichever anchor is under the finger, which is not
    // necessarily the one that was chosen — so navigate ourselves and eat the
    // click that follows.
    swallowClick.current = true;
    if (!isCurrent(target.href)) router.push(target.href);
  };

  const onPointerCancel = () => setDragIndex(null);

  /** Where the pill is: under the finger while dragging, on the route otherwise. */
  const shown = dragIndex ?? active;
  const dragging = dragIndex !== null;

  return (
    <nav
      aria-label="Primary"
      className="fixed left-4 right-4 z-[150] rounded-full border border-fg/[0.12] bg-bg shadow-lg shadow-black/40 backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-bg/72 md:hidden"
      style={{ bottom: `calc(${FLOAT_GAP}px + env(safe-area-inset-bottom))` }}
    >
      <ul
        ref={listRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onClickCapture={(e) => {
          if (!swallowClick.current) return;
          swallowClick.current = false;
          e.preventDefault();
          e.stopPropagation();
        }}
        style={{ touchAction: "pan-y" }}
        className="relative grid grid-cols-4 overflow-hidden rounded-full p-1 select-none"
      >
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
          className={`pointer-events-none absolute bottom-1 left-1 top-1 w-[calc((100%-0.5rem)/4)] rounded-full border border-fg/[0.14] shadow-[inset_0_1px_0_rgba(255,255,255,0.10)] backdrop-saturate-150 transition-[transform,opacity,background-color] ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none ${
            dragging ? "duration-100" : "duration-300"
          } ${
            (dragIndex === null ? activeTab?.elite : TABS[dragIndex]?.elite)
              ? "bg-elite/[0.16]"
              : "bg-fg/[0.12]"
          } ${shown < 0 ? "opacity-0" : "opacity-100"}`}
          style={{ transform: `translateX(${Math.max(shown, 0) * 100}%)` }}
        />
        {TABS.map((tab, i) => {
          const current = isCurrent(tab.href);
          // While dragging, the tab under the finger takes the lit styling so
          // the bar previews where the release will land. `aria-current` stays
          // on the real route throughout — the page has not changed yet, and a
          // screen reader should not be told otherwise mid-gesture.
          const lit = dragging ? i === dragIndex : current;
          const tone = tab.elite
            ? "text-elite"
            : lit
              ? "text-accent"
              : "text-dim";
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={current ? "page" : undefined}
                className={`relative flex h-[50px] flex-col items-center justify-center gap-1 rounded-full text-[9px] tracking-[0.16em] uppercase transition-colors ${tone} ${
                  lit ? "" : "hover:text-fg"
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
