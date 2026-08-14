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

const RAIL_CLASS = "gap-4 px-[52px] max-md:gap-3 max-md:px-6";

// Card widths are set per rail so all three overflow the viewport at any width.
// At one shared width the three-card rail would fit on screen with nothing left
// to travel, and would sit still while its neighbours moved.
const RAILS = [
  {
    label: "What the mentorship covers",
    cardClass: "w-[clamp(280px,24vw,400px)] max-md:w-[80vw]",
    items: [
      "The route a piece takes before it reaches a window — dealers, wholesalers, private sellers, auction. Who to approach, what to say, and which doors stay shut until you have a track record.",
      "Reading a reference, condition and paperwork, then checking it against live market data instead of a hopeful asking price. The tells that separate a clean deal from an expensive lesson.",
      "What to pay, what to hold out for, and how long your money can sit in stock before a good buy turns into a bad month. Pricing without gutting the number you walk away with.",
      "How offers are made and answered between dealers, when to walk, and how to hold a position without burning a contact you will need again next quarter.",
      "Positioning, photography, how you write about a piece, and the difference between content that moves stock and content that just gets views.",
      "Authentication, provenance, paperwork and the checks that protect you — the admin nobody enjoys and everybody regrets skipping.",
    ],
  },
  {
    label: "How the mentorship runs",
    cardClass: "w-[clamp(300px,32vw,520px)] max-md:w-[80vw]",
    items: [
      "A short message about what you have done so far and what you want out of it. No test, no pitch — we just need to know the room is right for you.",
      "Then the invite: access to the private Telegram group, plus the groundwork breakdowns to work through in your own time.",
      "Notes go out as prices shift and pieces cross our desk, so what you are reading is this week's market rather than last year's theory.",
      "And when it matters, you put a specific piece, price or supplier in front of the group before you commit. That is the part you cannot get from a course.",
    ],
  },
  {
    label: "Who the mentorship is for",
    cardClass: "w-[clamp(300px,42vw,680px)] max-md:w-[80vw]",
    items: [
      "You want into the trade but have no supplier, no stock and nobody to ask. We start at the beginning and give you the questions to walk in with.",
      "You have done a few deals off your own back and want to run it as a business — consistent sourcing, real margin, and buyers who come back.",
      "You have the audience and the eye, but sourcing and pricing keep pinching. We fill in the trade side so the brand can carry weight.",
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
      <div
        ref={pinRef}
        className="flex flex-col justify-center gap-4 overflow-hidden bg-panel-soft py-16 max-md:gap-3 max-md:py-14"
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
                <article
                  data-haptic
                  className="cursor-big h-full border border-fg/[0.10] bg-fg/[0.04] p-7 transition-colors duration-300 hover:border-accent/40 hover:bg-fg/[0.06] max-md:p-6"
                >
                  <p className="text-[14px] leading-relaxed text-dim">{copy}</p>
                </article>
              </div>
            ))}
          </DragCarousel>
        ))}
      </div>
    </section>
  );
}
