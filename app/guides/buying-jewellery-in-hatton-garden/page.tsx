import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import Footer from "../../components/Footer";
import WhatsAppButton from "../../components/WhatsAppButton";
import Breadcrumbs from "../../components/Breadcrumbs";
import BrandHero from "../../components/BrandHero";
import ScrollReveal from "../../components/ScrollReveal";
import FAQ from "../../components/FAQ";
import { pageMetadata, ldJsonGraph, faqLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

const PATH = "/guides/buying-jewellery-in-hatton-garden";

/**
 * The page that answers the questions the commercial pages cannot.
 *
 * "Is Hatton Garden cheaper for engagement rings", "are Hatton Garden
 * jewellers expensive", "why are there so many jewellers in Hatton Garden",
 * "what is Hatton Garden famous for", "best jewellers in Hatton Garden" — a
 * whole informational cluster with real volume, low difficulty, and nothing on
 * this site addressing any of it. A product page cannot answer them without
 * becoming an advert, which is exactly why the question is being typed into a
 * search box instead.
 *
 * Deliberately not a landing page for "engagement rings hatton garden". The
 * homepage and /rings/engagement-and-wedding-rings already compete for that,
 * and a third URL chasing it would split the signal three ways. This one takes
 * the questions those two cannot.
 *
 * It is also the page most likely to be quoted by an assistant asked "should I
 * buy a ring in Hatton Garden" — which only works if it is honest, including
 * about the cases where the answer is no. The single most useful thing on it
 * is the paragraph explaining when Hatton Garden is *not* cheaper.
 *
 * Historical figures are from the London Museum's own account of the quarter,
 * cited in the copy. Nothing here is estimated.
 */

export const metadata: Metadata = pageMetadata({
  title: "Buying Jewellery in Hatton Garden",
  description:
    "Is Hatton Garden cheaper for engagement rings, and why are there so many jewellers on one street? An honest guide to buying in London's diamond quarter.",
  path: PATH,
  image: "/og/engagement-rings.jpg",
});

const PUBLISHED: string = "2026-08-20";
const UPDATED: string = "2026-08-20";

const DATE_FORMAT = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const HG_FAQS = [
  {
    question: "Is Hatton Garden cheaper for engagement rings?",
    answer:
      "Usually, for a comparable ring — often meaningfully so against a Bond Street or high-street equivalent. The reason is structural rather than promotional: many businesses here have their workshop on the premises or a few doors away, so there is no distributor, no brand licensing and no flagship-store rent inside the price. What you are not buying is the marketing. What you are buying is the same metal and the same certified stone.",
  },
  {
    question: "Are Hatton Garden jewellers expensive?",
    answer:
      "The range is wide, which is the honest answer. The street holds everything from trade suppliers to designers whose work costs more than a chain retailer's, and a diamond of a given weight and grade costs roughly what it costs wherever you buy it. What differs is the making, the setting and the margin — so the useful comparison is not shop against shop but specification against specification.",
  },
  {
    question: "Why are there so many jewellers in Hatton Garden?",
    answer:
      "Because the trade settled here and then compounded. Diamond cutters fleeing persecution in Antwerp and Amsterdam settled in and around Clerkenwell from the late 1600s; London Museum records 11 jewellery, watch and clock businesses in Hatton Garden directories in 1807, and 264 by 1907. Once the setters, casters, engravers, polishers, dealers and the assay office are all within a few streets of each other, it is far cheaper to make jewellery here than anywhere else in Britain — so everyone who makes jewellery comes here.",
  },
  {
    question: "What is Hatton Garden famous for?",
    answer:
      "Diamonds. It is London's diamond and jewellery quarter and has been for well over a century — at its peak, London Museum records that as much as 90% of the world's diamond supply was marketed through the Garden. It takes its name from Sir Christopher Hatton, to whom Elizabeth I granted part of the Bishop of Ely's estate in 1576. It is also, unavoidably, known for the 2015 safe deposit burglary, which had nothing to do with the working trade.",
  },
  {
    question: "Do I need an appointment, or can I just walk in?",
    answer:
      "Both work, and they suit different errands. Walking in is the right way to get a feel for the street and see what things look like in daylight. An appointment is better once you are close to deciding: it means somebody is held for you, the stones you asked about are out of the safe before you arrive, and you are not competing for a counter on a Saturday.",
  },
  {
    question: "What should I ask a Hatton Garden jeweller?",
    answer:
      "Four things. Ask to see the diamond's grading report and check the number on it matches the stone's girdle inscription. Ask whether the piece is made on site or bought in. Ask what happens if it needs resizing, and whether that is charged. And ask for the quote in writing with the specification on it — carat, colour, clarity, cut, metal and finger size — so you are comparing the same ring when you walk down the road to the next counter.",
  },
  {
    question: "Is it safe to buy from Hatton Garden?",
    answer:
      "Yes, with the ordinary care you would take anywhere. Look for a business with a real address you can return to rather than a room in a mixed building with no name on it, insist on a written specification, and remember that a hallmark is an independent test of the metal by an assay office and not something a seller can issue themselves. If a price is far below everything else on the street for the same stated specification, the specification is usually where the difference is.",
  },
];

const SOURCES: { label: string; href: string }[] = [
  {
    label:
      "London Museum — Hatton Garden: London's diamond & jewellery quarter",
    href: "https://www.londonmuseum.org.uk/collections/london-stories/hatton-garden-london-diamond-jewellery/",
  },
  {
    label: "The Assay Office London — contact and counter addresses",
    href: "https://www.assayofficelondon.co.uk/contact-us",
  },
];

export default function HattonGardenGuidePage() {
  const ld = ldJsonGraph([
    {
      "@type": "Article",
      "@id": siteUrl(PATH) + "#article",
      headline: "Buying Jewellery in Hatton Garden: An Honest Guide",
      description:
        "Why Hatton Garden is usually cheaper for an engagement ring, when it is not, how the quarter came to exist, and what to ask before you buy.",
      about: [
        { "@type": "Place", name: "Hatton Garden, London EC1N" },
        { "@type": "Thing", name: "Engagement rings" },
        { "@type": "Thing", name: "Diamond buying" },
      ],
      datePublished: PUBLISHED,
      dateModified: UPDATED,
      author: { "@id": siteUrl("/") + "#organization" },
      publisher: { "@id": siteUrl("/") + "#organization" },
      inLanguage: "en-GB",
      isPartOf: { "@id": siteUrl("/") + "#website" },
      mainEntityOfPage: { "@type": "WebPage", "@id": siteUrl(PATH) },
      citation: SOURCES.map((s) => ({
        "@type": "CreativeWork",
        name: s.label,
        url: s.href,
      })),
      url: siteUrl(PATH),
    },
    faqLd(HG_FAQS),
  ]);

  return (
    <>
      <SiteHeader />
      <main>
        <BrandHero
          eyebrow="Guide"
          title="Buying Jewellery in Hatton Garden"
          copy="Whether it is really cheaper, why there are three hundred jewellers on a few streets, and what to ask before you hand over a card. Written from a bench on it."
        />

        <p className="px-[52px] text-[11px] uppercase tracking-[0.14em] text-dim max-md:px-6">
          Alpoe London, Hatton Garden
          <span aria-hidden="true"> · </span>
          Published{" "}
          <time dateTime={PUBLISHED}>
            {DATE_FORMAT.format(new Date(PUBLISHED))}
          </time>
        </p>

        <section className="px-[52px] py-8 max-md:px-6">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Guides", href: "/guides" },
              { name: "Buying in Hatton Garden", href: PATH, current: true },
            ]}
          />
        </section>

        {/* Answer-first. The question in the title, settled in the first
            sentence, before any context. */}
        <ScrollReveal>
          <section className="px-[52px] pb-14 max-md:px-6">
            <p className="max-w-[64ch] text-[19px] leading-relaxed font-light text-blush">
              Yes, Hatton Garden is usually cheaper for an engagement ring — and
              the reason is worth understanding, because it also tells you when
              it will not be.
            </p>
            <p className="mt-5 max-w-[68ch] t-copy">
              A ring bought here has generally passed through fewer hands. Many
              of the businesses on these streets have their workshop upstairs or
              a few doors along, buy stones from dealers in the same postcode,
              and hallmark round the corner. There is no distributor margin, no
              brand licence and no flagship rent folded into the price. On a
              like-for-like specification that difference is real and it is
              often large.
            </p>
            <p className="mt-4 max-w-[68ch] t-copy">
              What it is not is a discount on the diamond itself. A stone of a
              given weight, colour, clarity and cut trades at roughly what it
              trades at, wherever you buy it. Anyone quoting far below the rest
              of the street for the same stated specification is describing a
              different stone.
            </p>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="border-t border-fg/10 px-[52px] py-14 max-md:px-6 max-md:py-10">
            <h2 className="t-section">Why are there so many jewellers here?</h2>
            <p className="mt-4 max-w-[68ch] t-copy">
              Because the trade arrived and then compounded. Diamond cutters
              fleeing persecution in Antwerp and Amsterdam settled in and around
              Clerkenwell from the late 1600s. The street itself is older still,
              and takes its name from Sir Christopher Hatton, to whom Elizabeth I
              granted part of the Bishop of Ely&rsquo;s estate in 1576.
            </p>
            <p className="mt-4 max-w-[68ch] t-copy">
              The growth is documented precisely. London Museum records{" "}
              <strong className="font-medium text-blush">
                11 businesses
              </strong>{" "}
              in the jewellery, watch and clock trades in Hatton Garden
              directories in 1807, and{" "}
              <strong className="font-medium text-blush">264 by 1907</strong> —
              among them 35 silversmiths, 45 jewellery manufacturers and 78 firms
              dealing in diamonds. At its peak, the museum records that as much
              as 90% of the world&rsquo;s diamond supply was marketed through the
              Garden. Today the quarter holds roughly three hundred jewellery
              firms and retailers.
            </p>
            <p className="mt-4 max-w-[68ch] t-copy">
              Concentration is self-reinforcing in a craft trade. When the
              setters, casters, engravers, polishers, laser welders, dealers and
              the assay office are all within a few minutes&rsquo; walk, making
              jewellery here is simply cheaper and faster than making it
              anywhere else in Britain — so everyone who makes jewellery comes
              here, which makes it cheaper and faster still.
            </p>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="border-t border-fg/10 bg-panel-soft px-[52px] py-14 max-md:px-6 max-md:py-10">
            <h2 className="t-section">When Hatton Garden is not cheaper</h2>
            <p className="mt-4 max-w-[68ch] t-copy">
              Three cases, and it is worth saying them plainly.
            </p>
            <ul className="mt-6 flex max-w-[68ch] flex-col gap-4">
              <li className="border-t border-fg/[0.10] pt-4 t-copy">
                <strong className="font-medium text-blush">
                  Against a discounter selling online only.
                </strong>{" "}
                A website with no premises, no bench and no counter has a lower
                cost base than a workshop does. It also cannot put three stones
                in front of you, cannot size the ring on the day, and is a
                different proposition when something needs putting right.
              </li>
              <li className="border-t border-fg/[0.10] pt-4 t-copy">
                <strong className="font-medium text-blush">
                  On a branded piece.
                </strong>{" "}
                If what you want is a particular maker&rsquo;s name inside the
                ring, you are buying that name and it is priced accordingly
                wherever you buy it.
              </li>
              <li className="border-t border-fg/[0.10] pt-4 t-copy">
                <strong className="font-medium text-blush">
                  When the specifications are not the same.
                </strong>{" "}
                This is the one that catches people. Two quotes on &ldquo;a one
                carat solitaire&rdquo; can differ by thousands and both be fair,
                because colour, clarity, cut grade, fluorescence and whether the
                stone is natural or laboratory-grown are all still unstated. Get
                the specification in writing and the comparison becomes trivial.
              </li>
            </ul>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="border-t border-fg/10 px-[52px] py-14 max-md:px-6 max-md:py-10">
            <h2 className="t-section">How to buy well here</h2>
            <div className="mt-8 grid grid-cols-2 gap-x-10 gap-y-8 max-md:grid-cols-1">
              <div className="border-t border-accent/40 pt-4">
                <h3 className="font-serif text-[19px] leading-tight text-blush">
                  Ask for the grading report
                </h3>
                <p className="mt-3 t-copy">
                  And check the certificate number matches the inscription on
                  the stone&rsquo;s girdle — a jeweller will show you under a
                  loupe. GIA grades most natural stones, IGI most
                  laboratory-grown ones. A hallmark is not a substitute: it
                  tests the metal and says nothing about the diamond.
                </p>
              </div>
              <div className="border-t border-accent/40 pt-4">
                <h3 className="font-serif text-[19px] leading-tight text-blush">
                  Ask where it is made
                </h3>
                <p className="mt-3 t-copy">
                  Some shops here make; some buy in and resell. Neither is
                  wrong, but it changes what can be altered, how quickly a
                  problem is fixed, and who you are actually talking to when
                  something needs adjusting.
                </p>
              </div>
              <div className="border-t border-accent/40 pt-4">
                <h3 className="font-serif text-[19px] leading-tight text-blush">
                  See stones side by side
                </h3>
                <p className="mt-3 t-copy">
                  Two diamonds with near-identical certificates can look
                  markedly different across a counter, and no photograph will
                  show you that. This is the single largest advantage of buying
                  in person, and it is free.
                </p>
              </div>
              <div className="border-t border-accent/40 pt-4">
                <h3 className="font-serif text-[19px] leading-tight text-blush">
                  Get it in writing
                </h3>
                <p className="mt-3 t-copy">
                  Carat, colour, clarity, cut, metal, finger size, and what
                  resizing costs if it is needed. A written specification is
                  what turns four quotes into a comparison rather than four
                  conversations.
                </p>
              </div>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="border-t border-fg/10 px-[52px] py-14 max-md:px-6 max-md:py-10">
            <h2 className="t-section">What is actually on the street</h2>
            <p className="mt-4 max-w-[68ch] t-copy">
              The quarter is small — a few hundred metres between Holborn
              Circus and Clerkenwell Road, with Farringdon and Chancery Lane
              stations at either end. Three addresses are worth knowing.
            </p>
            <dl className="mt-8 max-w-3xl divide-y divide-fg/[0.08] border-t border-fg/[0.08]">
              <div className="py-4">
                <dt className="text-[13px] uppercase tracking-[0.1em] text-blush">
                  The Assay Office counter, 17 Greville Street
                </dt>
                <dd className="mt-2 t-copy">
                  Where pieces made here are independently tested and
                  hallmarked. Its main office is at Goldsmiths&rsquo; Hall in the
                  City, but the counter being inside the quarter is why
                  hallmarking a ring made here is a walk rather than a wait.{" "}
                  <Link
                    href="/hallmarking"
                    className="text-accent underline underline-offset-4"
                  >
                    What the marks mean
                  </Link>
                  .
                </dd>
              </div>
              <div className="py-4">
                <dt className="text-[13px] uppercase tracking-[0.1em] text-blush">
                  The London Diamond Bourse, 100 Hatton Garden
                </dt>
                <dd className="mt-2 t-copy">
                  The trading floor the quarter grew around, descended from the
                  syndicate that distributed rough diamonds through London.
                  Members trade with each other rather than the public.
                </dd>
              </div>
              <div className="py-4">
                <dt className="text-[13px] uppercase tracking-[0.1em] text-blush">
                  The workshops
                </dt>
                <dd className="mt-2 t-copy">
                  Mostly upstairs and mostly unmarked. The shopfronts are the
                  part you see; the benches, casting rooms and setters that make
                  the quarter work are on the floors above them.
                </dd>
              </div>
            </dl>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="border-t border-fg/10 px-[52px] py-14 max-md:px-6 max-md:py-10">
            <h2 className="t-section">Where we fit</h2>
            <p className="mt-4 max-w-[68ch] t-copy">
              We are one of the jewellers on it, so treat this page as written
              from a bench rather than from nowhere. What we do is bespoke: rings
              and pieces{" "}
              <Link href="/bespoke" className="text-accent underline underline-offset-4">
                made to order
              </Link>{" "}
              at our own bench, natural or laboratory-grown stones with no
              steering toward either, and{" "}
              <Link href="/watches" className="text-accent underline underline-offset-4">
                watches
              </Link>{" "}
              bought, sold and sourced alongside. If you would rather start by
              reading, the{" "}
              <Link
                href="/guides/natural-vs-lab-grown-diamonds"
                className="text-accent underline underline-offset-4"
              >
                diamond guide
              </Link>{" "}
              and the{" "}
              <Link
                href="/ring-size-guide"
                className="text-accent underline underline-offset-4"
              >
                ring size guide
              </Link>{" "}
              are the two things people ask about most. If you would rather come
              and look,{" "}
              <Link
                href="/book-appointment"
                className="text-accent underline underline-offset-4"
              >
                book a time
              </Link>{" "}
              — or simply walk in.
            </p>
          </section>
        </ScrollReveal>

        <FAQ items={HG_FAQS} />

        <ScrollReveal>
          <section className="border-t border-fg/10 px-[52px] py-12 max-md:px-6 max-md:py-9">
            <h2 className="text-[11px] uppercase tracking-[0.2em] text-accent">
              Sources
            </h2>
            <ul className="mt-4 flex flex-col gap-2 text-sm font-light text-dim">
              {SOURCES.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline underline-offset-4 transition-colors hover:text-accent"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </ScrollReveal>
      </main>

      <Footer />
      <WhatsAppButton />

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
    </>
  );
}
