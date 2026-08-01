import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import Breadcrumbs from "../components/Breadcrumbs";
import BrandHero from "../components/BrandHero";
import ProductGrid from "../components/ProductGrid";
import ScrollReveal from "../components/ScrollReveal";
import { WATCH_BRANDS } from "@/lib/taxonomy";
import { getWatches } from "@/lib/products";
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
  const featured = watches.filter((w) => w.featured).slice(0, 6);

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
          <ScrollReveal>
            <p className="section-label text-[11px] tracking-[0.2em] uppercase text-accent mb-8 flex items-center gap-[18px]">
              Browse by Brand
            </p>
          </ScrollReveal>
          <ul className="grid grid-cols-12 gap-4 max-md:gap-3 auto-rows-fr">
            {WATCH_BRANDS.map((b) => (
              <li key={b.slug} className="col-span-3 max-md:col-span-6 flex">
                <Link
                  href={`/watches/${b.slug}`}
                  className="flex flex-col justify-between gap-4 w-full border border-black/[0.10] hover:border-accent/60 hover:bg-black/[0.03] transition p-5 min-h-[130px]"
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

        {featured.length ? (
          <section className="px-[52px] pb-20 max-md:px-6">
            <ScrollReveal>
              <p className="section-label text-[11px] tracking-[0.2em] uppercase text-accent mb-8 flex items-center gap-[18px]">
                Featured Timepieces
              </p>
            </ScrollReveal>
            <ProductGrid products={featured} />
          </section>
        ) : null}
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
