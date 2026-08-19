import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "../../components/SiteHeader";
import Footer from "../../components/Footer";
import WhatsAppButton from "../../components/WhatsAppButton";
import Breadcrumbs from "../../components/Breadcrumbs";
import Link from "next/link";
import BrandHero from "../../components/BrandHero";
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
        {/* The Rings category is statement, eternity, signet and cocktail
            pieces, which is not what most people mean when they arrive looking
            for a ring. Rather than redirect the page away from the products
            that live in it, it points at the three that are usually wanted. */}
        {c.slug === "rings" && (
          <section className="px-[52px] pt-6 max-md:px-6">
            <p className="text-[11px] tracking-[0.2em] uppercase text-accent mb-4">
              Looking for
            </p>
            <ul className="flex flex-wrap gap-3">
              {[
                { name: "Engagement Rings", href: "/rings/engagement-and-wedding-rings" },
                { name: "Wedding Rings", href: "/rings/engagement-and-wedding-rings#wedding-rings" },
                { name: "Ready to Ship Rings", href: "/rings/ready-to-ship" },
                { name: "Ring Size Guide", href: "/ring-size-guide" },
              ].map((l) => (
                <li key={l.href + l.name}>
                  <Link
                    href={l.href}
                    className="inline-flex border border-fg/[0.18] px-5 py-2.5 text-[11px] font-semibold tracking-[0.14em] uppercase transition hover:border-accent hover:text-accent"
                  >
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
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
            <CategoryFilms films={films} />
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
