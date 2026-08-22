import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "../../components/SiteHeader";
import Footer from "../../components/Footer";
import WhatsAppButton from "../../components/WhatsAppButton";
import Breadcrumbs from "../../components/Breadcrumbs";
import BrandHero from "../../components/BrandHero";
import Filters from "../../components/Filters";
import ProductGrid from "../../components/ProductGrid";
import { WATCH_BRANDS, watchBrandBySlug } from "@/lib/taxonomy";
import { getWatchesByBrand, photosFirst, productUrl } from "@/lib/products";
import { getCatalogueProductsByBrand, referenceKey } from "@/lib/catalogue";
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
        .join(", ")} and more, all held in stock. ${b.heritage}`,
    ),
    path: `/watches/${b.slug}`,
    image: "/og/watches.jpg",
  });
}

/**
 * One list per brand: the curated rows in products.csv and the live-sheet
 * catalogue, together. Where both carry the same reference the sheet wins —
 * its rows are per dial and bracelet, so a generic "Datejust 41 126334" card
 * beside twenty-one specific ones was the same watch listed twice. The curated
 * page still exists (and is still linked from search); it just isn't a second
 * tile here.
 */
function mergeListings(curated: Product[], catalogue: Product[]): Product[] {
  const inSheet = new Set(
    catalogue.map((p) => referenceKey(p.referenceNumber ?? "")).filter(Boolean),
  );
  const unique = curated.filter(
    (p) => !p.referenceNumber || !inSheet.has(referenceKey(p.referenceNumber)),
  );
  return [...unique, ...catalogue];
}

function applyFilters(products: Product[], sp: SearchParams) {
  const model = typeof sp.model === "string" ? sp.model : undefined;
  const sort = typeof sp.sort === "string" ? sp.sort : "featured";

  let out = products.slice();
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

  const all = mergeListings(
    getWatchesByBrand(b.slug as WatchBrandSlug),
    await getCatalogueProductsByBrand(b.slug as WatchBrandSlug),
  );
  const filtered = applyFilters(all, sp);
  // The model filter lists what is actually on the page, not the taxonomy's
  // three headline lines — the sheet names models the taxonomy never will.
  const modelOptions = [...new Set(all.map((p) => p.model).filter(Boolean))]
    .sort()
    .map((m) => ({ value: m as string, label: m as string }));

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
