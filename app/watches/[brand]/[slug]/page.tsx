import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "../../../components/SiteHeader";
import Footer from "../../../components/Footer";
import WhatsAppButton from "../../../components/WhatsAppButton";
import ProductSearch from "../../../components/ProductSearch";
import ProductEnquiryStrip from "../../../components/ProductEnquiryStrip";
import Breadcrumbs from "../../../components/Breadcrumbs";
import ProductGallery from "../../../components/ProductGallery";
import ProductSpecs from "../../../components/ProductSpecs";
import WatchOptions from "../../../components/WatchOptions";
import FeaturedCarousel from "../../../components/FeaturedCarousel";
import { WATCH_BRANDS, watchBrandBySlug } from "@/lib/taxonomy";
import {
  buildSearchIndex,
  getWatchesByBrand,
  getWatchBySlug,
  getRelated,
} from "@/lib/products";
import {
  getCatalogueProductsByBrand,
  getCatalogueProductBySlug,
} from "@/lib/catalogue";
import { pageMetadata, ldJsonGraph, productLd } from "@/lib/seo";
import type { WatchBrandSlug } from "@/lib/types";

type RouteParams = { brand: string; slug: string };

export async function generateStaticParams() {
  const out: RouteParams[] = [];
  for (const b of WATCH_BRANDS) {
    const seen = new Set<string>();
    for (const p of getWatchesByBrand(b.slug)) {
      if (seen.has(p.slug)) continue;
      seen.add(p.slug);
      out.push({ brand: b.slug, slug: p.slug });
    }
    // Catalogue (live-sheet) products get pages too. Curated CSV slugs win on collision.
    for (const p of await getCatalogueProductsByBrand(b.slug)) {
      if (seen.has(p.slug)) continue;
      seen.add(p.slug);
      out.push({ brand: b.slug, slug: p.slug });
    }
  }
  return out;
}

export async function generateMetadata(
  props: { params: Promise<RouteParams> },
): Promise<Metadata> {
  const { brand, slug } = await props.params;
  const b = watchBrandBySlug(brand);
  if (!b) return {};
  const p =
    getWatchBySlug(b.slug as WatchBrandSlug, slug) ??
    (await getCatalogueProductBySlug(b.slug as WatchBrandSlug, slug));
  if (!p) return {};

  // Append the reference only when the title does not already carry it —
  // "Cartier Santos de Cartier WSSA0018 WSSA0018" was live on six listings.
  const ref = p.referenceNumber;
  const hasRef = ref ? p.title.toLowerCase().includes(ref.toLowerCase()) : true;
  const title = p.metaTitle ?? `${p.title}${hasRef ? "" : ` ${ref}`}`;
  const desc = p.metaDescription ?? `${p.title}${p.year ? `, ${p.year}` : ""}. ${p.description}`;
  return pageMetadata({
    title,
    absoluteTitle: true,
    description: desc.slice(0, 300),
    path: `/watches/${b.slug}/${p.slug}`,
    image: p.images[0],
  });
}

export default async function WatchProductPage(
  props: { params: Promise<RouteParams> },
) {
  const { brand, slug } = await props.params;
  const b = watchBrandBySlug(brand);
  if (!b) notFound();

  const product =
    getWatchBySlug(b.slug as WatchBrandSlug, slug) ??
    (await getCatalogueProductBySlug(b.slug as WatchBrandSlug, slug));
  if (!product) notFound();

  const path = `/watches/${b.slug}/${product.slug}`;
  const related = getRelated(product, 3);
  const searchIndex = buildSearchIndex();
  const alt = [product.brand, product.model, product.referenceNumber, product.materials]
    .filter(Boolean)
    .join(" ");

  // BreadcrumbList structured data is already emitted by <Breadcrumbs> below.
  const ld = ldJsonGraph([productLd(product, path)]);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="px-[52px] pt-52 pb-6 max-md:px-6 max-md:pt-48">
          <Breadcrumbs
            items={[
              { name: "Home", href: "/" },
              { name: "Watches", href: "/watches" },
              { name: b.name, href: `/watches/${b.slug}` },
              { name: product.title, href: path, current: true },
            ]}
          />
        </section>

        <section className="px-[52px] pb-20 grid grid-cols-12 gap-12 max-md:px-6 max-md:gap-8">
          <div className="col-span-7 max-md:col-span-12">
            <ProductGallery images={product.images} alt={alt} />
          </div>
          <div className="col-span-5 max-md:col-span-12">
            {product.year ? (
              <p className="mb-4 text-[10px] tracking-[0.18em] uppercase text-dim">
                {product.year}
              </p>
            ) : null}
            <p className="text-[11px] tracking-[0.2em] uppercase text-accent mb-2">
              {product.brand}
              {product.model ? ` · ${product.model}` : ""}
            </p>
            <h1 className="t-page mb-4">
              {product.title}
            </h1>
            {product.referenceNumber ? (
              <p className="text-[12px] tracking-[0.14em] uppercase text-dim mb-6">
                Reference: {product.referenceNumber}
              </p>
            ) : null}
            <p className="text-fg/80 leading-relaxed font-light">{product.description}</p>

            <div className="mt-8 py-4 border-y border-fg/[0.14] flex items-baseline justify-between">
              <span className="text-[11px] tracking-[0.18em] uppercase text-dim">Price</span>
              <span className="font-serif text-2xl tracking-[0.02em]">On Request</span>
            </div>

            <WatchOptions product={product} />

            <ProductSpecs product={product} />
          </div>
        </section>

        <section className="px-[52px] pb-14 max-md:px-6">
          <div className="max-w-xl">
            <ProductSearch index={searchIndex} />
          </div>
        </section>

        <FeaturedCarousel
          label="You may also like"
          ariaLabel="Related pieces"
          products={related}
          band={false}
        />
        <ProductEnquiryStrip product={product} />
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
