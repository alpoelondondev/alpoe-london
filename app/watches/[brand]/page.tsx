import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "../../components/SiteHeader";
import Footer from "../../components/Footer";
import WhatsAppButton from "../../components/WhatsAppButton";
import Breadcrumbs from "../../components/Breadcrumbs";
import BrandHero from "../../components/BrandHero";
import Filters from "../../components/Filters";
import ProductGrid from "../../components/ProductGrid";
import AvailabilityCatalogue from "../../components/AvailabilityCatalogue";
import { WATCH_BRANDS, watchBrandBySlug } from "@/lib/taxonomy";
import { getWatchesByBrand, productUrl } from "@/lib/products";
import { getBrandCatalogue } from "@/lib/catalogue";
import { pageMetadata, ldJsonGraph, collectionLd } from "@/lib/seo";
import type { WatchBrandSlug, Product, StockState } from "@/lib/types";

type RouteParams = { brand: string };
type SearchParams = { [k: string]: string | string[] | undefined };

export async function generateStaticParams() {
  return WATCH_BRANDS.map((b) => ({ brand: b.slug }));
}

export async function generateMetadata(
  props: { params: Promise<RouteParams> },
): Promise<Metadata> {
  const { brand } = await props.params;
  const b = watchBrandBySlug(brand);
  if (!b) return {};
  return pageMetadata({
    title: `${b.name} Watches — Authentic ${b.models.slice(0, 3).join(", ")} & More`,
    description: `${b.name} watches available at Alpoe London, Hatton Garden. ${b.heritage}`,
    path: `/watches/${b.slug}`,
  });
}

function applyFilters(products: Product[], sp: SearchParams) {
  const stock = typeof sp.stock === "string" ? sp.stock : undefined;
  const model = typeof sp.model === "string" ? sp.model : undefined;
  const sort = typeof sp.sort === "string" ? sp.sort : "featured";

  let out = products.slice();
  if (stock === "in_stock" || stock === "sourceable") {
    out = out.filter((p) => p.stockState === (stock as StockState));
  }
  if (model) out = out.filter((p) => p.model === model);

  if (sort === "a-z") out.sort((a, b) => a.title.localeCompare(b.title));
  else if (sort === "z-a") out.sort((a, b) => b.title.localeCompare(a.title));
  else out.sort((a, b) => Number(b.featured) - Number(a.featured));

  return out;
}

export default async function BrandPage(
  props: { params: Promise<RouteParams>; searchParams: Promise<SearchParams> },
) {
  const { brand } = await props.params;
  const sp = await props.searchParams;
  const b = watchBrandBySlug(brand);
  if (!b) notFound();

  const all = getWatchesByBrand(b.slug as WatchBrandSlug);
  const filtered = applyFilters(all, sp);
  const modelOptions = b.models.map((m) => ({ value: m, label: m }));

  const catalogue = await getBrandCatalogue(b.slug as WatchBrandSlug);

  const ld = ldJsonGraph(
    collectionLd({
      name: `${b.name} Watches`,
      description: b.heritage,
      path: `/watches/${b.slug}`,
      products: filtered.map((p) => ({ title: p.title, url: productUrl(p) })),
    }),
  );

  return (
    <>
      <SiteHeader />
      <main>
        <BrandHero eyebrow="Watches" title={`${b.name}`} copy={b.heritage} />
        <section className="px-[52px] py-4 max-md:px-6">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Watches", href: "/watches" },
              { name: b.name, href: `/watches/${b.slug}`, current: true },
            ]}
          />
        </section>
        <section className="px-[52px] pb-20 max-md:px-6">
          <Filters modelOptions={modelOptions} />
          <ProductGrid products={filtered} />
          <AvailabilityCatalogue
            brandName={b.name}
            groups={catalogue.groups}
            total={catalogue.total}
          />
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
