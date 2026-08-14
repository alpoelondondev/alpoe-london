"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DragCarousel from "../components/DragCarousel";

gsap.registerPlugin(ScrollTrigger);

/**
 * Two rails of metal plaques, held on screen together and driven by the page's
 * scroll.
 *
 * Arriving here, the block is pinned: the page stops moving down and the
 * scrolling you keep doing runs both rails sideways instead. Only once the
 * longer rail has reached its last card does the pin release and the page carry
 * on.
 *
 * The pin is GSAP's, not CSS `position: sticky`. Sticky is the obvious tool and
 * it does not work here — globals.css sets `overflow-x: hidden` on `html`,
 * which silently kills sticky for every descendant. GSAP pins with fixed
 * positioning instead, which that rule cannot reach.
 *
 * Phones get the same behaviour, at 1:1 rather than stretched — their cards are
 * far wider relative to the screen, so the desktop stretch would have held the
 * pin for three or four screenfuls. Only reduced motion opts out, and there the
 * rails are simply swiped by hand.
 */

const RAIL_CLASS = "gap-3 px-[52px] max-md:gap-2.5 max-md:px-6";

/**
 * Each rail travels across only part of the pin, staggered so they are never
 * both moving at once — one is always still, which is what gives the eye
 * something to actually read. They overlap enough that the band still feels
 * like one thing moving rather than two taking turns.
 */
const WINDOWS = [
  [0, 0.75],
  [0.25, 1],
];

/**
 * How much longer the pin is held than the furthest rail has to travel. At 1
 * the rails move a pixel sideways per pixel scrolled; with the windows above
 * taking 0.75 of the pin each, this lands them near that.
 */
const PIN_STRETCH = 1.4;

/** Progress within a rail's own window, flat at each end. */
const windowed = (p: number, [from, to]: number[]) =>
  Math.min(1, Math.max(0, (p - from) / (to - from)));

/**
 * Four to a rail, down from six and four and three. Thirteen passages read as
 * an inventory rather than an argument, and the third rail's material — who the
 * room is for — is already answered at length in the FAQ below, so cutting it
 * loses nothing from the page.
 */
const RAILS = [
  {
    label: "What the mentorship covers",
    cardClass: "w-[clamp(300px,34vw,520px)] max-md:w-[80vw]",
    items: [
      "Where stock comes from — dealers, wholesalers, private sellers, the auction floor — and how to get through each door.",
      "Reading a reference, its condition and its papers against what the market pays today, not what the tag says.",
      "What to pay, what to hold out for, and how offers get made between dealers without burning a contact.",
      "Positioning, photography, provenance, and the paperwork that protects you when a deal goes wrong.",
    ],
  },
  {
    label: "How the mentorship runs",
    cardClass: "w-[clamp(320px,36vw,560px)] max-md:w-[80vw]",
    items: [
      "Message us with what you have done so far and what you want out of it. No test, no pitch.",
      "The invite follows, with the groundwork to work through in your own time.",
      "Notes go out as prices move, so you are always reading this week's market.",
      "Put a piece, a price or a supplier to the group before you commit — the part a course cannot give you.",
    ],
  },
];

/**
 * A card built as a small piece of the lockup: rose ground, off-black ink, and
 * the frame's broken bracket around it — horizontals running in from each end
 * and stopping short of the middle, exactly as the artwork draws them. Copy is
 * set in the lockup's own Open Sans, tracked a little, so a plaque reads as
 * cut from the same plate as the mark above it.
 */
function Plaque({ children }: { children: string }) {
  return (
    <article
      data-haptic
      className="cursor-big group relative h-full bg-accent p-9 transition-colors duration-300 hover:bg-accent-deep max-md:p-7"
    >
      <div className="pointer-events-none absolute inset-4 border-l border-r border-bg/60 max-md:inset-3">
        {/* The bracket's horizontals, broken where the artwork breaks them. */}
        <span className="absolute -top-px left-0 h-px w-[34%] bg-bg/60" />
        <span className="absolute -top-px right-0 h-px w-[34%] bg-bg/60" />
        <span className="absolute -bottom-px left-0 h-px w-[34%] bg-bg/60" />
        <span className="absolute -bottom-px right-0 h-px w-[34%] bg-bg/60" />
      </div>
      <p className="relative font-opensans text-[15px] leading-[1.75] tracking-[0.01em] text-bg/85 max-md:text-[14px]">
        {children}
      </p>
    </article>
  );
}

