import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "../../components/SiteHeader";
import Footer from "../../components/Footer";
import WhatsAppButton from "../../components/WhatsAppButton";
import Breadcrumbs from "../../components/Breadcrumbs";
import Link from "next/link";
import BrandHero from "../../components/BrandHero";
import PageCover from "../../components/PageCover";
import Filters from "../../components/Filters";
import ProductGrid from "../../components/ProductGrid";
import CategoryFilms from "../../components/CategoryFilms";
import { JEWELLERY_CATEGORIES, jewelleryCategoryBySlug } from "@/lib/taxonomy";
import { filmsForCategory } from "@/lib/films";
import { getJewelleryByCategory, hasPhotography, photosFirst, productUrl } from "@/lib/products";
import { pageMetadata, ldJsonGraph, collectionLd } from "@/lib/seo";
import type { JewelleryCategorySlug, Product } from "@/lib/types";

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
  // Photography is the stock signal here: shot pieces are the ones we can show,
  // everything else is an enquire-now reference we source to order.
  if (stock === "in_stock") out = out.filter(hasPhotography);
  else if (stock === "sourceable") out = out.filter((p) => !hasPhotography(p));

  if (material) out = out.filter((p) => p.materials === material);

  const tiebreak =
    sort === "a-z"
      ? (a: Product, b: Product) => a.title.localeCompare(b.title)
      : sort === "z-a"
        ? (a: Product, b: Product) => b.title.localeCompare(a.title)
        : (a: Product, b: Product) => Number(b.featured) - Number(a.featured);
  out.sort((a, b) => photosFirst(a, b) || tiebreak(a, b));
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

  // Where we have workshop footage, the films are the listing: they show the
  // real piece and enquire directly, which the unphotographed reference rows
  // they replace could never do. Categories without footage keep the grid.
  const films = filmsForCategory(c.slug as JewelleryCategorySlug);

  const ld = ldJsonGraph(
    collectionLd({
      name: c.name,
      description: c.heritage,
      path: `/jewellery/${c.slug}`,
      products: films.length
        ? films.map((f) => ({ title: f.title, url: `/jewellery/${c.slug}` }))
        : filtered.map((p) => ({ title: p.title, url: productUrl(p) })),
    }),
  );

  return (
    <>
      <SiteHeader />
      <main>
        <BrandHero eyebrow="Jewellery" title={c.name} copy={c.heritage} />

        {/* A band of the ring footage under the header, on the one category
            that is about rings. Not the header itself: the page already has
            one, and a film carrying the heading would leave the text sitting on
            moving pictures for the whole of the first screen. */}
        {c.slug === "rings" && (
          <PageCover
            strip
            video="/alpoe-oval-three-stone-diamond-ring-hatton-garden.mp4"
            poster="/alpoe-oval-three-stone-diamond-ring-hatton-garden.jpg"
          />
        )}

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
          {films.length ? (
            // No Filters here: they filter stock and material off the product
            // rows, and there are none left on a film page to filter.
            <>
              <CategoryFilms films={films} />
              {/* Under the films rather than above them. Somebody who has
                  watched the footage is the one most likely to want a finished
                  ring, and a row of shortcuts before the films asked them to
                  choose before they had seen anything. */}
              {c.slug === "rings" && (
                <div className="mt-12 flex justify-center max-md:mt-9">
                  <Link
                    href="/rings/ready-to-ship"
                    className="inline-flex items-center justify-center border border-fg/[0.22] px-8 py-3.5 text-[11px] font-semibold tracking-[0.16em] uppercase transition hover:border-accent hover:text-accent"
                  >
                    View more ready to ship rings
                  </Link>
                </div>
              )}
            </>
          ) : (
            <>
              <Filters materialOptions={materialOptionsFor(all)} />
              <ProductGrid products={filtered} />
            </>
          )}
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
