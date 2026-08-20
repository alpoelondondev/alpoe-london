import type { Metadata } from "next";
import Image from "next/image";
import SiteHeader from "../../components/SiteHeader";
import Footer from "../../components/Footer";
import WhatsAppButton from "../../components/WhatsAppButton";
import Breadcrumbs from "../../components/Breadcrumbs";
import BrandHero from "../../components/BrandHero";
import ScrollReveal from "../../components/ScrollReveal";
import CTAStrip from "../../components/CTAStrip";
import FAQ from "../../components/FAQ";
import { DIAMOND_FAQS } from "@/lib/faqs";
import { pageMetadata, ldJsonGraph, faqLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

const PATH = "/guides/natural-vs-lab-grown-diamonds";

export const metadata: Metadata = pageMetadata({
  title: "Lab Grown vs Natural Diamonds: A Straight Answer",
  description:
    "Lab grown diamonds are real diamonds. What actually differs from a natural stone, what each costs, how they are graded, and how to choose. From the Alpoe London counter in Hatton Garden.",
  path: PATH,
  image: "/alpoe-lab-grown-vs-natural-diamond-comparison-chart.jpg",
});

/** The two growth methods, one line each. Anything longer is padding. */
const METHODS = [
  {
    n: "CVD",
    name: "Chemical Vapour Deposition",
    copy: "Carbon rich gas is broken down in a chamber and the carbon settles onto a seed, building the crystal layer by layer.",
  },
  {
    n: "HPHT",
    name: "High Pressure, High Temperature",
    copy: "Carbon is dissolved under heat and pressure that copy the conditions in the earth's mantle, then crystallises around a seed.",
  },
];

/** Their figures, as quoted. Same grades on both rows so the gap is the point. */
const PRICE_ROWS = [
  {
    diamond: "1ct Natural",
    cut: "Excellent",
    colour: "D",
    clarity: "VVS2",
    price: "£5,500 to £7,000",
  },
  {
    diamond: "1ct Lab",
    cut: "Excellent",
    colour: "D",
    clarity: "VVS2",
    price: "£1,100 to £1,500",
  },
];

/**
 * The decision, as facts rather than a recommendation. Split so the page can
 * set them side by side: what pushes you one way, what pushes you the other.
 */
const CHOOSE_LAB = [
  "Two to three times the carat weight for the same budget.",
  "Same cut, colour and clarity grades as natural, at the top end.",
  "Ready in weeks, so a bespoke build is not waiting on a stone.",
  "No conflict stone question to ask.",
  "Far less land disturbed than mining.",
];

const CHOOSE_NATURAL = [
  "Holds its resale position. Lab stones have no track record yet.",
  "Finite supply, which is what the price has always reflected.",
  "Billions of years in the ground, if origin matters to you.",
  "Well run mines are the income of the communities around them.",
];

/** Condensed from the comparison chart, for anyone who cannot see the image. */
const IDENTICAL = [
  ["Chemical composition", "Carbon"],
  ["Mohs hardness", "10"],
  ["Refractive index", "2.42"],
  ["Crystal structure", "Cubic"],
  ["Dispersion", "0.044"],
  ["Density", "3.52"],
];

export default function DiamondsGuidePage() {
  const ld = ldJsonGraph([
    {
      "@type": "Article",
      "@id": siteUrl(PATH) + "#article",
      headline: "Lab Grown vs Natural Diamonds",
      description:
        "What actually differs between a lab grown and a natural diamond, what each costs, and how to choose.",
      about: "Lab grown diamonds and natural diamonds",
      publisher: { "@id": siteUrl("/") + "#organization" },
      image: siteUrl("/alpoe-lab-grown-vs-natural-diamond-comparison-chart.jpg"),
      url: siteUrl(PATH),
    },
    // Breadcrumbs are emitted by the <Breadcrumbs> component this page
    // renders, which is the single source of truth for the trail. Building
    // a second BreadcrumbList here published two competing trails per
    // document — Google picks one arbitrarily, or neither.
    faqLd(DIAMOND_FAQS),
  ]);

  return (
    <>
      <SiteHeader />
      <main>
        <BrandHero
          eyebrow="Guide"
          title="Diamonds"
          copy="Lab grown or natural. Both are real diamonds, both sit on our counter, and the right one depends on what you want from the stone. Here is the whole thing without the sales pitch."
        />

        <section className="px-[52px] py-8 max-md:px-6">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Diamonds", href: PATH, current: true },
            ]}
          />
        </section>

        {/* The one thing most people came to ask. It gets its own band. */}
        <section className="px-[52px] pb-16 max-md:px-6">
          <ScrollReveal>
            <div className="max-w-3xl border-l-2 border-accent pl-8 max-md:pl-5">
              <h2 className="t-section">
                Are lab grown diamonds real diamonds?
              </h2>
              <p className="mt-5 t-copy">
                Yes. Chemically, structurally and optically the same as a stone pulled
                out of the ground. The only difference is where it was made. One took
                billions of years in the earth, the other took a few weeks in a
                laboratory. A lab diamond is not a fake diamond and it is not a
                simulant. It is diamond.
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* Comparison chart. The alt text and the table beside it carry the same
            information, since a chart is useless to a screen reader. */}
        <section className="px-[52px] pb-16 max-md:px-6">
          <ScrollReveal>
            <div className="grid grid-cols-12 gap-10 items-center max-md:grid-cols-1 max-md:gap-8">
              <div className="col-span-7 relative aspect-[1195/896] w-full overflow-hidden border border-fg/[0.10] bg-white">
                <Image
                  src="/alpoe-lab-grown-vs-natural-diamond-comparison-chart.jpg"
                  alt="Comparison chart showing lab grown and natural diamonds share the same chemical composition, hardness, refractive index, crystal structure, dispersion and density"
                  fill
                  sizes="(max-width: 768px) 100vw, 58vw"
                  className="object-contain"
                  priority
                />
              </div>
              <div className="col-span-5">
                <p className="text-[11px] tracking-[0.2em] uppercase text-accent">
                  Measured side by side
                </p>
                <h2 className="t-section mt-4">
                  Every property that matters is identical
                </h2>
                <dl className="mt-6 border-t border-fg/[0.14]">
                  {IDENTICAL.map(([property, value]) => (
                    <div
                      key={property}
                      className="flex items-baseline justify-between gap-4 border-b border-fg/[0.10] py-3"
                    >
                      <dt className="text-[13px] text-dim">{property}</dt>
                      <dd className="font-serif text-[15px] tracking-[0.02em]">{value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="mt-5 t-copy">
                  Telling them apart takes laboratory equipment. Specialists look for
                  nitrogen: natural stones pick up traces of it as they form, lab stones
                  contain none.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* How they are made. Two methods, no more detail than a buyer needs. */}
        <section className="bg-panel-soft px-[52px] py-16 max-md:px-6 max-md:py-12">
          <ScrollReveal>
            <h2 className="t-section">
              How a lab diamond is grown
            </h2>
            <p className="mt-4 max-w-2xl t-copy">
              Two methods, both a few weeks from seed to rough. Both produce stones that
              are chemically and optically identical to natural.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-6 max-md:grid-cols-1">
              {METHODS.map((m) => (
                <div
                  key={m.n}
                  className="border border-fg/[0.10] bg-fg/[0.04] p-6"
                >
                  <p className="font-serif text-[26px] leading-none text-accent">{m.n}</p>
                  <h3 className="t-sub mt-3">
                    {m.name}
                  </h3>
                  <p className="mt-3 t-copy">{m.copy}</p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>

        {/* Price. The single biggest reason anyone picks lab. */}
        <section className="px-[52px] py-16 max-md:px-6 max-md:py-12">
          <ScrollReveal>
            <h2 className="t-section">
              What each one costs
            </h2>
            <p className="mt-4 max-w-2xl t-copy">
              A lab diamond runs 60% to 85% below a natural stone of the same carat and
              the same grades. Not because it is a lesser stone, but because it can be
              made to order and a mine cannot.
            </p>

            {/* Scrolls inside its own box on a phone rather than pushing the page. */}
            <div className="mt-8 overflow-x-auto border border-fg/[0.14]">
              <table className="w-full min-w-[560px] border-collapse text-left">
                <caption className="sr-only">
                  Typical price of a 1ct natural diamond compared with a 1ct lab grown
                  diamond at the same cut, colour and clarity
                </caption>
                <thead>
                  <tr className="bg-fg/[0.06]">
                    {["Diamond", "Cut", "Colour", "Clarity", "Price"].map((h) => (
                      <th
                        key={h}
                        scope="col"
                        className="px-5 py-4 text-[10px] font-medium tracking-[0.18em] uppercase text-accent"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PRICE_ROWS.map((r) => (
                    <tr key={r.diamond} className="border-t border-fg/[0.10]">
                      <th
                        scope="row"
                        className="px-5 py-5 font-serif text-[17px] tracking-[0.02em] font-normal"
                      >
                        {r.diamond}
                      </th>
                      <td className="px-5 py-5 text-[14px] text-dim">{r.cut}</td>
                      <td className="px-5 py-5 text-[14px] text-dim">{r.colour}</td>
                      <td className="px-5 py-5 text-[14px] text-dim">{r.clarity}</td>
                      <td className="px-5 py-5 font-serif text-[17px] tracking-[0.02em]">
                        {r.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-[12px] text-dim">
              Guide prices for loose stones. Market rates move, so we quote on the day.
            </p>
          </ScrollReveal>
        </section>

        {/* The decision, as two columns of facts rather than a recommendation. */}
        <section className="bg-panel-soft px-[52px] py-16 max-md:px-6 max-md:py-12">
          <ScrollReveal>
            <h2 className="t-section">
              So which one should you pick?
            </h2>
            <p className="mt-4 max-w-2xl t-copy">
              We sell both and we are not going to push you either way. These are the
              facts. The rest is what you want from the stone.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-6 max-md:grid-cols-1">
              {[
                { title: "Go lab if", points: CHOOSE_LAB },
                { title: "Go natural if", points: CHOOSE_NATURAL },
              ].map((col) => (
                <div key={col.title} className="border border-fg/[0.10] bg-fg/[0.04] p-7">
                  <h3 className="t-sub">
                    {col.title}
                  </h3>
                  <ul className="mt-5 flex flex-col gap-3">
                    {col.points.map((p) => (
                      <li key={p} className="flex gap-3 t-copy">
                        <span aria-hidden="true" className="text-accent shrink-0">
                          &bull;
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </section>

        <FAQ items={DIAMOND_FAQS} />

        <CTAStrip
          eyebrow="Still deciding?"
          title="What diamond shall I pick?"
          copy="Tell us the budget and what it is for. We will come back with the two options, lab and natural, and what each gets you."
          whatsappMessage="Hi Alpoe, what diamond shall I pick?"
          primaryLabel="Ask on WhatsApp"
          secondary={{ label: "Start a Bespoke Piece", href: "/bespoke" }}
        />
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
