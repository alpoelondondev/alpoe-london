import type { Metadata } from "next";
import SiteHeader from "../components/SiteHeader";
import Footer from "../components/Footer";
import WhatsAppButton from "../components/WhatsAppButton";
import Breadcrumbs from "../components/Breadcrumbs";
import BrandHero from "../components/BrandHero";
import ProductGrid from "../components/ProductGrid";
import { getAllProducts, photosFirst } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";
import type { Product } from "@/lib/types";

/**
 * Noindex, follow.
 *
 * Internal search results are the textbook case Google's own guidelines ask
 * you to keep out of the index: every distinct `?q=` mints a new URL, they are
 * near-duplicates of each other and of the category pages, and none of them is
 * a page anyone should arrive on from a search engine. `follow` is kept so the
 * product links on the page still pass through to the pages that *should*
 * rank. robots.txt blocks the query form as well, so most crawlers never spend
 * a fetch discovering this.
 */
export const metadata: Metadata = pageMetadata({
  title: "Search the Alpoe London Collection",
  description:
    "Search Alpoe London for watches, engagement rings, diamond jewellery, brands and reference numbers — bespoke and ready to wear, from our Hatton Garden showroom.",
  path: "/search",
  noindex: true,
});

type SearchParams = { [k: string]: string | string[] | undefined };

function match(p: Product, q: string) {
  const hay = [
    p.title,
    p.brand,
    p.model,
    p.category,
    p.referenceNumber,
    p.materials,
    p.gemstones,
    p.nickname,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return hay.includes(q);
}

export default async function SearchPage(
  props: { searchParams: Promise<SearchParams> },
) {
  const sp = await props.searchParams;
  const q = (typeof sp.q === "string" ? sp.q : "").trim();
  const results = q
    ? getAllProducts()
        .filter((p) => match(p, q.toLowerCase()))
        .sort(photosFirst)
    : [];

  return (
    <>
      <SiteHeader />
      <main>
        <BrandHero
          eyebrow="Search"
          title={q ? `Results for “${q}”` : "Search the catalogue"}
          copy={
            q
              ? `${results.length} matching ${results.length === 1 ? "piece" : "pieces"}. Every piece is held in stock — enquire on WhatsApp for pricing.`
              : "Press / to open search, or type a brand, model, reference number or category in the header."
          }
        />
        <section className="px-[52px] py-6 max-md:px-6">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Search", href: "/search", current: true },
            ]}
          />
        </section>
        <section className="px-[52px] pb-24 max-md:px-6">
          {q ? <ProductGrid products={results} /> : null}
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
