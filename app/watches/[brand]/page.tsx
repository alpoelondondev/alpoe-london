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
import { getWatchesByBrand, hasPhotography, photosFirst, productUrl } from "@/lib/products";
import { getBrandCatalogue } from "@/lib/catalogue";
import { pageMetadata, ldJsonGraph, collectionLd } from "@/lib/seo";
import type { WatchBrandSlug, Product } from "@/lib/types";

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
  // Photography is the stock signal here: shot pieces are the ones we can show,
  // everything else is an enquire-now reference we source to order.
  if (stock === "in_stock") out = out.filter(hasPhotography);
  else if (stock === "sourceable") out = out.filter((p) => !hasPhotography(p));

  if (model) out = out.filter((p) => p.model === model);

  const tiebreak =
    sort === "a-z"
      ? (a: Product, b: Product) => a.title.localeCompare(b.title)
      : sort === "z-a"
        ? (a: Product, b: Product) => b.title.localeCompare(a.title)
        : (a: Product, b: Product) => Number(b.featured) - Number(a.featured);
  out.sort((a, b) => photosFirst(a, b) || tiebreak(a, b));

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
            items={catalogue.items}
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
