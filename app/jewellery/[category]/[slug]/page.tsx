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
import EnquireCTA from "../../../components/EnquireCTA";
import StockBadge from "../../../components/StockBadge";
import FeaturedCarousel from "../../../components/FeaturedCarousel";
import { JEWELLERY_CATEGORIES, jewelleryCategoryBySlug } from "@/lib/taxonomy";
import {
  buildSearchIndex,
  getJewelleryByCategory,
  getJewelleryBySlug,
  getRelated,
} from "@/lib/products";
import { pageMetadata, ldJsonGraph, productLd } from "@/lib/seo";
import type { JewelleryCategorySlug } from "@/lib/types";

type RouteParams = { category: string; slug: string };

export async function generateStaticParams() {
  const out: RouteParams[] = [];
  for (const c of JEWELLERY_CATEGORIES) {
    const items = getJewelleryByCategory(c.slug);
    for (const p of items) out.push({ category: c.slug, slug: p.slug });
  }
  return out;
}

export async function generateMetadata(
  props: { params: Promise<RouteParams> },
): Promise<Metadata> {
  const { category, slug } = await props.params;
  const c = jewelleryCategoryBySlug(category);
  if (!c) return {};
  const p = getJewelleryBySlug(c.slug as JewelleryCategorySlug, slug);
  if (!p) return {};

  return pageMetadata({
    title: p.metaTitle ?? p.title,
    description: (p.metaDescription ?? p.description).slice(0, 300),
    path: `/jewellery/${c.slug}/${p.slug}`,
    image: p.images[0],
  });
}

export default async function JewelleryProductPage(
  props: { params: Promise<RouteParams> },
) {
  const { category, slug } = await props.params;
  const c = jewelleryCategoryBySlug(category);
  if (!c) notFound();

  const product = getJewelleryBySlug(c.slug as JewelleryCategorySlug, slug);
  if (!product) notFound();

  const path = `/jewellery/${c.slug}/${product.slug}`;
  const related = getRelated(product, 3);
  const searchIndex = buildSearchIndex();
  const alt = [product.category, product.materials, product.gemstones, product.carat]
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
              { name: "Jewellery", href: "/jewellery" },
              { name: c.name, href: `/jewellery/${c.slug}` },
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
              {product.referenceNumber ? (
                <span className="text-[10px] tracking-[0.18em] uppercase text-dim">
                  {product.referenceNumber}
                </span>
              ) : null}
            </div>
            <p className="text-[11px] tracking-[0.2em] uppercase text-accent mb-2">
              {product.category}
            </p>
            <h1 className="font-serif text-[clamp(30px,4vw,54px)] tracking-[0.02em] leading-[1] mb-4">
              {product.title}
            </h1>
            <p className="text-fg/80 leading-relaxed font-light">{product.description}</p>

            <div className="mt-8 py-4 border-y border-fg/[0.14] flex items-baseline justify-between">
              <span className="text-[11px] tracking-[0.18em] uppercase text-dim">Price</span>
              <span className="font-serif text-2xl tracking-[0.02em]">On Request</span>
            </div>

            <EnquireCTA product={product} />

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
