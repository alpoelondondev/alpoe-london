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
import { truncateForSerp, pageMetadata, ldJsonGraph, collectionLd } from "@/lib/seo";
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
  /*
   * Both halves of this used to overflow. The title stacked three model names
   * onto the brand and the "| Alpoe London" template, which put Audemars
   * Piguet at 99 characters — Google renders about sixty, so the models the
   * title existed to name were the first thing cut. And the description
   * appended the whole `heritage` paragraph, reaching 267 characters on Rolex.
   *
   * Two models is enough to signal depth, and the description now leads with
   * what this page offers before it borrows any house history.
   */
  const stem = `${b.name} Watches for Sale`;
  // 60 characters is what Google renders; the layout template spends 15 of
  // them on "| Alpoe London". Add model names only while they fit, so
  // "Rolex" gets two and "Vacheron Constantin" gets none.
  const room = 60 - " | Alpoe London".length - stem.length - " — ".length;
  const models: string[] = [];
  for (const m of b.models) {
    const next = [...models, m].join(" & ");
    if (next.length > room) break;
    models.push(m);
  }
  return pageMetadata({
    title: models.length ? `${stem} — ${models.join(" & ")}` : stem,
    description: truncateForSerp(
      `Authenticated ${b.name} watches from Alpoe London in Hatton Garden — ${b.models
        .slice(0, 3)
        .join(", ")} and more, in stock and sourced to order. ${b.heritage}`,
    ),
    path: `/watches/${b.slug}`,
    image: "/og/watches.jpg",
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
        {/*
          The bare brand name was the h1 on all eleven of these pages — a term
          the brand's own site owns outright, and one that says nothing about
          what this page offers. "Rolex Watches for Sale in London" is what the
          page is, and it is what somebody looking for one types.
        */}
        <BrandHero
          eyebrow="Watches"
          title={`${b.name} Watches for Sale in London`}
          copy={b.heritage}
        />
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
