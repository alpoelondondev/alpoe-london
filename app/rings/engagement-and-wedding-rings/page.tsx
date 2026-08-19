import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import Footer from "../../components/Footer";
import ScrollReveal from "../../components/ScrollReveal";
import { CardRail, RAIL_ITEM, ReadyToShipCard, StyleGrid } from "../RingCards";
import { collectionPieces } from "@/lib/rings/collection";
import { ringStyles, styleHref, styleTitle } from "@/lib/rings/styles";
import { rendersOrigin } from "@/lib/ring/renders";
import { pageMetadata, ldJsonGraph, breadcrumbLd, collectionLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

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
});

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
            className="scroll-mt-8 px-[52px] pb-14 max-md:px-6 max-md:pb-10"
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
              className="scroll-mt-8 border-t border-sheet-line py-12 max-md:py-9"
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
              ...collectionLd({
                name: "Engagement & Wedding Rings",
                description:
                  "Engagement ring styles made to order by Alpoe London in Hatton Garden, with wedding rings and bands to match.",
                path: PATH,
                products: styles.map((s) => ({ title: styleTitle(s), url: styleHref(s) })),
              }),
            ]),
          ),
        }}
      />
    </>
  );
}
