import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { productUrl } from "@/lib/products";
import { buildEnquiryUrl } from "@/lib/whatsapp";

export default function ProductCard({
  product,
  priority,
  onDark,
}: {
  product: Product;
  priority?: boolean;
  /** Card sits on a dark band — flip the photo-less variant to light type. */
  onDark?: boolean;
}) {
  const hero = product.images[0];
  const alt = [product.brand, product.model, product.referenceNumber, product.materials]
    .filter(Boolean)
    .join(" ")
    .trim() || product.title;

  const inner = (
    <>
      {/* Nothing to show without a photo, so the card sits shorter than a shot one.
          The min-height keeps the overlaid title clear of the box at narrow widths. */}
      <div
        className={`work-thumb w-full block relative ${
          onDark ? "bg-fg/[0.06]" : "bg-fg/[0.04]"
        } ${hero ? "aspect-[4/5]" : "aspect-[4/3] min-h-[190px]"}`}
      >
        {hero ? (
          <Image
            src={hero}
            alt={alt}
            fill
            draggable={false}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 420px"
            className="object-cover pointer-events-none"
            priority={priority}
          />
        ) : null}
      </div>
      {hero ? (
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(19,16,16,0.88)] via-[rgba(19,16,16,0.1)] to-transparent pointer-events-none" />
      ) : null}
      <div className="absolute bottom-4 left-4 right-4">
        {product.brand ? (
          <p className={`text-[10px] tracking-[0.18em] uppercase mb-1 ${hero ? "text-blush" : onDark ? "text-champagne" : "text-accent"}`}>
            {product.brand}
            {product.model ? ` · ${product.model}` : ""}
          </p>
        ) : product.category ? (
          <p className={`text-[10px] tracking-[0.18em] uppercase mb-1 ${hero ? "text-blush" : onDark ? "text-champagne" : "text-accent"}`}>
            {product.category}
          </p>
        ) : null}
        <h3 className={`font-serif text-[clamp(18px,2vw,26px)] tracking-[0.02em] leading-tight ${hero || onDark ? "text-fg" : ""}`}>
          {product.title}
        </h3>
        <p className={`text-[11px] tracking-[0.14em] uppercase mt-1 ${hero ? "text-fg/60" : onDark ? "text-champagne" : "text-accent"}`}>
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
        draggable={false}
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
      draggable={false}
      className="work-item relative overflow-hidden group block"
      aria-label={`View ${product.title}`}
    >
      {inner}
    </Link>
  );
}
