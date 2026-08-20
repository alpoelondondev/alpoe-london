import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";
import {
  RING_SIZES,
  AVERAGE_MENS_SIZE,
  AVERAGE_WOMENS_SIZE,
} from "@/lib/ring/sizes";
import { pageMetadata, ldJsonGraph, breadcrumbLd, faqLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import SheetFaq from "../components/SheetFaq";

const PATH = "/ring-size-guide";

/**
 * The ring size guide.
 *
 * Written for the queries people actually type: "ring size guide", "how to
 * measure ring size", "UK ring size chart", "average ring size UK", "can a ring
 * be resized". Each of those is a heading, because a heading that matches the
 * question is what gets pulled into a featured snippet.
 *
 * The chart is generated from lib/ring/sizes.ts rather than typed out. That
 * file builds every size from the British Standard: size A is 37.83mm inside
 * circumference and each whole letter adds 1.2467mm. Hard-coding a second table
 * here would be a second source of truth that could drift from the one the ring
 * builder quotes, and a size chart that disagrees with the shop is worse than
 * no size chart.
 *
 * Two things are deliberately absent. There is no free ring sizer offer and no
 * app, because Alpoe offers neither, and a guide that promises something the
 * shop does not do is worse than useless once somebody asks for it.
 */
export const metadata: Metadata = pageMetadata({
  title: "Ring Size Guide — UK Ring Size Chart",
  description:
    "How to measure your ring size at home, the full UK ring size chart A to Z in mm, average UK sizes for men and women, and how to find a size in secret.",
  path: PATH,
  image: "/og/ring-size-guide.jpg",
});

const WHOLE_SIZES = RING_SIZES.filter((s) => !s.label.includes("½"));

const FAQS = [
  {
    question: "How do I measure my ring size?",
    answer:
      "The three reliable methods are a ring sizer tool, a jeweller measuring your finger with a calibrated set of steel rings, and measuring an existing ring that already fits the correct finger. String, paper strips and tape measures are not accurate enough for a ring.",
  },
  {
    question: "What is the average ring size in the UK?",
    answer:
      `In the UK the average women's ring size is around ${AVERAGE_WOMENS_SIZE}, with most falling between G and T. The average men's ring size is around ${AVERAGE_MENS_SIZE}. These are starting points for a guess, not a substitute for measuring.`,
  },
  {
    question: "How much does one UK ring size change the fit?",
    answer:
      "One whole letter is 1.25mm of inside circumference, which is roughly 0.4mm of diameter. That is small enough that half sizes exist and matter, and it is why a string cannot give you a usable answer.",
  },
  {
    question: "Can a ring be resized?",
    answer:
      "Most plain and partly set rings can be resized by a jeweller, usually by one or two sizes in either direction. Full eternity rings cannot, because the diamonds run the whole way round and the spacing cannot be altered. Heavily engraved bands, milgrain work and tension settings are also difficult or impossible to resize without visible marks.",
  },
  {
    question: "What happens if a ring is too big?",
    answer:
      "It spins on the finger, and any stone will swivel to one side under its own weight. Over time the band takes on an oval shape from being pushed back into place, and there is a real risk of losing it.",
  },
  {
    question: "How can I find someone's ring size without them knowing?",
    answer:
      "Borrow a ring they already wear on the right finger and have it measured, ask a close friend or family member, try rings on together while browsing, or bring a ring in to be measured against a calibrated set.",
  },
];

export default function RingSizeGuidePage() {
  return (
    <>
      <SiteHeader />

      <main className="on-sheet bg-white">
        <section className="clears-nav px-[52px] pb-10 max-md:px-6 max-md:pb-8">
          <p className="t-eyebrow font-semibold">Guide</p>
          <h1 className="t-page mt-3">Ring Size Guide</h1>
          <p className="mt-5 max-w-[62ch] t-copy">
            A ring that does not fit cannot be worn, and if it is a proposal or a gift
            that matters. This guide covers how to measure ring size properly, the full
            UK chart, how to find a size without giving the surprise away, and what can
            be done if the size turns out to be wrong.
          </p>
        </section>

        <div className="px-[52px] pb-16 max-md:px-6 max-md:pb-12">
          <div className="max-w-[68ch]">
            {/* ---- what it is ------------------------------------------- */}
            <ScrollReveal>
              <section className="border-t border-sheet-line pt-8">
                <h2 className="t-sub">What is ring size?</h2>
                <p className="mt-3 t-copy">
                  Ring size is the inside measurement of the band. In the UK it is
                  written as a letter, from A to Z, and each whole letter adds 1.25mm to
                  the inside circumference. Half sizes sit between the letters, so the
                  real steps are around 0.62mm.
                </p>
                <p className="mt-3 t-copy">
                  Most of the world measures the same thing differently. The UK and
                  Ireland use letters, the United States uses numbers, and much of Europe
                  uses the circumference in millimetres directly. They all describe the
                  same band, so any of them can be converted.
                </p>
              </section>
            </ScrollReveal>

            {/* ---- the chart -------------------------------------------- */}
            <ScrollReveal>
              <section className="border-t border-sheet-line pt-8 mt-10">
                <h2 className="t-sub">UK ring size chart</h2>
                <p className="mt-3 t-copy">
                  Every whole UK size, with the inside circumference and the inside
                  diameter. Circumference is the figure a jeweller works from. Diameter
                  is what you get if you measure across the inside of a ring you already
                  own.
                </p>

                <div className="mt-6 overflow-x-auto">
                  <table className="w-full min-w-[380px] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-sheet-ink/25">
                        <th className="t-eyebrow py-3 pr-4 font-semibold">UK size</th>
                        <th className="t-eyebrow py-3 pr-4 font-semibold">
                          Circumference
                        </th>
                        <th className="t-eyebrow py-3 font-semibold">Diameter</th>
                      </tr>
                    </thead>
                    <tbody>
                      {WHOLE_SIZES.map((s) => (
                        <tr key={s.id} className="border-b border-sheet-line">
                          <td className="py-2.5 pr-4 text-[15px] font-semibold text-sheet-ink">
                            {s.label}
                          </td>
                          <td className="py-2.5 pr-4 text-[15px] tabular-nums text-sheet-ink/80">
                            {s.circumferenceMm.toFixed(2)}mm
                          </td>
                          <td className="py-2.5 text-[15px] tabular-nums text-sheet-ink/80">
                            {s.diameterMm.toFixed(2)}mm
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 t-copy">
                  Half sizes exist for every letter and we make to them as standard. The
                  figures follow the British Standard, where size A is 37.83mm inside
                  circumference.
                </p>
              </section>
            </ScrollReveal>

            {/* ---- how to measure --------------------------------------- */}
            <ScrollReveal>
              <section className="border-t border-sheet-line pt-8 mt-10">
                <h2 className="t-sub">How to measure ring size</h2>
                <p className="mt-3 t-copy">
                  There are three methods that give a size you can order from. Everything
                  else is a guess.
                </p>

                <h3 className="t-card mt-6">1. Have your finger measured</h3>
                <p className="mt-2 t-copy">
                  A jeweller measures with a calibrated set of steel rings, so you feel
                  the actual fit rather than reading a number off a scale. It takes a
                  minute and it is the most accurate method there is. We do this free of
                  charge at our Hatton Garden showroom.
                </p>

                <h3 className="t-card mt-6">2. Use a ring sizer</h3>
                <p className="mt-2 t-copy">
                  A plastic or metal ring sizer works like a belt: you slide it on, adjust
                  it until it passes over the knuckle with slight resistance, and read the
                  letter. Check it more than once, on different days, because fingers
                  change through the day.
                </p>

                <h3 className="t-card mt-6">3. Measure a ring they already wear</h3>
                <p className="mt-2 t-copy">
                  Measure the inside diameter across the widest point, then find it in the
                  chart above. It has to be a ring worn on the same finger of the same
                  hand, because the two hands are rarely the same size.
                </p>
              </section>
            </ScrollReveal>

            {/* ---- how not to ------------------------------------------- */}
            <ScrollReveal>
              <section className="border-t border-sheet-line pt-8 mt-10">
                <h2 className="t-sub">How not to measure ring size</h2>
                <p className="mt-3 t-copy">
                  The string trick is everywhere online and it does not work. String
                  stretches and a ring does not. Paper strips crease, and tape measures
                  are not marked finely enough. A whole UK size is 1.25mm of
                  circumference, so being 2mm out puts you nearly two sizes wrong, which
                  is the difference between a ring that fits and one that will not go on.
                </p>
                <p className="mt-3 t-copy">
                  Fingers also swell. They are largest at the end of the day, in warm
                  weather and after exercise, and smallest first thing on a cold morning.
                  Measure at a normal time of day, at a normal temperature, and measure
                  more than once.
                </p>
              </section>
            </ScrollReveal>

            {/* ---- in secret -------------------------------------------- */}
            <ScrollReveal>
              <section className="border-t border-sheet-line pt-8 mt-10">
                <h2 className="t-sub">How to find a ring size in secret</h2>
                <p className="mt-3 t-copy">
                  If the ring is a surprise, you cannot simply ask. Four things that work:
                </p>
                <ol className="mt-4 flex list-decimal flex-col gap-3 pl-5">
                  <li className="t-copy">
                    <strong className="!text-sheet-ink">Borrow a ring they wear.</strong>{" "}
                    Take one they wear on the correct finger and bring it to us. We will
                    measure it against a calibrated set and give it straight back.
                  </li>
                  <li className="t-copy">
                    <strong className="!text-sheet-ink">Ask someone close to them.</strong>{" "}
                    A sister, a best friend or a mother often knows, and can usually find
                    out without raising suspicion.
                  </li>
                  <li className="t-copy">
                    <strong className="!text-sheet-ink">Try rings on together.</strong>{" "}
                    Browsing a jeweller and trying things on for fun is normal. Note the
                    size before you leave.
                  </li>
                  <li className="t-copy">
                    <strong className="!text-sheet-ink">Order slightly large.</strong> A
                    ring that is a little big can be worn on the day and sized down
                    afterwards. A ring that is too small cannot be worn at all, and that
                    is the moment you are trying to protect.
                  </li>
                </ol>
                <p className="mt-4 t-copy">
                  Whichever you use, write the size down as soon as you have it. It is
                  exactly the sort of thing you are certain you will remember and then do
                  not.
                </p>
              </section>
            </ScrollReveal>

            {/* ---- averages --------------------------------------------- */}
            <ScrollReveal>
              <section className="border-t border-sheet-line pt-8 mt-10">
                <h2 className="t-sub">Average ring size in the UK</h2>
                <p className="mt-3 t-copy">
                  The average women&rsquo;s ring size in the UK is around{" "}
                  {AVERAGE_WOMENS_SIZE}, with most falling between G and T. The average
                  men&rsquo;s size is around {AVERAGE_MENS_SIZE}.
                </p>
                <p className="mt-3 t-copy">
                  Use these to sense check a size, not to choose one. Averages are a wide
                  range and hand size does not track height or build closely enough to
                  guess from.
                </p>
              </section>
            </ScrollReveal>

            {/* ---- wrong size ------------------------------------------- */}
            <ScrollReveal>
              <section className="border-t border-sheet-line pt-8 mt-10">
                <h2 className="t-sub">What happens if the size is wrong</h2>

                <h3 className="t-card mt-5">If the ring is too big</h3>
                <p className="mt-2 t-copy">
                  It spins, and any stone swivels to one side under its own weight so the
                  diamond ends up facing your palm. Pushed back into place several times a
                  day, the band slowly goes oval. The real risk is losing it, because a
                  ring that turns freely will come off over a cold knuckle without you
                  noticing.
                </p>

                <h3 className="t-card mt-5">If the ring is too small</h3>
                <p className="mt-2 t-copy">
                  Never force it on. A ring that has to be forced can be very difficult to
                  remove, and a finger swelling behind a tight band is a genuine medical
                  problem rather than an inconvenience. A band worn too tight also carries
                  daily pressure it was not designed for, and can eventually crack at the
                  shank.
                </p>
              </section>
            </ScrollReveal>

            {/* ---- resizing --------------------------------------------- */}
            <ScrollReveal>
              <section className="border-t border-sheet-line pt-8 mt-10">
                <h2 className="t-sub">Can a ring be resized?</h2>
                <p className="mt-3 t-copy">
                  Usually yes. A jeweller cuts the shank and either removes metal to make
                  it smaller or adds a matching piece to make it larger, then solders,
                  files and polishes until the join cannot be seen. One or two sizes in
                  either direction is routine work.
                </p>
                <p className="mt-3 t-copy">
                  Going further than that starts to change the ring. Sizing up a long way
                  thins the band at the bottom, and sizing down a long way can throw the
                  proportions of a setting out.
                </p>

                <h3 className="t-card mt-6">Rings that cannot be resized</h3>
                <ul className="mt-3 flex list-disc flex-col gap-2 pl-5">
                  <li className="t-copy">
                    <strong className="!text-sheet-ink">Full eternity rings.</strong>{" "}
                    Diamonds run the whole way round, so there is no plain shank to cut.
                    Changing the size means remaking the ring.
                  </li>
                  <li className="t-copy">
                    <strong className="!text-sheet-ink">Tension settings.</strong> The
                    stone is held by the spring of the metal, so altering the band alters
                    the grip that holds the diamond in place.
                  </li>
                  <li className="t-copy">
                    <strong className="!text-sheet-ink">
                      Milgrain and heavy engraving.
                    </strong>{" "}
                    The pattern runs continuously around the band and will not line up
                    across a join.
                  </li>
                  <li className="t-copy">
                    <strong className="!text-sheet-ink">Some inlays and ceramics.</strong>{" "}
                    Zirconium, tungsten and ceramic bands cannot be cut and soldered at
                    all.
                  </li>
                </ul>
                <p className="mt-4 t-copy">
                  This is why the size matters most on exactly the rings that are hardest
                  to change. If you are set on a full eternity band, measure properly
                  first.
                </p>
              </section>
            </ScrollReveal>

            {/*
              These six answers were, until now, published only as FAQPage
              JSON-LD — marked up for Google and shown to nobody. Rendering
              them is what makes that markup legitimate, and it happens to be
              the best content on the page: "what is the average UK ring size"
              and "can a ring be resized" are the questions people actually
              type.
            */}
            <SheetFaq items={FAQS} heading="Ring size questions, answered" />

            {/* ---- close ------------------------------------------------ */}
            <ScrollReveal>
              <section className="border-t border-sheet-line pt-8 mt-10">
                <h2 className="t-sub">Getting it right</h2>
                <p className="mt-3 t-copy">
                  Measure with a proper tool, measure more than once, and write the answer
                  down. If the ring is a surprise and you are not certain, tell us. We
                  would rather size a ring afterwards than have it not fit on the day.
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Link
                    href="/book-appointment"
                    className="inline-flex min-w-[236px] items-center justify-center bg-accent px-6 py-2.5 text-[11px] font-semibold tracking-[0.16em] uppercase text-white transition hover:bg-accent-deep"
                  >
                    Get measured in store
                  </Link>
                  <Link
                    href="/ring-builder"
                    className="inline-flex min-w-[236px] items-center justify-center border border-sheet-ink/25 px-6 py-2.5 text-[11px] font-semibold tracking-[0.16em] uppercase text-sheet-ink transition hover:border-sheet-ink/50"
                  >
                    Design a ring
                  </Link>
                </div>
              </section>
            </ScrollReveal>
          </div>
        </div>
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            ldJsonGraph([
              breadcrumbLd([
                { name: "Home", url: siteUrl("/") },
                { name: "Ring Size Guide", url: siteUrl(PATH) },
              ]),
              faqLd(FAQS.map((f) => ({ question: f.question, answer: f.answer }))),
            ]),
          ),
        }}
      />
    </>
  );
}