export default function MentorshipRails() {
  const pinRef = useRef<HTMLDivElement>(null);
  // Spelled out rather than mapped over RAILS: hooks cannot run in a loop, and
  // there are exactly two rails.
  const railA = useRef<HTMLDivElement>(null);
  const railB = useRef<HTMLDivElement>(null);
  const railRefs = useMemo(() => [railA, railB], []);

  /** Where scroll alone would put each rail, before any manual drag. */
  const bases = useRef<number[]>(RAILS.map(() => 0));
  /** How far the user has dragged each rail off that base. Kept, never reset. */
  const offsets = useRef<number[]>(RAILS.map(() => 0));
  /**
   * Counts the writes this component made to each rail, so its scroll handler
   * can tell its own work from a real user scroll. A boolean would lose offsets
   * when several writes land before their scroll events do.
   */
  const pending = useRef<number[]>(RAILS.map(() => 0));

  useEffect(() => {
    const pin = pinRef.current;
    if (!pin) return;

    const travel = (el: HTMLDivElement | null) =>
      el ? Math.max(0, el.scrollWidth - el.clientWidth) : 0;

    const mm = gsap.matchMedia();
    mm.add(
      {
        isPhone: "(max-width: 767px)",
        reduce: "(prefers-reduced-motion: reduce)",
      },
      (ctx) => {
        const { isPhone, reduce } = ctx.conditions as Record<string, boolean>;
        if (reduce) return;

        // A phone's cards are far wider relative to the screen, so the same
        // stretch would hold the pin for several screenfuls. Kept at 1:1 there.
        const stretch = isPhone ? 1 : PIN_STRETCH;

        const st = ScrollTrigger.create({
          trigger: pin,
          start: "center center",
          // Held for as long as the furthest rail needs and no longer, so the
          // page releases the moment the last card lands rather than on a round
          // number of viewports. Recomputed on resize.
          end: () =>
            `+=${Math.max(...railRefs.map((r) => travel(r.current)), 1) * stretch}`,
          pin: true,
          pinSpacing: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            railRefs.forEach((ref, i) => {
              const el = ref.current;
              if (!el) return;
              const max = travel(el);
              if (max <= 0) return;
              bases.current[i] = windowed(self.progress, WINDOWS[i]) * max;
              // A manual drag rides on top of the scroll position rather than
              // cancelling it, so the page never snatches a rail back from
              // under a finger that has just moved it.
              const target = Math.min(max, Math.max(0, bases.current[i] + offsets.current[i]));
              if (Math.abs(el.scrollLeft - target) < 0.5) return;
              pending.current[i] += 1;
              el.scrollLeft = target;
            });
          },
        });
        return () => st.kill();
      },
    );

    return () => mm.revert();
  }, [railRefs]);

  return (
    <section aria-label="What the mentorship covers and how it runs">
      {/* Back to a dark band. The plaques are the metal now, and they are what
          breaks the page's run of near-blacks — a lightened ground behind them
          only muddies the rose. */}
      <div
        ref={pinRef}
        className="flex flex-col justify-center gap-3 overflow-hidden bg-panel py-12 max-md:gap-2.5 max-md:py-10"
      >
        {RAILS.map((rail, i) => (
          <DragCarousel
            key={rail.label}
            ariaLabel={rail.label}
            scrollerRef={railRefs[i]}
            noSnap
            onScroll={() => {
              if (pending.current[i] > 0) {
                pending.current[i] -= 1;
                return;
              }
              const el = railRefs[i].current;
              if (el) offsets.current[i] = el.scrollLeft - bases.current[i];
            }}
            className={RAIL_CLASS}
          >
            {rail.items.map((copy) => (
              <div key={copy} className={`flex-none ${rail.cardClass}`}>
                <Plaque>{copy}</Plaque>
              </div>
            ))}
          </DragCarousel>
        ))}
      </div>
    </section>
  );
}
