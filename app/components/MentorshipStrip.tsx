import Link from "next/link";
import ScrollReveal from "./ScrollReveal";
import MentorshipLockup from "./MentorshipLockup";

/**
 * Homepage band for Alpoe London Elite, carrying the stencilled lockup the
 * programme's own page opens on so the two read as the same thing.
 *
 * The colours run the opposite way to that page: the band is the house
 * off-black and the mark is the rose, rather than rose ground and off-black
 * mark. Behind it, diamonds and watches are scattered in the same rose at an
 * opacity low enough to stay a texture rather than a pattern competing with
 * the mark.
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
    <section
      aria-labelledby="mentorship-heading"
      className="relative overflow-hidden bg-bg px-[52px] py-10 max-md:px-6 max-md:py-8"
    >
      {/*
        A section heading that is announced rather than drawn.

        The homepage's design has no visible headline over these bands, which
        left the document outline running h1 straight to h3 and left three
        whole sections with no name at all — a screen-reader user landing in
        the middle of the page had nothing telling them what they were in. It
        also meant the page said nothing, in heading text, about the things it
        exists to sell. This is the standard fix for a section whose identity
        is carried by a picture: state it for the readers who cannot see it.
      */}
      <h2 id="mentorship-heading" className="sr-only">
        Alpoe London mentorship for the watch and jewellery trade
      </h2>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {MOTIFS.map((m, i) => (
          <svg
            key={i}
            viewBox="0 0 24 24"
            width={m.size}
            height={m.size}
            fill="none"
            stroke="var(--color-accent)"
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
          {/* Ground off: the band paints its own, and the mark's rect would
              cover the motifs behind it either way. The artwork is the rose
              now — the band went dark under it, so the colours swapped. */}
          <MentorshipLockup
            ground={false}
            word="ELITE PROGRAMME"
            mark="var(--color-accent)"
            className="w-[min(380px,72vw)]"
          />
        </ScrollReveal>
        <ScrollReveal delay={0.08}>
          <p className="t-copy mt-2 max-w-lg">Membership required*</p>
        </ScrollReveal>
        <ScrollReveal delay={0.16}>
          <Link
            href="/mentorship"
            className="mt-5 inline-flex items-center justify-center bg-accent px-5 py-2 text-[11px] font-medium uppercase tracking-[0.16em] text-bg transition hover:bg-accent-deep"
          >
            Enquire
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
