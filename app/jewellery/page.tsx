import type { Metadata } from "next";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import Breadcrumbs from "../components/Breadcrumbs";
import BrandHero from "../components/BrandHero";
import ProductGrid from "../components/ProductGrid";
import ScrollReveal from "../components/ScrollReveal";
import { JEWELLERY_CATEGORIES } from "@/lib/taxonomy";
import { getJewellery, productUrl } from "@/lib/products";
import { pageMetadata, ldJsonGraph, collectionLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Fine Jewellery — Engagement Rings, Wedding Bands, Diamonds & More",
  description:
    "Bespoke fine jewellery from Alpoe London, Hatton Garden. Engagement rings, wedding bands, men's jewellery, bracelets, earrings, necklaces, pendants and statement rings — designed and made in London.",
  path: "/jewellery",
});

export default function JewelleryIndex() {
  const items = getJewellery();
  const featured = items.filter((j) => j.featured).slice(0, 6);

  const ld = ldJsonGraph(
    collectionLd({
      name: "Fine Jewellery",
      description: "Bespoke diamond jewellery designed and made in Hatton Garden, London.",
      path: "/jewellery",
      products: featured.map((p) => ({ title: p.title, url: productUrl(p) })),
    }),
  );

  return (
    <>
      <SiteHeader />
      <main>
        <BrandHero
          eyebrow="Jewellery"
          title="Fine Jewellery, Made in Hatton Garden"
          copy="Bespoke engagement rings, diamond tennis bracelets, signature ice pendants and statement cocktail rings — designed and crafted by our Hatton Garden atelier."
        />

        <section className="px-[52px] py-8 max-md:px-6">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Jewellery", href: "/jewellery", current: true },
            ]}
          />
        </section>

        <section className="px-[52px] pb-14 max-md:px-6">
          <ScrollReveal>
            <p className="section-label text-[11px] tracking-[0.2em] uppercase text-accent mb-8 flex items-center gap-[18px]">
              Browse by Category
            </p>
          </ScrollReveal>
          <ul className="grid grid-cols-12 gap-4 max-md:gap-3 auto-rows-fr">
            {JEWELLERY_CATEGORIES.map((c) => (
              <li key={c.slug} className="col-span-4 max-md:col-span-6 flex">
                <Link
                  href={`/jewellery/${c.slug}`}
                  className="flex flex-col justify-between gap-3 w-full border border-white/[0.08] hover:border-accent/60 hover:bg-white/[0.02] transition p-5 min-h-[180px]"
                >
                  <p className="font-serif text-[22px] tracking-[0.02em] leading-none">{c.name}</p>
                  <p className="text-[12px] text-fg/60 font-light leading-relaxed">
                    {c.heritage.slice(0, 90)}…
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
                Featured Pieces
              </p>
            </ScrollReveal>
            <ProductGrid products={featured} />
          </section>
        ) : null}
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
