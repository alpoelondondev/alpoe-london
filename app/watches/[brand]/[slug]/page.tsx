import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteHeader from "../../../components/SiteHeader";
import Footer from "../../../components/Footer";
import WhatsAppButton from "../../../components/WhatsAppButton";
import Breadcrumbs from "../../../components/Breadcrumbs";
import ProductGallery from "../../../components/ProductGallery";
import ProductSpecs from "../../../components/ProductSpecs";
import WatchOptions from "../../../components/WatchOptions";
import StockBadge from "../../../components/StockBadge";
import ProductCard from "../../../components/ProductCard";
import { WATCH_BRANDS, watchBrandBySlug } from "@/lib/taxonomy";
import {
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

  const title = p.metaTitle ?? `${p.title}${p.referenceNumber ? ` ${p.referenceNumber}` : ""}`;
  const desc = p.metaDescription ?? `${p.title}${p.year ? `, ${p.year}` : ""}. ${p.description}`;
  return pageMetadata({
    title,
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
  const alt = [product.brand, product.model, product.referenceNumber, product.materials]
    .filter(Boolean)
    .join(" ");

  // BreadcrumbList structured data is already emitted by <Breadcrumbs> below.
  const ld = ldJsonGraph([productLd(product, path)]);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="px-[52px] pt-32 pb-6 max-md:px-6 max-md:pt-28">
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
            <div className="flex items-center gap-3 mb-4">
              <StockBadge state={product.stockState} />
              {product.year ? (
                <span className="text-[10px] tracking-[0.18em] uppercase text-dim">
                  {product.year}
                </span>
              ) : null}
            </div>
            <p className="text-[11px] tracking-[0.2em] uppercase text-accent mb-2">
              {product.brand}
              {product.model ? ` · ${product.model}` : ""}
            </p>
            <h1 className="font-serif text-[clamp(30px,4vw,54px)] tracking-[0.02em] leading-[1] mb-4">
              {product.title}
            </h1>
            {product.referenceNumber ? (
              <p className="text-[12px] tracking-[0.14em] uppercase text-dim mb-6">
                Reference: {product.referenceNumber}
              </p>
            ) : null}
            <p className="text-fg/80 leading-relaxed font-light">{product.description}</p>

            <div className="mt-8 py-4 border-y border-black/[0.10] flex items-baseline justify-between">
              <span className="text-[11px] tracking-[0.18em] uppercase text-dim">Price</span>
              <span className="font-serif text-2xl tracking-[0.02em]">On Request</span>
            </div>

            <WatchOptions product={product} />

            <ProductSpecs product={product} />
          </div>
        </section>

        {related.length ? (
          <section className="px-[52px] pb-24 max-md:px-6">
            <p className="section-label text-[11px] tracking-[0.2em] uppercase text-accent mb-8 flex items-center gap-[18px]">
              You may also like
            </p>
            <div className="grid grid-cols-12 gap-5 max-md:gap-4">
              {related.map((r) => (
                <div key={r.id} className="col-span-4 max-md:col-span-12">
                  <ProductCard product={r} />
                </div>
              ))}
            </div>
          </section>
        ) : null}
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
