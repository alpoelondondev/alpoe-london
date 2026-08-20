"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import SearchTrigger from "./SearchTrigger";
import MarketTicker, { type TickerItem } from "./MarketTicker";
import LockupMark from "./LockupMark";
import { LOCKUP_ASPECT } from "./heroLockupShapes";
import { useDeferredUntilIdle } from "./useDeferredUntilIdle";

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
  // Three ways into the same page. Somebody arriving to buy a wedding band and
  // somebody arriving to design an engagement ring are on different errands,
  // and a single "Rings" entry makes both of them hunt for their half of it.
  // The page carries all three, so the menu names all three and each lands on
  // its own section.
  { label: "Engagement & Wedding Rings", href: "/rings/engagement-and-wedding-rings" },
  { label: "Ready to Ship Rings", href: "/rings/ready-to-ship" },
  // Not ready to be shown to visitors yet.
  { label: "Ring Builder", href: "/ring-builder", hidden: true },
  { label: "Bespoke", href: "/bespoke" },
  { label: "Guides", href: "/guides" },
  { label: "Sell & Trade", href: "/sell" },
  { label: "Mentorship", href: "/mentorship" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Nav({
  suggestions,
  ticker,
  tickerStale,
}: {
  suggestions: Suggestion[];
  /** Live spot for the announcement strip; omitted, the strip is not drawn. */
  ticker?: TickerItem[];
  tickerStale?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  // See useDeferredUntilIdle: three.js waits until the page has settled.
  const markReady = useDeferredUntilIdle();
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();

  /**
   * The ring builder only gets the bar back at the very top of the page.
   *
   * Everywhere else, reappearing on an upward scroll is the whole point: you
   * are going back for something and the bar is what you are going back for.
   * The builder is the exception because its own picture is pinned directly
   * beneath, and scrolling up through the option rails is what somebody does
   * constantly while comparing settings. A bar that drops in every time they do
   * lands on top of the ring they are comparing, which is the one thing on that
   * page that must not be covered.
   */
  const revealOnlyAtTop = pathname === "/ring-builder";

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

  /**
   * Hide going down, show going up.
   *
   * Three rules, all of them there because the naive version is annoying:
   *
   * Nothing happens in the first `REVEAL_AT` pixels, or the bar flickers away
   * the instant you nudge the page at the top, where it is least in the way.
   *
   * A movement has to exceed `DELTA` to count. Without it, the sub-pixel jitter
   * of a trackpad or a phone's rubber banding flips the bar back and forth
   * continuously.
   *
   * It never hides while the menu is open, because the menu's close control
   * lives in it.
   *
   * The class on <html> is what lets `position: sticky` elements elsewhere
   * follow — see `--nav-offset` in globals.css. Without it the ring builder's
   * pinned row would hold its offset and leave a gap where the bar used to be.
   */
  useEffect(() => {
    const REVEAL_AT = 120;
    // Small, because "at the top" should mean at the top rather than near it.
    const AT_TOP = 24;
    const DELTA = 6;
    let last = window.scrollY;
    let frame = 0;

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const y = window.scrollY;
        // On the builder the rule is positional, so a tiny movement still has
        // to be acted on — the guard exists only to stop direction flapping.
        if (!revealOnlyAtTop && Math.abs(y - last) < DELTA) return;
        const goingDown = y > last;
        last = y;
        setHidden(revealOnlyAtTop ? y > AT_TOP : goingDown && y > REVEAL_AT);
      });
    };

    // Run once on mount as well: arriving part way down a page, or switching
    // to a route with a different rule, must settle the bar without waiting for
    // the customer to scroll.
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
      document.documentElement.classList.remove("nav-hidden");
    };
  }, [revealOnlyAtTop]);

  useEffect(() => {
    document.documentElement.classList.toggle("nav-hidden", hidden && !menuOpen);
  }, [hidden, menuOpen]);

  useEffect(() => {
    if (menuOpen) setHidden(false);
  }, [menuOpen]);

  return (
    <>
      {/* Pinned for the whole page rather than hiding on a downward scroll:
          the bar carries the only route list, the search field and the live
          spot strip, so it has to be reachable wherever the reader is. */}
      {/* Solid, not `bg-bg/80`. The translucent bar was designed against a
          site that was off-black the whole way down, where 80% over a dark page
          is still dark. The ring pages are white, and the same 80% lets that
          white up through the bar and turns the house off-black into a washed
          out grey. A fixed bar sits over every page, so it cannot be tinted by
          the one underneath it. */}
      {/* Away on a downward scroll, back on an upward one. Pinned bars cost
          the top of every screen permanently; this one charges only while you
          are going back for something, which is when you want it.

          Transform rather than `top`, so the browser can composite the movement
          off the main thread and it cannot jitter against the scroll. */}
      <nav
        className={`fixed top-0 left-0 right-0 z-200 px-[52px] pt-6 pb-4 bg-bg border-b border-fg/[0.10] transition-transform duration-300 ease-out max-md:px-6 max-md:pt-5 max-md:pb-3 ${
          hidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
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
            // The panel is now always in the DOM, so the button can name it.
            aria-controls="site-menu"
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
            {/* Flat until the browser is idle. The bar is on every page and
                this is the only thing on it that costs half a megabyte. */}
            {markReady ? <Monogram3D height={48} /> : <MonogramFlat />}
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
            <SearchTrigger suggestions={suggestions} />
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

      {/*
        Always in the document, hidden with visibility rather than unmounted.

        The panel used to be `{menuOpen ? <div>…</div> : null}`, and since
        `menuOpen` is false on the server, the HTML every crawler received
        contained exactly two links: the logo and "Book". Ten of the site's
        eleven top-level routes existed only after a click. The footer was
        carrying the entire crawlable link graph on its own, and whatever the
        footer omitted was effectively unreachable.

        Keeping it mounted costs nothing — it is markup that was already being
        rendered a moment later — and puts the real navigation in the served
        HTML. `inert` (and pointer-events-none) make sure the hidden panel
        cannot be focused, clicked or read out while it is closed, so nothing
        about the closed state changes for anyone using the page.
      */}
      <div
        id="site-menu"
        inert={!menuOpen}
        aria-hidden={!menuOpen}
        className={`fixed inset-0 z-[199] overflow-y-auto bg-bg px-[52px] pb-16 max-md:px-6 ${
          menuOpen ? "visible" : "invisible pointer-events-none"
        }`}
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
              prefetch={menuOpen ? undefined : false}
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
                /*
                 * Keeping the panel mounted for crawlers had a cost nobody
                 * asked for: Next prefetches every <Link> it finds in the
                 * viewport, and the closed panel is laid out full-screen, so
                 * eleven routes were being speculatively fetched on every
                 * single page load — competing with the hero for connections
                 * while none of them was on screen. Prefetch when the menu is
                 * actually open and somebody might use one.
                 */
                prefetch={menuOpen ? undefined : false}
                onClick={() => setMenuOpen(false)}
                className="t-sub block py-4 transition-colors hover:!text-accent"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
