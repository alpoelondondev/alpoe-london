import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "../../components/SiteHeader";
import Footer from "../../components/Footer";
import WhatsAppButton from "../../components/WhatsAppButton";
import Breadcrumbs from "../../components/Breadcrumbs";
import BrandHero from "../../components/BrandHero";
import Filters from "../../components/Filters";
import ProductGrid from "../../components/ProductGrid";
import { JEWELLERY_CATEGORIES, jewelleryCategoryBySlug } from "@/lib/taxonomy";
import { getJewelleryByCategory, productUrl } from "@/lib/products";
import { pageMetadata, ldJsonGraph, collectionLd } from "@/lib/seo";
import type { JewelleryCategorySlug, Product, StockState } from "@/lib/types";

type RouteParams = { category: string };
type SearchParams = { [k: string]: string | string[] | undefined };

export async function generateStaticParams() {
  return JEWELLERY_CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata(
  props: { params: Promise<RouteParams> },
): Promise<Metadata> {
  const { category } = await props.params;
  const c = jewelleryCategoryBySlug(category);
  if (!c) return {};
  return pageMetadata({
    title: `${c.name} — Bespoke & Ready-to-Wear`,
    description: c.heritage,
    path: `/jewellery/${c.slug}`,
  });
}

function materialOptionsFor(products: Product[]) {
  const set = new Set<string>();
  for (const p of products) if (p.materials) set.add(p.materials);
  return Array.from(set).sort().map((m) => ({ value: m, label: m }));
}

function applyFilters(products: Product[], sp: SearchParams) {
  const stock = typeof sp.stock === "string" ? sp.stock : undefined;
  const material = typeof sp.material === "string" ? sp.material : undefined;
  const sort = typeof sp.sort === "string" ? sp.sort : "featured";

  let out = products.slice();
  if (stock === "in_stock" || stock === "sourceable") {
    out = out.filter((p) => p.stockState === (stock as StockState));
  }
  if (material) out = out.filter((p) => p.materials === material);
  if (sort === "a-z") out.sort((a, b) => a.title.localeCompare(b.title));
  else if (sort === "z-a") out.sort((a, b) => b.title.localeCompare(a.title));
  else out.sort((a, b) => Number(b.featured) - Number(a.featured));
  return out;
}

export default async function JewelleryCategoryPage(
  props: { params: Promise<RouteParams>; searchParams: Promise<SearchParams> },
) {
  const { category } = await props.params;
  const sp = await props.searchParams;
  const c = jewelleryCategoryBySlug(category);
  if (!c) notFound();

  const all = getJewelleryByCategory(c.slug as JewelleryCategorySlug);
  const filtered = applyFilters(all, sp);

  const ld = ldJsonGraph(
    collectionLd({
      name: c.name,
      description: c.heritage,
      path: `/jewellery/${c.slug}`,
      products: filtered.map((p) => ({ title: p.title, url: productUrl(p) })),
    }),
  );

  return (
    <>
      <SiteHeader />
      <main>
        <BrandHero eyebrow="Jewellery" title={c.name} copy={c.heritage} />
        <section className="px-[52px] py-4 max-md:px-6">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Jewellery", href: "/jewellery" },
              { name: c.name, href: `/jewellery/${c.slug}`, current: true },
            ]}
          />
        </section>
        <section className="px-[52px] pb-20 max-md:px-6">
          <Filters materialOptions={materialOptionsFor(all)} />
          <ProductGrid products={filtered} />
        </section>
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
