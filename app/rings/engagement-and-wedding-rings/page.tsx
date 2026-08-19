import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import Footer from "../../components/Footer";
import ScrollReveal from "../../components/ScrollReveal";
import { ProductRingCard, StyleGrid } from "../RingCards";
import { getJewelleryByCategory, photosFirst, productUrl } from "@/lib/products";
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
  const bands = getJewelleryByCategory("wedding-rings").sort(photosFirst);
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

        {/* ---- wedding bands ------------------------------------------------
            Below the styles rather than on a page of their own, because a
            wedding band is bought against an engagement ring and has to be
            shaped to it. These are stocked products with prices, so the cards
            go to their own pages: everything above is configured, everything
            here is bought. */}
        {bands.length > 0 && (
          <ScrollReveal>
            <section
              id="wedding-rings"
              className="scroll-mt-[var(--nav-h)] border-t border-sheet-line px-[52px] py-12 max-md:px-6 max-md:py-9"
            >
              <div className="flex items-baseline justify-between gap-6">
                <div>
                  <h2 className="t-sub">Wedding Rings &amp; Bands</h2>
                  <p className="mt-2 max-w-[58ch] t-copy">
                    Court and D-shape profiles, plain and diamond set, in platinum and
                    18ct gold. A band has to sit flush against the ring it is worn with,
                    so bring the engagement ring in and we will fit it.
                  </p>
                </div>
                <Link
                  href="/jewellery/wedding-rings"
                  className="t-eyebrow shrink-0 font-semibold whitespace-nowrap underline underline-offset-4 transition hover:text-accent-deep"
                >
                  See all
                </Link>
              </div>

              <ul className="mt-8 grid grid-cols-3 gap-x-8 gap-y-10 max-lg:grid-cols-2 max-md:gap-x-4 max-md:gap-y-8">
                {bands.map((p) => (
                  <li key={p.slug}>
                    <ProductRingCard product={p} />
                  </li>
                ))}
              </ul>
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
                products: [
                  ...styles.map((s) => ({ title: styleTitle(s), url: styleHref(s) })),
                  ...bands.map((p) => ({ title: p.title, url: productUrl(p) })),
                ],
              }),
            ]),
          ),
        }}
      />
    </>
  );
}
