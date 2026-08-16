import Image from "next/image";
import ScrollReveal from "./ScrollReveal";

/**
 * Teaser band for the merch, sitting between the FAQ and the socials.
 *
 * The photography runs full bleed and heavily darkened, so the band reads as a
 * ground rather than a picture, and the two lines of type stay legible over the
 * cap and the bag both.
 *
 * The top edge is the point of it: an inset shadow raking down from above, with
 * a hairline catching the light just beneath, so the section reads as recessed
 * behind the page rather than stacked on top of it. Every part of that effect
 * is scoped inside this section, so no other strip on the page is touched.
 */
export default function MerchandiseStrip() {
  return (
    <section
      id="merchandise"
      aria-label="Merchandise"
      className="relative isolate overflow-hidden bg-bg"
    >
      <Image
        src="/alpoe-london-merchandise-cap-gift-bag-hatton-garden.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover object-center pointer-events-none"
      />

      {/* Darkened back so type sits on it comfortably. Weighted to the top,
          where the recess needs the ground to already be deep. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(19,16,16,0.82),rgba(19,16,16,0.5)_38%,rgba(19,16,16,0.66))] pointer-events-none"
      />

      {/* The recess: shadow raking in from the top edge as though the section
          above overhangs it. Bottom gets a fraction of the same so the band
          reads as sunk on both sides rather than tipped forward. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 shadow-[inset_0_26px_34px_-14px_rgba(0,0,0,0.95),inset_0_-10px_20px_-12px_rgba(0,0,0,0.7)] pointer-events-none"
      />

      {/* The lip: one hairline of caught light directly under the shadow, which
          is what turns a dark gradient into something embossed. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.14),transparent)] pointer-events-none"
      />

      <div className="relative flex flex-col items-center px-[52px] py-24 text-center max-md:px-6 max-md:py-16">
        <ScrollReveal>
          <h2 className="font-serif text-[clamp(30px,4.4vw,56px)] tracking-[0.02em] leading-none text-blush">
            Merchandise
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.08}>
          <p className="mt-4 text-[11px] tracking-[0.2em] uppercase text-champagne">
            Alpoe London merch coming soon
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}
