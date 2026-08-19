import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import Footer from "../../components/Footer";
import ScrollReveal from "../../components/ScrollReveal";
import { ProductRingCard } from "../RingCards";
import { getJewelleryByCategory, photosFirst, productUrl } from "@/lib/products";
import { pageMetadata, ldJsonGraph, breadcrumbLd, collectionLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

const PATH = "/rings/wedding-rings";

/**
 * Reads the catalogue rather than holding its own list. These are stocked
 * products with prices and product pages, so this page is a way in, not a
 * second copy of them: /jewellery/wedding-rings remains the category, and the
 * cards link to the individual pieces.
 */
export const metadata: Metadata = pageMetadata({
  title: "Wedding Rings & Bands, Hatton Garden",
  description:
    "Wedding rings and bands in platinum, 18ct white, yellow and rose gold. Court and D-shape profiles, plain and diamond set, shaped to sit against an engagement ring.",
  path: PATH,
});

export default function WeddingRingsPage() {
  const bands = getJewelleryByCategory("wedding-rings").sort(photosFirst);

  return (
    <>
      <SiteHeader />

      <main className="on-sheet bg-white">
        <section className="clears-nav px-[52px] pb-8 max-md:px-6 max-md:pb-6">
          <p className="t-eyebrow font-semibold">
            <Link href="/rings" className="underline underline-offset-4">
              Rings
            </Link>
          </p>
          <h1 className="t-page mt-3">Wedding Rings &amp; Bands</h1>
          <p className="mt-5 max-w-[58ch] t-copy">
            Court and D-shape profiles, plain and diamond set, in platinum and 18ct
            white, yellow and rose gold. A wedding band has to sit flush against the
            engagement ring it is worn with, so bring the engagement ring in and we will
            fit the band to it. Sizes follow our{" "}
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
          <section className="px-[52px] pb-16 max-md:px-6 max-md:pb-12">
            {bands.length > 0 ? (
              <ul className="grid grid-cols-3 gap-x-8 gap-y-12 max-lg:grid-cols-2 max-md:gap-x-4 max-md:gap-y-8">
                {bands.map((p) => (
                  <li key={p.slug}>
                    <ProductRingCard product={p} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="t-copy">
                Our wedding bands are shown in the{" "}
                <Link
                  href="/jewellery/wedding-rings"
                  className="text-sheet-ink underline underline-offset-4"
                >
                  jewellery catalogue
                </Link>
                .
              </p>
            )}
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
                { name: "Rings", url: siteUrl("/rings") },
                { name: "Wedding Rings & Bands", url: siteUrl(PATH) },
              ]),
              ...collectionLd({
                name: "Wedding Rings & Bands",
                description: "Wedding rings and bands from Alpoe London, Hatton Garden.",
                path: PATH,
                products: bands.map((p) => ({ title: p.title, url: productUrl(p) })),
              }),
            ]),
          ),
        }}
      />
    </>
  );
}
