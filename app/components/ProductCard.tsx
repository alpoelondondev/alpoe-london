import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { productUrl } from "@/lib/products";
import { buildEnquiryUrl } from "@/lib/whatsapp";
import StockBadge from "./StockBadge";

export default function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const hero = product.images[0];
  const alt = [product.brand, product.model, product.referenceNumber, product.materials]
    .filter(Boolean)
    .join(" ")
    .trim() || product.title;

  const inner = (
    <>
      <div className="work-thumb w-full aspect-[4/5] block bg-white/[0.02] relative">
        {hero ? (
          <Image
            src={hero}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 420px"
            className="object-cover"
            priority={priority}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-dim text-[11px] tracking-[0.18em] uppercase">
            Image on request
          </div>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(6,6,8,0.88)] via-[rgba(6,6,8,0.1)] to-transparent pointer-events-none" />
      <div className="absolute top-3 left-3">
        <StockBadge state={product.stockState} />
      </div>
      <div className="absolute bottom-4 left-4 right-4">
        {product.brand ? (
          <p className="text-[10px] tracking-[0.18em] uppercase text-accent mb-1">
            {product.brand}
            {product.model ? ` · ${product.model}` : ""}
          </p>
        ) : product.category ? (
          <p className="text-[10px] tracking-[0.18em] uppercase text-accent mb-1">
            {product.category}
          </p>
        ) : null}
        <h3 className="font-serif text-[clamp(18px,2vw,26px)] tracking-[0.02em] leading-tight">
          {product.title}
        </h3>
        <p className="text-[11px] tracking-[0.14em] uppercase text-dim mt-1">
          {hero ? "Price on Request" : "Enquire Now →"}
        </p>
      </div>
    </>
  );

  // No photography yet — send the enquiry straight to WhatsApp with this
  // product pre-filled instead of linking to a page without images.
  if (!hero) {
    return (
      <a
        href={buildEnquiryUrl(product)}
        target="_blank"
        rel="noopener noreferrer"
        className="work-item relative overflow-hidden group block"
        aria-label={`Enquire about ${product.title} on WhatsApp`}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link
      href={productUrl(product)}
      className="work-item relative overflow-hidden group block"
      aria-label={`View ${product.title}`}
    >
      {inner}
    </Link>
  );
}
