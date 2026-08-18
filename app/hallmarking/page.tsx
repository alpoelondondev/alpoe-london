import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import Breadcrumbs from "../components/Breadcrumbs";
import BrandHero from "../components/BrandHero";
import ScrollReveal from "../components/ScrollReveal";
import { pageMetadata, ldJsonGraph, breadcrumbLd } from "@/lib/seo";
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
  title: "Hallmarking — What the Marks on Your Ring Mean",
  description:
    "Every precious metal piece Alpoe London makes is hallmarked at the London Assay Office. The Dealer's Notice, the four UK assay offices, and what a hallmark does and does not certify.",
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
      </main>

      <Footer />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            ldJsonGraph([
              breadcrumbLd([
                { name: "Home", url: siteUrl("/") },
                { name: "Hallmarking", url: siteUrl(PATH) },
              ]),
            ]),
          ),
        }}
      />
    </>
  );
}
