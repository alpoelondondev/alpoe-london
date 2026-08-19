import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import Breadcrumbs from "../components/Breadcrumbs";
import BrandHero from "../components/BrandHero";
import FeaturedCarousel from "../components/FeaturedCarousel";
import ScrollReveal from "../components/ScrollReveal";
import { WATCH_BRANDS } from "@/lib/taxonomy";
import { getWatches, hasPhotography } from "@/lib/products";
import FAQ from "../components/FAQ";
import { pageMetadata, ldJsonGraph, collectionLd, faqLd } from "@/lib/seo";
import { WATCH_FAQS } from "@/lib/faqs";
import { productUrl } from "@/lib/products";

export const metadata: Metadata = pageMetadata({
  title: "Luxury Watches — Rolex, Patek Philippe, Audemars Piguet & More",
  description:
    "Authenticated luxury watches sourced through Alpoe London in Hatton Garden. Rolex, Patek Philippe, Audemars Piguet, Richard Mille, Cartier, Hublot, Omega and more — live stock and sourceable to order.",
  path: "/watches",
});

export default function WatchesIndex() {
  const watches = getWatches();
  // Featured strip is photography-led — a card with no shot has nothing to
  // show. Only one flagged-featured watch is photographed, so the strip leads
  // with the flagged ones and tops up from the rest of the shot pieces.
  const photographed = watches.filter(hasPhotography);
  const featured = [
    ...photographed.filter((w) => w.featured),
    ...photographed.filter((w) => !w.featured),
  ].slice(0, 8);

  const ld = ldJsonGraph([
    ...collectionLd({
      name: "Luxury Watches",
      description:
        "Luxury watches at Alpoe London — every major brand, live stock and sourceable references.",
      path: "/watches",
      products: featured.map((p) => ({ title: p.title, url: productUrl(p) })),
    }),
    faqLd(WATCH_FAQS),
  ]);

  return (
    <>
      <SiteHeader />
      <main>
        <BrandHero
          eyebrow="Watches"
          title="Luxury Watches, Authenticated & Sourced"
          copy="Every major Swiss maison — Rolex, Patek Philippe, Audemars Piguet, Richard Mille, Cartier, Hublot, Omega, Breitling, IWC, Panerai and Vacheron Constantin. Pieces we hold in our Hatton Garden showroom and pieces sourced from our global dealer network."
        />

        <section className="px-[52px] py-8 max-md:px-6">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Watches", href: "/watches", current: true },
            ]}
          />
        </section>

        <section className="px-[52px] pb-14 max-md:px-6">
          <ul className="grid grid-cols-12 gap-4 max-md:gap-3 auto-rows-fr">
            {WATCH_BRANDS.map((b) => (
              <li key={b.slug} className="col-span-3 max-md:col-span-6 flex">
                <Link
                  href={`/watches/${b.slug}`}
                  className="flex flex-col justify-between gap-4 w-full border border-fg/[0.14] hover:border-accent/60 hover:bg-fg/[0.04] transition p-5 min-h-[130px]"
                >
                  <p className="font-serif text-[22px] tracking-[0.02em] leading-none">{b.name}</p>
                  <p className="text-[10px] tracking-[0.18em] uppercase text-dim">
                    {b.models.slice(0, 3).join(" · ")}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <FeaturedCarousel
          label="Featured Timepieces"
          ariaLabel="Featured timepieces"
          products={featured}
        />
        <FAQ items={WATCH_FAQS} />
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
