import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import Footer from "../../components/Footer";
import ScrollReveal from "../../components/ScrollReveal";
import { StyleGrid } from "../RingCards";
import { ringStyles, styleHref, styleTitle } from "@/lib/rings/styles";
import { rendersOrigin } from "@/lib/ring/renders";
import { pageMetadata, ldJsonGraph, breadcrumbLd, collectionLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

const PATH = "/rings/engagement-rings";

export const metadata: Metadata = pageMetadata({
  title: "Engagement Rings Hatton Garden: Design Your Own",
  description:
    "Fifteen engagement ring styles made to order in Hatton Garden. Solitaire, knife edge, cathedral pavé, three stone, twist and more. Choose the diamond shape, setting, metal and UK size.",
  path: PATH,
});

export default function EngagementRingsPage() {
  const styles = ringStyles();
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
          <h1 className="t-page mt-3">Engagement Rings</h1>
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
          <section className="px-[52px] pb-16 max-md:px-6 max-md:pb-12">
            <StyleGrid styles={styles} />
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
                { name: "Engagement Rings", url: siteUrl(PATH) },
              ]),
              ...collectionLd({
                name: "Engagement Rings",
                description:
                  "Engagement ring styles made to order by Alpoe London in Hatton Garden.",
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
