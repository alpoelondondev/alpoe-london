import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import Breadcrumbs from "../components/Breadcrumbs";
import BrandHero from "../components/BrandHero";
import ScrollReveal from "../components/ScrollReveal";
import FAQ from "../components/FAQ";
import { pageMetadata, ldJsonGraph, faqLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

const PATH = "/hallmarking";

/**
 * The Dealer's Notice, and what a hallmark actually certifies.
 *
 * This page is a legal obligation rather than a marketing decision. Section
 * 11(1) of the Hallmarking Act 1973 requires every dealer to exhibit the
 * British Hallmarking Council's notice conspicuously on their premises, and the
 * BHC's published position is that for an online seller the website *is* the
 * premises: "the website should display the prescribed dealers' notice in a
 * prominent position." The NAJ is more specific still — where customers can buy
 * online, the notice must be visible before checkout.
 *
 * Hence a page linked from the global footer and from the ring builder.
 *
 * Note what this page is careful NOT to do: it does not paraphrase, restyle or
 * redraw the notice. Dealers Notice B has to be reproduced in its entirety with
 * no amendments, additions or deletions — recolouring it to the Alpoe palette
 * would itself be a breach. So the official artwork is embedded as-is and
 * everything around it is our own words.
 */

export const metadata: Metadata = pageMetadata({
  title: "UK Gold & Silver Hallmarks Explained",
  description:
    "How to read a UK hallmark: what 375, 585, 750, 916 and 925 mean, the sponsor's mark, the assay office town marks and the date letter. From Hatton Garden.",
  path: PATH,
});

const MARKS = [
  {
    title: "The sponsor's mark",
    copy: "Whose piece it is — the registered mark of the company that put the article on the market. Ours is registered with the London Assay Office.",
  },
  {
    title: "The fineness mark",
    copy: "How much precious metal is in it, in parts per thousand. 750 is 18ct gold, 375 is 9ct, 950 is platinum. The shape around the number tells you which metal it is.",
  },
  {
    title: "The assay office mark",
    copy: "Who tested it. A leopard's head is London, an anchor Birmingham, a rose Sheffield, a castle Edinburgh.",
  },
];

const FINENESS = [
  { metal: "Gold", standards: "375 (9ct) · 585 (14ct) · 750 (18ct) · 916 (22ct) · 990 · 999" },
  { metal: "Silver", standards: "800 · 925 (Sterling) · 958 (Britannia) · 999" },
  { metal: "Platinum", standards: "850 · 900 · 950 · 999" },
  { metal: "Palladium", standards: "500 · 950 · 999" },
];

/**
 * Fineness in parts per thousand, which is what the number on a hallmark
 * literally is. Written out because "what does 750 mean on a ring" is a real
 * question people arrive with, and the page previously answered it only
 * obliquely, inside a table of legal standards.
 */
const NUMBERS = [
  { mark: "375", means: "9 carat gold — 375 parts gold per thousand" },
  { mark: "585", means: "14 carat gold" },
  { mark: "750", means: "18 carat gold — what most engagement rings are" },
  { mark: "916", means: "22 carat gold" },
  { mark: "925", means: "Sterling silver" },
  { mark: "958", means: "Britannia silver" },
  { mark: "950", means: "Platinum, the usual jewellery standard — or palladium" },
  { mark: "999", means: "Fine gold or fine silver, effectively pure" },
];

/** The four UK assay offices still striking marks, and their symbols. */
const TOWNS = [
  { office: "London", mark: "A leopard's head" },
  { office: "Birmingham", mark: "An anchor" },
  { office: "Sheffield", mark: "A rose" },
  { office: "Edinburgh", mark: "A three-towered castle" },
];

const HALLMARK_FAQS = [
  {
    question: "What does 750 mean on a ring?",
    answer:
      "750 parts of gold per thousand, which is 18 carat. The number on a British hallmark is always fineness in parts per thousand rather than carats, so 375 is 9 carat, 585 is 14 carat, 750 is 18 carat and 916 is 22 carat. On silver, 925 is sterling.",
  },
  {
    question: "Does all gold jewellery have to be hallmarked in the UK?",
    answer:
      "Anything sold as gold must be, above one gram. The exemption weights are 1g for gold and palladium, 0.5g for platinum and 7.78g for silver — and no engagement ring comes near them, since a plain platinum shank alone is several times the platinum threshold. Below those weights an article may be sold unmarked; above them it is an offence.",
  },
  {
    question: "What are the four UK assay office marks?",
    answer:
      "A leopard's head for London, an anchor for Birmingham, a rose for Sheffield and a three-towered castle for Edinburgh. Those are the four offices still operating. A mark matching none of them is likely from a closed office such as Chester, Exeter, Newcastle, Glasgow or Dublin, which dates the piece before that office shut.",
  },
  {
    question: "Where is the London Assay Office?",
    answer:
      "Its main office is at Goldsmiths' Hall, Gutter Lane, London EC2V 8AQ, and it keeps a counter at 17 Greville Street, London EC1N 8SQ — inside Hatton Garden. Consignments are posted to Goldsmiths' Hall rather than Greville Street. Having the counter in the jewellery quarter is why hallmarking a piece made here is a walk rather than a wait.",
  },
  {
    question: "Is a hallmark the same as a diamond certificate?",
    answer:
      "No, and the two are often confused. A hallmark is an independent test of the metal only — it says nothing whatsoever about the stone. A diamond's cut, colour, clarity and carat come from a separate grading report, usually GIA for a natural stone and IGI for most laboratory-grown ones.",
  },
  {
    question: "Can a hallmarked ring be resized?",
    answer:
      "Usually, but it is regulated. Adding metal to size a ring up is permitted within set limits; removing metal to size it down counts as an alteration, and an improperly repaired article is treated in law as though it had never been hallmarked at all. We put resizes through the London Assay Office as a matter of course.",
  },
];

export default function HallmarkingPage() {
  return (
    <>
      <SiteHeader />

      <main>
        <BrandHero
          eyebrow="Hallmarking"
          title="Look for the hallmark"
          copy="A hallmark is the oldest form of consumer protection in Britain — an independent test, struck into the metal, that the piece is what it is sold as. Every precious metal article we make is hallmarked before it reaches you."
        />

        <section className="px-[52px] py-8 max-md:px-6">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Guides", href: "/guides" },
              { name: "Hallmarking", href: PATH },
            ]}
          />
        </section>

        {/* ---- the statutory notice ---------------------------------------
            This block is the actual legal requirement. Everything else on the
            page is context around it. */}
        <ScrollReveal>
          <section className="px-[52px] pb-16 max-md:px-6">
            <div className="border border-fg/[0.12] bg-sheet-panel p-10 max-md:p-6">
              <p className="text-[11px] tracking-[0.2em] uppercase text-sheet-dim">
                Dealer&rsquo;s Notice
              </p>
              <h2 className="t-section t-ink mt-4">
                Look for the Hallmark — it&rsquo;s your guarantee
              </h2>

              <p className="t-copy mt-6 max-w-[62ch] !text-sheet-ink/80">
                In the UK it is illegal to supply or offer to supply any item as gold,
                silver, platinum or palladium unless it is hallmarked. Exemption weights
                apply: 7.78g silver, 1g gold and palladium, 0.5g platinum.
              </p>

              <dl className="mt-8 grid grid-cols-3 gap-8 max-md:grid-cols-1 max-md:gap-6">
                {MARKS.map((m) => (
                  <div key={m.title}>
                    <dt className="font-serif text-[18px] text-sheet-ink">{m.title}</dt>
                    <dd className="t-copy mt-2 !text-sheet-dim">
                      {m.copy}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="t-copy mt-8 border-t border-sheet-line pt-6 !text-sheet-dim">
                International hallmarks must contain the scales of the Common Control
                Mark. Displayed in accordance with the Hallmarking Act 1973.{" "}
                <a
                  href="https://www.assayofficelondon.co.uk/media/2943/dealers_notice_b-221021.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-deep underline underline-offset-4"
                >
                  Read the full Dealer&rsquo;s Notice
                </a>{" "}
                (British Hallmarking Council).
              </p>
            </div>
          </section>
        </ScrollReveal>

        {/* ---- what it does and does not cover --------------------------- */}
        <ScrollReveal>
          <section className="border-t border-fg/[0.10] px-[52px] py-20 max-md:px-6 max-md:py-14">
            <h2 className="t-section">
              What a hallmark certifies — and what it doesn&rsquo;t
            </h2>

            <div className="mt-10 grid grid-cols-2 gap-12 max-lg:grid-cols-1 max-lg:gap-8">
              <div>
                <p className="text-[11px] tracking-[0.2em] uppercase text-accent">
                  It certifies the metal
                </p>
                <p className="mt-4 max-w-[52ch] t-copy">
                  An assay office independently tests the article and strikes the marks
                  itself. That is a guarantee of fineness — that your 18ct ring really is
                  750 parts per thousand gold, tested rather than asserted.
                </p>
              </div>
              <div>
                <p className="text-[11px] tracking-[0.2em] uppercase text-accent">
                  It says nothing about the stone
                </p>
                <p className="mt-4 max-w-[52ch] t-copy">
                  A hallmark is not a diamond certificate and the two are often confused.
                  Your diamond&rsquo;s cut, colour, clarity and origin come from its
                  grading report — GIA for natural stones, IGI for most
                  laboratory-grown ones — which is a separate document entirely.
                </p>
              </div>
            </div>

            <div className="mt-14">
              <p className="text-[11px] tracking-[0.2em] uppercase text-accent">
                Legal fineness standards
              </p>
              <dl className="mt-6 max-w-3xl divide-y divide-fg/[0.08] border-t border-fg/[0.08]">
                {FINENESS.map((f) => (
                  <div key={f.metal} className="flex gap-8 py-3 text-[14px] max-sm:flex-col max-sm:gap-1">
                    <dt className="w-28 shrink-0 text-dim">{f.metal}</dt>
                    <dd className="text-fg/85">{f.standards}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 max-w-[62ch] t-copy">
                No engagement ring is ever light enough to fall under an exemption weight
                — a plain platinum shank alone is several times the 0.5g threshold — so
                every ring we make is hallmarked, without exception.
              </p>
            </div>
          </section>
        </ScrollReveal>

        {/* ---- reading the marks -----------------------------------------
            The page explained what a hallmark is for and never explained how
            to read one — which is the whole of what people search for.
            "gold hallmarks uk", "925 hallmark meaning", "gold hallmark
            identification chart" and "what is a hallmark on jewelry" are all
            live queries, and every one of them is somebody holding a piece and
            squinting at three tiny marks. */}
        <ScrollReveal>
          <section className="border-t border-fg/[0.10] px-[52px] py-20 max-md:px-6 max-md:py-14">
            <h2 className="t-section">How to read the marks on your own jewellery</h2>
            <p className="mt-4 max-w-[62ch] t-copy">
              Find them inside the shank of a ring, on the clasp or the tag of a
              chain, or on the case back of a British-cased watch. Under a loupe
              there are three compulsory marks, sometimes with two more beside
              them. Read left to right.
            </p>

            <div className="mt-10">
              <p className="text-[11px] tracking-[0.2em] uppercase text-accent">
                The number — what the metal is
              </p>
              <dl className="mt-6 max-w-3xl divide-y divide-fg/[0.08] border-t border-fg/[0.08]">
                {NUMBERS.map((n) => (
                  <div
                    key={n.mark}
                    className="flex gap-8 py-3 text-[14px] max-sm:flex-col max-sm:gap-1"
                  >
                    <dt className="w-28 shrink-0 tabular-nums text-accent">{n.mark}</dt>
                    <dd className="text-fg/85">{n.means}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 max-w-[62ch] t-copy">
                The shape of the shield around the number tells you which metal
                it is before you have read the number at all: gold sits in a
                rectangle with clipped corners, silver in an oval, platinum in a
                shape like a house on its side, palladium in three joined
                circles.
              </p>
            </div>

            <div className="mt-14">
              <p className="text-[11px] tracking-[0.2em] uppercase text-accent">
                The town mark — where it was tested
              </p>
              <dl className="mt-6 max-w-3xl divide-y divide-fg/[0.08] border-t border-fg/[0.08]">
                {TOWNS.map((t) => (
                  <div
                    key={t.office}
                    className="flex gap-8 py-3 text-[14px] max-sm:flex-col max-sm:gap-1"
                  >
                    <dt className="w-28 shrink-0 text-dim">{t.office}</dt>
                    <dd className="text-fg/85">{t.mark}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 max-w-[62ch] t-copy">
                Those four are the offices still operating. A mark you cannot
                match to any of them may be from an office long closed —
                Chester, Exeter, Newcastle, Glasgow, Dublin — which usually
                means the piece is older than the office&rsquo;s closing date,
                and that is often the most interesting thing about it.
              </p>
            </div>

            <div className="mt-14">
              <p className="text-[11px] tracking-[0.2em] uppercase text-accent">
                The letter — when it was tested
              </p>
              <p className="mt-4 max-w-[62ch] t-copy">
                The date letter is optional now and has been since 1998, but it
                was compulsory for centuries and it is on almost anything old.
                One letter per year, the typeface and the shield around it
                changing each time the alphabet restarts, which is what makes a
                letter datable rather than merely a letter. Bring a piece in and
                we will read it with you.
              </p>
            </div>
          </section>
        </ScrollReveal>

        {/* ---- the office is round the corner ---------------------------- */}
        <ScrollReveal>
          <section className="border-t border-fg/[0.10] bg-panel-soft px-[52px] py-20 max-md:px-6 max-md:py-14">
            <h2 className="t-section">The Assay Office is in Hatton Garden</h2>
            <p className="mt-4 max-w-[62ch] t-copy">
              The London Assay Office keeps a counter at 17 Greville Street,
              London EC1N 8SQ — which is Hatton Garden, a few minutes&rsquo; walk
              from the bench a piece is made on. Its main office and the address
              everything is posted to is Goldsmiths&rsquo; Hall on Gutter Lane
              in the City, but the Greville Street counter is why this quarter
              works the way it does: a ring can be finished, walked round,
              tested, marked and walked back inside a morning.
            </p>
            <p className="mt-4 max-w-[62ch] t-copy">
              It is also why a hallmark from a Hatton Garden workshop is rarely
              a delay. When a jeweller tells you hallmarking will add weeks to a
              commission, they are usually telling you their bench is a long way
              from an assay office.
            </p>
          </section>
        </ScrollReveal>

        {/* ---- resizing ---------------------------------------------------- */}
        <ScrollReveal>
          <section className="border-t border-fg/[0.10] px-[52px] py-20 max-md:px-6 max-md:py-14">
            <h2 className="t-section">
              Resizing and repair
            </h2>
            <p className="mt-4 max-w-[62ch] t-copy">
              Altering a hallmarked article is regulated too. Adding a little metal to
              size a ring up is permitted within set limits; removing metal to size it
              down is an alteration, and an improperly repaired article is treated in law
              as though it were unhallmarked. We handle this through the London Assay
              Office as a matter of course — but it is the reason a resize is a
              conversation with the workshop rather than something to be done on a high
              street in twenty minutes.
            </p>
          </section>
        </ScrollReveal>
        <FAQ items={HALLMARK_FAQS} />
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            ldJsonGraph([
              // Breadcrumbs are emitted by the <Breadcrumbs> component this
              // page renders, which is the single source of truth for the
              // trail. Building a second BreadcrumbList here published two
              // competing trails per document — Google picks one arbitrarily,
              // or neither. Removing it left this graph empty, which is how a
              // reference page this substantial came to publish no structured
              // data at all.
              {
                "@type": "Article",
                "@id": siteUrl(PATH) + "#article",
                headline: "UK Gold and Silver Hallmarks Explained",
                description:
                  "How to read a British hallmark: the fineness numbers, the four assay office town marks, the date letter, and what a hallmark does and does not certify.",
                about: [
                  { "@type": "Thing", name: "Hallmarking" },
                  { "@type": "Thing", name: "Assay office" },
                  { "@type": "Thing", name: "Precious metal fineness" },
                ],
                author: { "@id": siteUrl("/") + "#organization" },
                publisher: { "@id": siteUrl("/") + "#organization" },
                inLanguage: "en-GB",
                isPartOf: { "@id": siteUrl("/") + "#website" },
                mainEntityOfPage: { "@type": "WebPage", "@id": siteUrl(PATH) },
                url: siteUrl(PATH),
              },
              // Every one of these is rendered above by <FAQ>.
              faqLd(HALLMARK_FAQS),
            ]),
          ),
        }}
      />
    </>
  );
}
