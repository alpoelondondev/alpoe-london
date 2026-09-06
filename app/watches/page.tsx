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
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = pageMetadata({
  title: "Luxury Watches for Sale in London",
  description:
    "Authenticated luxury watches in Hatton Garden — Rolex, Patek Philippe, Audemars Piguet, Cartier, Hublot and Omega, held in stock and sourced to order.",
  path: ROUTES.watches,
  image: "/og/watches.jpg",
});

export default function WatchesIndex() {
  const watches = getWatches();
  /*
   * Featured strip is photography-led — a card with no shot has nothing to
   * show — and capped at two per brand.
   *
   * Taking the first eight photographed watches gave eight Rolexes, because
   * Rolex is most of the catalogue: a strip on a page headed "every major Swiss
   * maison" that shows one of them is an argument against its own headline.
   * Two each, flagged pieces first within a brand, brands in the order the
   * navigation lists them. A brand with no photographed piece simply does not
   * appear, which is the same rule the strip already applied per card.
   */
  const photographed = watches.filter(hasPhotography);
  const featured = WATCH_BRANDS.flatMap((b) => {
    const mine = photographed.filter((w) => w.brandSlug === b.slug);
    return [...mine.filter((w) => w.featured), ...mine.filter((w) => !w.featured)].slice(0, 2);
  });

  const ld = ldJsonGraph([
    ...collectionLd({
      name: "Luxury Watches",
      description:
        "Luxury watches at Alpoe London — every major brand, every reference held in stock.",
      path: ROUTES.watches,
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
          title="Luxury Watches for Sale in London"
          copy="Rolex, Patek Philippe, Audemars Piguet, Richard Mille, Cartier, Hublot, Omega and Breitling. Every piece held in stock at our Hatton Garden showroom, and anything we do not hold we can source."
        />

        <section className="px-[52px] py-8 max-md:px-6">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Watches", href: ROUTES.watches, current: true },
            ]}
          />
        </section>

        <section className="px-[52px] pb-14 max-md:px-6">
          <ul className="grid grid-cols-12 gap-4 max-md:gap-3 auto-rows-fr">
            {WATCH_BRANDS.map((b) => (
              <li key={b.slug} className="col-span-3 max-md:col-span-6 flex">
                <Link
                  href={ROUTES.watchBrand(b.slug)}
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

        {/*
          * Prose, because there was none.
          *
          * This page carries the site's head commercial term — "luxury watches
          * london" — on a hero line, a grid of eight brand links and a FAQ
          * block, with no body copy at all between them. A page with nothing
          * on it to read is a page with nothing to rank.
          */}
        <ScrollReveal>
          <section className="border-t border-fg/10 px-[52px] py-14 max-md:px-6 max-md:py-10">
            <h2 className="t-section">Buying a luxury watch in London</h2>
            <p className="mt-4 max-w-[70ch] t-copy">
              London is one of the three or four genuine centres of the
              pre-owned watch trade, and Hatton Garden is where most of it
              changes hands. The practical advantage to a buyer is not price so
              much as choice and proximity: a reference you would wait months
              for at an authorised dealer is usually available immediately on
              the pre-owned market, and several dealers holding it sit within a
              few streets of each other.
            </p>
            <p className="mt-4 max-w-[70ch] t-copy">
              Everything we list is authenticated in our own showroom before it
              is offered — opened, timed and inspected rather than taken on a
              previous owner&rsquo;s word. Anything we do not hold, we source.
              If you know the reference you want, tell us and we will find that
              one rather than sell you the nearest thing in the case; if you do
              not, the brand pages below set out how each maker&rsquo;s model
              families differ and what separates a good example from a poor one.
            </p>
            <p className="mt-4 max-w-[70ch] t-copy">
              Buying against something you already own?{" "}
              <Link
                href={ROUTES.sell}
                className="text-accent underline underline-offset-4"
              >
                We take part-exchange
              </Link>{" "}
              on anything in the catalogue, and the allowance is often better
              than selling outright &mdash;{" "}
              <Link
                href={ROUTES.guideSellingAWatch}
                className="text-accent underline underline-offset-4"
              >
                our guide to the six ways to sell a watch in London
              </Link>{" "}
              explains why, and when it is not.
            </p>
          </section>
        </ScrollReveal>

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
