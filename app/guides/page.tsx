import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import Breadcrumbs from "../components/Breadcrumbs";
import BrandHero from "../components/BrandHero";
import ScrollReveal from "../components/ScrollReveal";
import SheetFaq from "../components/SheetFaq";
import { pageMetadata, ldJsonGraph, collectionLd, faqLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

const PATH = "/guides";

/**
 * The guides index that did not exist.
 *
 * Every jeweller of any size in this market runs an education hub — Queensmith
 * has two, Purely Diamonds has a hundred pages of one, Regal runs six separate
 * channels. Alpoe had one genuinely good guide, at /guides/natural-vs-lab-
 * grown-diamonds, with exactly one crawlable link pointing at it from the whole
 * site and no index above it. So the strongest writing on the site sat at the
 * end of a cul-de-sac.
 *
 * A hub fixes three things at once. It gives the guides a parent for the
 * breadcrumb trail they were already claiming, it gives every guide a second
 * and third inbound link from a page that itself sits one click off the
 * footer, and it gives /guides/* somewhere to grow: the shape pages, the
 * wedding-band-for-X cluster and the lab-grown sub-guides all belong under
 * here rather than scattered at the root.
 *
 * The reference pages that live elsewhere (/ring-size-guide, /hallmarking,
 * /metal-prices) are listed too. They are guides in everything but URL, and
 * moving them would break links that already exist for the sake of tidiness.
 */

export const metadata: Metadata = pageMetadata({
  title: "Diamond & Jewellery Guides",
  description:
    "Straight answers from a Hatton Garden bench: lab grown vs natural diamonds, UK ring sizes, what a hallmark certifies and live precious metal prices.",
  path: PATH,
  image: "/og/lab-grown.jpg",
});

type Guide = {
  href: string;
  title: string;
  /** Answer-first: the question this page settles, and its answer. */
  blurb: string;
  kicker: string;
};

const GUIDES: Guide[] = [
  {
    href: "/guides/buying-jewellery-in-hatton-garden",
    title: "Buying jewellery in Hatton Garden",
    kicker: "The quarter",
    blurb:
      "Whether it is really cheaper and why, when it is not, how three hundred jewellers came to share a few streets, and the four things to ask before you hand over a card.",
  },
  {
    href: "/guides/natural-vs-lab-grown-diamonds",
    title: "Lab-grown vs natural diamonds",
    kicker: "Diamonds",
    blurb:
      "A lab-grown diamond is a real diamond — same carbon, same hardness, same sparkle, and the same grading laboratories. What differs is price, rarity and how each holds its value. The whole comparison, without the sales pitch.",
  },
  {
    href: "/ring-size-guide",
    title: "Ring size guide and UK size chart",
    kicker: "Sizing",
    blurb:
      "The full UK chart from A to Z in millimetres, three ways to measure accurately at home, the average UK sizes for men and women, and four ways to find someone's size without asking them.",
  },
  {
    href: "/hallmarking",
    title: "What a British hallmark certifies",
    kicker: "Assay",
    blurb:
      "The sponsor's mark, the fineness mark and the assay office mark, and what each one independently proves about the metal in your ring. Plus the statutory Dealer's Notice.",
  },
  {
    href: "/metal-prices",
    title: "Live gold, silver and platinum prices",
    kicker: "Reference",
    blurb:
      "Spot prices in GBP and USD per troy ounce and per gram, with the carat breakdowns that actually apply to jewellery — 9ct, 14ct, 18ct and 22ct.",
  },
];

/** Tools rather than reading — listed apart so the hub does not blur the two. */
const TOOLS = [
  {
    href: "/ring-builder",
    title: "Ring builder",
    blurb: "Specify a ring yourself — shape, setting, band, metal and size.",
  },
  {
    href: "/rings/engagement-and-wedding-rings",
    title: "Engagement ring styles",
    blurb: "Fifteen finished styles to start a commission from.",
  },
  {
    href: "/book-appointment",
    title: "Book an appointment",
    blurb: "See stones side by side in Hatton Garden before you decide.",
  },
];

const GUIDE_FAQS = [
  {
    question: "Are lab-grown diamonds real diamonds?",
    answer:
      "Yes. A lab-grown diamond is chemically, physically and optically identical to a mined one — the same crystalline carbon, the same 10 on the Mohs scale, the same refractive index. It is graded by the same laboratories against the same four Cs. The difference is how it was formed, and what that does to the price.",
  },
  {
    question: "What is the average ring size in the UK?",
    answer:
      "Around a UK size L for women and a UK size T for men, though both spread widely — most women fall between G and T. Those are starting points for a guess rather than a substitute for measuring, and our ring size guide sets out how to measure properly.",
  },
  {
    question: "Does every piece of gold jewellery have to be hallmarked in the UK?",
    answer:
      "Any gold article over one gram sold in the UK must carry a British hallmark, and the thresholds are 7.78g for silver, 0.5g for platinum and 1g for palladium. We hallmark at the London Assay Office, whose counter is on Greville Street in Hatton Garden — a few minutes from the bench the piece was made on.",
  },
  {
    question: "How long does a bespoke ring take to make?",
    answer:
      "Around four to six weeks from an approved CAD design: casting, setting, finishing and hallmarking all happen inside that window. If you are working to a date, say so at the start and we will tell you honestly whether it can be met.",
  },
];

export default function GuidesPage() {
  const ld = ldJsonGraph([
    ...collectionLd({
      name: "Diamond and jewellery guides",
      description:
        "Reference guides from Alpoe London in Hatton Garden — diamonds, ring sizing, hallmarking and metal prices.",
      path: PATH,
      products: GUIDES.map((g) => ({ title: g.title, url: g.href })),
    }),
    faqLd(GUIDE_FAQS),
  ]);

  return (
    <>
      <SiteHeader />
      <main>
        <BrandHero
          eyebrow="Guides"
          title="Diamond & Jewellery Guides"
          copy="What we would tell you across the counter, written down. No hedging, no upsell — the numbers, the trade-offs and the answer."
        />

        <section className="px-[52px] py-8 max-md:px-6">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Guides", href: PATH, current: true },
            ]}
          />
        </section>

        <section className="px-[52px] pb-16 max-md:px-6">
          <ul className="grid grid-cols-2 gap-px bg-fg/[0.10] max-md:grid-cols-1">
            {GUIDES.map((g) => (
              <li key={g.href} className="bg-bg">
                <ScrollReveal>
                  <Link
                    href={g.href}
                    className="group flex h-full flex-col p-9 transition-colors hover:bg-fg/[0.04] max-md:p-7"
                  >
                    <span className="text-[10px] uppercase tracking-[0.18em] text-accent">
                      {g.kicker}
                    </span>
                    <h2 className="mt-3 font-serif text-[24px] leading-tight text-blush">
                      {g.title}
                    </h2>
                    <p className="mt-4 t-copy">{g.blurb}</p>
                    <span className="mt-6 text-[11px] uppercase tracking-[0.16em] text-accent opacity-70 transition-opacity group-hover:opacity-100">
                      Read the guide →
                    </span>
                  </Link>
                </ScrollReveal>
              </li>
            ))}
          </ul>
        </section>

        <section className="border-t border-fg/10 px-[52px] py-14 max-md:px-6 max-md:py-10">
          <ScrollReveal>
            <h2 className="t-section">Rather than read</h2>
            <ul className="mt-8 grid grid-cols-3 gap-8 max-md:grid-cols-1">
              {TOOLS.map((t) => (
                <li key={t.href} className="border-t border-accent/40 pt-4">
                  <h3 className="font-serif text-[19px] leading-tight text-blush">
                    <Link href={t.href} className="transition-colors hover:text-accent">
                      {t.title}
                    </Link>
                  </h3>
                  <p className="mt-2 t-copy">{t.blurb}</p>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </section>

        {/*
          Answer-first and unhedged on purpose. A definitional opening — "a
          lab-grown diamond is…" — is the single most extractable shape of
          sentence there is, and hedged prose is the least. Every one of these
          answers is also stated at length on the page it points at.
        */}
        <section className="on-sheet bg-white px-[52px] py-14 max-md:px-6 max-md:py-10">
          <SheetFaq items={GUIDE_FAQS} heading="The four questions we are asked most" />
        </section>
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
