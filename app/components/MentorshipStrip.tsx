import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import MentorshipLockup from "./MentorshipLockup";

/**
 * Homepage band for the mentorship, carrying the rose ground and stencilled
 * lockup the mentorship page opens on so the two read as the same thing.
 *
 * Behind the mark, diamonds and watches are scattered in the page ground's own
 * colour — the same knockout treatment as the lettering, at an opacity low
 * enough to stay a texture rather than a pattern competing with it.
 */

/** Round brilliant in plan: girdle, table and the star facets between. */
const DIAMOND = (
  <>
    <path d="M12 3 L20 9 L12 21 L4 9 Z" />
    <path d="M4 9 H20" />
    <path d="M12 3 L8 9 L12 21" />
    <path d="M12 3 L16 9 L12 21" />
  </>
);

/** Case, strap stubs, crown and hands — as the FAQ's affordance draws it. */
const WATCH = (
  <>
    <path d="M9 3.4h6l-.5 3.2M9 20.6h6l-.5-3.2M9.5 6.6L9 3.4" />
    <circle cx="12" cy="12" r="5.4" />
    <path d="M17.7 10.9h1.1v2.2h-1.1" />
    <path d="M12 9.1V12l1.9 1.2" />
  </>
);

/**
 * Placed by hand rather than generated: a random scatter has to be seeded to
 * survive hydration, and eight positions chosen to keep clear of the mark are
 * cheaper than a seeded generator. Percentages, so they hold at any width.
 */
const MOTIFS = [
  { shape: DIAMOND, left: "3%", top: "14%", size: 62, rotate: -14, opacity: 0.2 },
  { shape: WATCH, left: "13%", top: "62%", size: 48, rotate: 9, opacity: 0.15 },
  { shape: DIAMOND, left: "24%", top: "8%", size: 34, rotate: 22, opacity: 0.13 },
  { shape: WATCH, left: "33%", top: "78%", size: 30, rotate: -8, opacity: 0.12 },
  { shape: DIAMOND, left: "62%", top: "80%", size: 42, rotate: 12, opacity: 0.14 },
  { shape: WATCH, left: "74%", top: "12%", size: 56, rotate: -18, opacity: 0.18 },
  { shape: DIAMOND, left: "88%", top: "58%", size: 70, rotate: 8, opacity: 0.2 },
  { shape: WATCH, left: "94%", top: "24%", size: 32, rotate: 16, opacity: 0.12 },
];

export default function MentorshipStrip() {
  return (
    <section className="relative overflow-hidden bg-accent px-[52px] py-20 max-md:px-6 max-md:py-14">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {MOTIFS.map((m, i) => (
          <svg
            key={i}
            viewBox="0 0 24 24"
            width={m.size}
            height={m.size}
            fill="none"
            stroke="var(--color-bg)"
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute"
            style={{
              left: m.left,
              top: m.top,
              opacity: m.opacity,
              transform: `translate(-50%, -50%) rotate(${m.rotate}deg)`,
            }}
          >
            {m.shape}
          </svg>
        ))}
      </div>

      <div className="relative flex flex-col items-center text-center">
        <ScrollReveal>
          {/* Ground off: the band is already rose, and the mark's own rect
              would paint over the motifs behind it. */}
          <MentorshipLockup ground={false} className="w-[min(540px,82vw)]" />
        </ScrollReveal>
        <ScrollReveal delay={0.08}>
          <p className="mt-2 max-w-lg text-[14px] leading-[1.7] text-bg/80">
            A private group run from our Hatton Garden counter for anyone serious about
            buying and selling watches and jewellery. Sourcing, pricing and negotiating,
            as we do it every week.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.16}>
          <Link
            href="/mentorship"
            className="mt-8 inline-flex items-center justify-center bg-bg px-8 py-4 font-serif text-[18px] uppercase tracking-[0.08em] text-blush transition hover:text-fg"
          >
            Learn The Trade
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
