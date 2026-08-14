"use client";

import { useRef } from "react";
import DragCarousel from "../components/DragCarousel";

/**
 * The three rails, parked in one section and driven together.
 *
 * The section is deliberately three viewports tall with its contents stuck to
 * the top of the screen. What that buys is the behaviour asked for: the page
 * appears to stop when the rails arrive, and the scrolling you keep doing goes
 * sideways into all three at once instead of downwards. Once they run out, the
 * section releases and the page carries on.
 *
 * The pin is CSS `sticky`, not a scroll hijack — nothing is intercepting the
 * wheel, so trackpad, keyboard and screen-reader scrolling all behave. Each
 * rail is still a real scroll container that can be dragged or swiped by hand
 * at any point; the drag rides on top of the scroll position rather than
 * fighting it.
 *
 * Below md the pin is dropped entirely and these are three ordinary swipeable
 * rails. A phone would have spent three screens of scroll on one section, and
 * swiping is the more natural gesture there anyway.
 */

const RAIL_CLASS = "gap-4 px-[52px] max-md:gap-3 max-md:px-6";

// Card widths are set per rail so that all three overflow the viewport at any
// width — three cards at the six-card size would fit on screen with nothing
// left to travel, and a rail with no overflow would sit still while its
// neighbours moved.
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
  const trackRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={trackRef}
      aria-label="What the mentorship covers, how it runs and who it is for"
      className="relative bg-panel-soft h-[300vh] max-md:h-auto max-md:py-14"
    >
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center gap-4 overflow-hidden max-md:static max-md:h-auto max-md:gap-3 max-md:overflow-visible">
        {RAILS.map((rail) => (
          <DragCarousel
            key={rail.label}
            ariaLabel={rail.label}
            drift="forward"
            driftTrigger={trackRef}
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
