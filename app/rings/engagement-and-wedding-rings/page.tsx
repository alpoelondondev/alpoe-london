import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import Footer from "../../components/Footer";
import ScrollReveal from "../../components/ScrollReveal";
import SheetFaq from "../../components/SheetFaq";
import { CardRail, RAIL_ITEM, ReadyToShipCard, StyleGrid } from "../RingCards";
import { collectionPieces } from "@/lib/rings/collection";
import { ringStyles, styleHref, styleTitle } from "@/lib/rings/styles";
import { rendersOrigin } from "@/lib/ring/renders";
import { pageMetadata, ldJsonGraph, breadcrumbLd, collectionLd, faqLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site";
import { SHAPE_GUIDES } from "@/lib/rings/shapeGuides";

const PATH = "/rings/engagement-and-wedding-rings";

/**
 * Engagement rings and wedding bands on one page, because they are one
 * purchase. Nobody buys a wedding band without an engagement ring to sit it
 * against, and the band has to be shaped to that ring, so splitting them put a
 * navigation step between two halves of the same decision.
 *
 * The URL names both. `/rings/engagement-rings` carrying wedding bands would be
 * a page whose address contradicts a third of its contents, which is bad for
 * anyone reading the link and bad for what the page is understood to be about.
 */
export const metadata: Metadata = pageMetadata({
  title: "Engagement & Wedding Rings, Hatton Garden",
  description:
    "Fifteen engagement ring styles made to order in Hatton Garden, plus wedding rings and bands to match. Choose the diamond shape, setting, metal and UK size.",
  path: PATH,
  image: "/og/engagement-rings.jpg",
});

const COMMISSION_STEPS = [
  {
    title: "Choose a starting point",
    copy: "A style above, a photograph, a sketch, or a stone you already own. Nothing here is a fixed product — it is a place to begin.",
  },
  {
    title: "See it in CAD",
    copy: "We model the exact ring and send it to you to look at, with the price. Changes at this stage cost nothing but a day.",
  },
  {
    title: "Cast, set and finish",
    copy: "Cast in your metal, the stones set by hand, then polished. This is the part that takes the time.",
  },
  {
    title: "Hallmarked and yours",
    copy: "Struck at the London Assay Office, whose counter is on Greville Street here in Hatton Garden, then sized and handed over or shipped insured.",
  },
];

/*
 * Answer-first and specific. Every one of these is a question somebody asks
 * across the counter before they will commit to a conversation, and the ones
 * with numbers in them — how long, how much, what a carat costs — are the ones
 * that get quoted back to us. Hedged copy answers nothing and gets cited by
 * nobody.
 */
const ENGAGEMENT_FAQS = [
  {
    question: "How long does a bespoke engagement ring take?",
    answer:
      "It depends on the ring, so we give you a date when we quote rather than quoting a standard one. Casting, setting, finishing and hallmarking at the London Assay Office are each a real step. If you are working to a deadline, tell us at the very start — we would rather turn a date down than miss it.",
  },
  {
    question: "How much should I spend on an engagement ring?",
    answer:
      "As much as suits you, and no more. The three-months'-salary rule was written by an advertising agency in the 1930s and has no other basis. What actually moves the price is carat weight above everything, then colour and clarity, then the metal — so the useful question is not what to spend but which of those to spend it on, and that is a conversation rather than a number.",
  },
  {
    question: "Can I use a diamond or a ring I already own?",
    answer:
      "Yes — the ring builder already opens on starting from a sketch, an heirloom stone or a conversation. An inherited stone can be reset into something you will actually wear. Bring it in and we will tell you honestly whether it is worth resetting before you commit to anything.",
  },
  {
    question: "Do you offer laboratory-grown diamonds?",
    answer:
      "Yes, on every setting here, and we do not steer you toward either one. A laboratory-grown diamond is chemically and optically identical to a mined one and graded by the same laboratories, and typically costs a good deal less for the same size and grade — which is why many people put the difference into a larger stone. Our guide sets out the whole comparison.",
  },
  {
    question: "Can I come and see the diamonds in person?",
    answer:
      "Yes, and if you can, you should. Two stones with identical certificates can look quite different across a counter, and nothing on a screen shows you that. Book an appointment and we will put several side by side.",
  },
  {
    question: "What if the ring does not fit?",
    answer:
      "Most rings can be adjusted a size or two either way, and we will tell you what that involves before you commission anything. The exception is a full eternity band, where the diamonds run the whole way round and the spacing cannot be altered — which is exactly why the size matters most on the rings that are hardest to change.",
  },
];

export default function EngagementAndWeddingRingsPage() {
  const styles = ringStyles();
  const pieces = collectionPieces();
  const renders = rendersOrigin();

  return (
    <>
      {renders && (
        <>
          <link rel="preconnect" href={renders} crossOrigin="" />
          <link rel="dns-prefetch" href={renders} />
        </>
      )}

      <SiteHeader />

      <main className="on-sheet bg-white">
        <section className="clears-nav px-[52px] pb-8 max-md:px-6 max-md:pb-6">
          <p className="t-eyebrow font-semibold">
            <Link href="/rings" className="underline underline-offset-4">
              Rings
            </Link>
          </p>
          <h1 className="t-page mt-3">Engagement &amp; Wedding Rings</h1>
          <p className="mt-5 max-w-[58ch] t-copy">
            Fifteen bands, each shown here as a finished ring. Every one is made to order
            in Hatton Garden, and every part of it is yours to choose: the stone, the
            setting that holds it, the metal and the size. Pick the shape you like and
            change the rest. Not sure of the size? Read our{" "}
            <Link
              href="/ring-size-guide"
              className="text-sheet-ink underline underline-offset-4 transition hover:text-accent-deep"
            >
              ring size guide
            </Link>
            .
          </p>
        </section>

        <ScrollReveal>
          <section
            id="engagement-rings"
            className="scroll-mt-[var(--nav-h)] px-[52px] pb-14 max-md:px-6 max-md:pb-10"
          >
            <StyleGrid styles={styles} />
          </section>
        </ScrollReveal>

        {/* ---- ready to ship ------------------------------------------------
            A rail rather than a grid, and it is a teaser rather than the whole
            set: these are finished pieces we hold, which is a different offer
            from the styles above, and somebody who has just scrolled fifteen
            made to order rings is exactly the person who might rather have one
            this week. The full set has its own page.

            The wedding bands that were here have gone back to the catalogue.
            Every image we own is an engagement ring with a centre stone, so
            there was nothing honest to put on those cards, and a grid of
            hairline placeholders under a heading is worse than not raising the
            subject on a page that cannot yet illustrate it. */}
        {pieces.length > 0 && (
          <ScrollReveal>
            <section
              id="ready-to-ship"
              className="scroll-mt-[var(--nav-h)] border-t border-sheet-line py-12 max-md:py-9"
            >
              <div className="flex items-baseline justify-between gap-6 px-[52px] max-md:px-6">
                <div>
                  <h2 className="t-sub">Ready to Ship Rings</h2>
                  <p className="mt-2 max-w-[58ch] t-copy">
                    Finished pieces we hold rather than make to order, so they can be
                    sized and sent far sooner than a commission.
                  </p>
                </div>
                <Link
                  href="/rings/ready-to-ship"
                  className="t-eyebrow shrink-0 font-semibold whitespace-nowrap underline underline-offset-4 transition hover:text-accent-deep"
                >
                  See all
                </Link>
              </div>

              <CardRail label="Ready to ship rings">
                {pieces.map((piece) => (
                  <div key={piece.id} className={RAIL_ITEM}>
                    <ReadyToShipCard piece={piece} />
                  </div>
                ))}
              </CardRail>
            </section>
          </ScrollReveal>
        )}
        {/* ---- shapes ------------------------------------------------------
            The grid above sorts by band style; this sorts by stone. They are
            the two axes people actually shop on, and somebody who has just
            scrolled fifteen bands often knows the shape they want and not the
            shank. */}
        <ScrollReveal>
          <section className="border-t border-sheet-line px-[52px] py-14 max-md:px-6 max-md:py-10">
            <h2 className="t-sub">Or start from the diamond shape</h2>
            <p className="mt-3 max-w-[64ch] t-copy">
              Each of these covers what the shape changes — how it sparkles,
              what it hides, the length-to-width ratio to ask for, and how it
              has to be set to survive being worn.
            </p>
            <ul className="mt-8 grid grid-cols-3 gap-x-8 gap-y-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
              {SHAPE_GUIDES.map((g) => (
                <li key={g.slug} className="border-t border-sheet-line pt-3">
                  <Link
                    href={`/rings/${g.slug}`}
                    className="text-[15px] font-medium text-sheet-ink underline underline-offset-4 transition hover:text-accent-deep"
                  >
                    {g.h1}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </ScrollReveal>

        {/* ---- what actually happens ---------------------------------------
            The page was fifteen cards, five words each, and about 140 words of
            indexable copy — on the single most commercially important URL on
            the site, competing for "engagement rings hatton garden" against
            houses running three-hundred-page education hubs. Cards show what
            we make; this says how, what it costs in time, and answers the
            questions people ask before they will start a conversation. */}
        <ScrollReveal>
          <section className="border-t border-sheet-line px-[52px] py-14 max-md:px-6 max-md:py-10">
            <h2 className="t-sub">How a commission works</h2>
            <p className="mt-3 max-w-[64ch] t-copy">
              Every ring above is made from scratch once you have chosen it, at
              a bench in Hatton Garden. Nothing is cast until you have seen a
              design and agreed a price.
            </p>
            <ol className="mt-8 grid grid-cols-4 gap-8 max-lg:grid-cols-2 max-sm:grid-cols-1">
              {COMMISSION_STEPS.map((step, i) => (
                <li key={step.title} className="border-t border-sheet-line pt-4">
                  <span className="font-serif text-[20px] leading-none text-accent-deep">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-[15px] font-medium text-sheet-ink">
                    {step.title}
                  </h3>
                  <p className="mt-2 t-copy">{step.copy}</p>
                </li>
              ))}
            </ol>
          </section>
        </ScrollReveal>

        <section className="px-[52px] pb-14 max-md:px-6 max-md:pb-10">
          <SheetFaq
            items={ENGAGEMENT_FAQS}
            heading="What people ask before they commission a ring"
          />
        </section>
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            ldJsonGraph([
              breadcrumbLd([
                { name: "Home", url: siteUrl("/") },
                { name: "Rings", url: siteUrl("/rings") },
                { name: "Engagement & Wedding Rings", url: siteUrl(PATH) },
              ]),
              // Rendered by <SheetFaq> above — marking up an answer that is
              // not on the page is a policy breach, not a shortcut.
              faqLd(ENGAGEMENT_FAQS),
              ...collectionLd({
                name: "Engagement & Wedding Rings",
                description:
                  "Engagement ring styles made to order by Alpoe London in Hatton Garden, with wedding rings and bands to match.",
                path: PATH,
                // Names only. styleHref() is a query string on /ring-builder,
                // and every one of the fifteen canonicalises back to that same
                // page — so publishing them as fifteen distinct list URLs was
                // describing one page fifteen times. See collectionLd.
                products: styles.map((s) => ({ title: styleTitle(s) })),
              }),
            ]),
          ),
        }}
      />
    </>
  );
}
