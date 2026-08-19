import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import Footer from "../../components/Footer";
import ScrollReveal from "../../components/ScrollReveal";
import { ReadyToShipCard } from "../RingCards";
import { collectionPieces } from "@/lib/rings/collection";
import { pageMetadata, ldJsonGraph, breadcrumbLd } from "@/lib/seo";
import { siteUrl } from "@/lib/site";

const PATH = "/rings/ready-to-ship";

export const metadata: Metadata = pageMetadata({
  title: "Ready to Ship Engagement Rings, Hatton Garden",
  description:
    "Finished engagement rings we hold in Hatton Garden, ready to be sized and sent rather than made to order. Solitaire, halo, trilogy, rubover and vintage settings.",
  path: PATH,
});

export default function ReadyToShipPage() {
  const pieces = collectionPieces();

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
          <h1 className="t-page mt-3">Ready to Ship Rings</h1>
          <p className="mt-5 max-w-[58ch] t-copy">
            Finished pieces we hold rather than make to order, so they can be sized and
            sent far sooner than a commission. Ask about any of them and we will confirm
            what is available in your size. If you would rather have something built to
            your own specification, start in the{" "}
            <Link
              href="/ring-builder"
              className="text-sheet-ink underline underline-offset-4 transition hover:text-accent-deep"
            >
              ring builder
            </Link>
            .
          </p>
        </section>

        <ScrollReveal>
          <section className="px-[52px] pb-16 max-md:px-6 max-md:pb-12">
            <ul className="grid grid-cols-3 gap-x-8 gap-y-12 max-lg:grid-cols-2 max-md:gap-x-4 max-md:gap-y-8">
              {pieces.map((piece) => (
                <li key={piece.id}>
                  <ReadyToShipCard piece={piece} />
                </li>
              ))}
            </ul>
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
                { name: "Ready to Ship Rings", url: siteUrl(PATH) },
              ]),
            ]),
          ),
        }}
      />
    </>
  );
}
