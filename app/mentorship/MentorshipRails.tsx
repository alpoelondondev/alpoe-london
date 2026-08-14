"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DragCarousel from "../components/DragCarousel";

gsap.registerPlugin(ScrollTrigger);

/**
 * The three rails, held on screen together and driven by the page's scroll.
 *
 * Arriving here, the block is pinned: the page stops moving down and the
 * scrolling you keep doing runs all three rails sideways instead. Only once
 * the longest rail has reached its last card does the pin release and the page
 * carry on.
 *
 * The pin is GSAP's, not CSS `position: sticky`. Sticky is the obvious tool and
 * it does not work here — globals.css sets `overflow-x: hidden` on `html`,
 * which silently kills sticky for every descendant. GSAP pins with fixed
 * positioning instead, which that rule cannot reach.
 *
 * Below md the pin is dropped and these are three ordinary swipeable rails. A
 * phone would otherwise spend several screens of scroll on one section, and
 * swiping is the natural gesture there anyway. Reduced motion opts out on the
 * same grounds.
 */

const RAIL_CLASS = "gap-3 px-[52px] max-md:gap-2.5 max-md:px-6";

// Card widths are set per rail so all three overflow the viewport at any width.
// At one shared width the three-card rail would fit on screen with nothing left
// to travel, and would sit still while its neighbours moved.
const RAILS = [
  {
    label: "What the mentorship covers",
    cardClass: "w-[clamp(230px,19vw,300px)] max-md:w-[74vw]",
    items: [
      "Where stock actually comes from — dealers, wholesalers, private sellers, auction — and how to get through each door.",
      "Reading a reference, its condition and its papers against what the market pays today, not what the tag says.",
      "What to pay, what to hold out for, and how long money can sit in a piece before it costs you.",
      "How offers get made between dealers: when to push, when to walk, how not to burn a contact.",
      "Positioning and photography, and why some content shifts stock while the rest just gets views.",
      "Authentication, provenance, and the paperwork that protects you when a deal goes wrong.",
    ],
  },
  {
    label: "How the mentorship runs",
    cardClass: "w-[clamp(250px,25vw,380px)] max-md:w-[74vw]",
    items: [
      "Message us with what you have done so far and what you want out of it. No test, no pitch.",
      "The invite follows, with the groundwork to work through in your own time.",
      "Notes go out as prices move, so you are always reading this week's market.",
      "Put a piece, a price or a supplier to the group before you commit — the part a course cannot give you.",
    ],
  },
  {
    label: "Who the mentorship is for",
    cardClass: "w-[clamp(270px,33vw,500px)] max-md:w-[74vw]",
    items: [
      "No supplier, no stock, nobody to ask. We start you at the beginning.",
      "Already flipping pieces, and after steady sourcing, real margin and buyers who come back.",
      "You have the audience and the eye — it is sourcing and pricing that keep pinching.",
    ],
  },
];

export default function MentorshipRails() {
  const pinRef = useRef<HTMLDivElement>(null);
  // Spelled out rather than mapped over RAILS: hooks cannot run in a loop, and
  // there are exactly three rails.
  const railA = useRef<HTMLDivElement>(null);
  const railB = useRef<HTMLDivElement>(null);
  const railC = useRef<HTMLDivElement>(null);
  const railRefs = useMemo(() => [railA, railB, railC], []);

  /** Where scroll alone would put each rail, before any manual drag. */
  const bases = useRef<number[]>(RAILS.map(() => 0));
  /** How far the user has dragged each rail off that base. Kept, never reset. */
  const offsets = useRef<number[]>(RAILS.map(() => 0));
  /**
   * Counts the writes this component made to each rail, so its scroll handler
   * can tell its own work from a real user scroll. A boolean would lose
   * offsets when several writes land before their scroll events do.
   */
  const pending = useRef<number[]>(RAILS.map(() => 0));

  useEffect(() => {
    const pin = pinRef.current;
    if (!pin) return;

    const travel = (el: HTMLDivElement | null) =>
      el ? Math.max(0, el.scrollWidth - el.clientWidth) : 0;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const st = ScrollTrigger.create({
        trigger: pin,
        start: "center center",
        // Held for exactly as long as the longest rail needs, so the page
        // releases the moment the last card lands rather than on a round
        // number of viewports. Recomputed on resize.
        end: () => `+=${Math.max(...railRefs.map((r) => travel(r.current)), 1)}`,
        pin: true,
        pinSpacing: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          railRefs.forEach((ref, i) => {
            const el = ref.current;
            if (!el) return;
            const max = travel(el);
            if (max <= 0) return;
            bases.current[i] = self.progress * max;
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
    });

    return () => mm.revert();
  }, [railRefs]);

  return (
    <section aria-label="What the mentorship covers, how it runs and who it is for">
      {/* Lighter than any of the theme's surfaces, so the band reads as a
          break in the page's run of near-blacks rather than another panel.
          Mixed from the foreground rather than hard-coded, so it tracks the
          palette if the ground ever shifts. */}
      <div
        ref={pinRef}
        className="flex flex-col justify-center gap-3 overflow-hidden bg-fg/[0.09] py-10 max-md:gap-2.5 max-md:py-8"
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
                {/* cursor-big swells the site cursor over the card; data-haptic
                    gives the press buzz the linked carousels have — a panel
                    that isn't a link gets neither for free. */}
                {/* Darker than the band it sits on — inverted from the rest of
                    the site, where panels lift off the ground. On a light band
                    it is the recess that reads as a card. */}
                <article
                  data-haptic
                  className="cursor-big h-full border border-fg/[0.08] bg-bg/70 p-5 transition-colors duration-300 hover:border-accent/50 hover:bg-bg/90 max-md:p-4"
                >
                  <p className="text-[13px] leading-relaxed text-fg/65">{copy}</p>
                </article>
              </div>
            ))}
          </DragCarousel>
        ))}
      </div>
    </section>
  );
}
