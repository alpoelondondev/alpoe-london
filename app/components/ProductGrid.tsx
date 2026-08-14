import type { Product } from "@/lib/types";
import { hasPhotography, productUrl } from "@/lib/products";
import { buildEnquiryUrl } from "@/lib/whatsapp";
import ProductTile, { TILE_GRID_CLASS } from "./ProductTile";
import StockBadge from "./StockBadge";
import EnquiryList, { type EnquiryListRow } from "./EnquiryList";

function toRow(p: Product): EnquiryListRow {
  const eyebrow = p.brand
    ? `${p.brand}${p.model ? ` · ${p.model}` : ""}`
    : p.category;
  return {
    id: p.id,
    href: buildEnquiryUrl(p),
    eyebrow,
    title: p.title,
    meta: p.referenceNumber ? `Ref ${p.referenceNumber}` : p.materials,
    ariaLabel: `Enquire about ${p.title} on WhatsApp`,
  };
}

export default function ProductGrid({ products }: { products: Product[] }) {
  const shot = products.filter(hasPhotography);
  // No photo, no card — these run as a scrollable list below the grid.
  const unshot = products.filter((p) => !hasPhotography(p));

  if (!products.length) {
    return (
      <div className="py-20 text-center border border-fg/[0.10]">
        <p className="font-serif text-2xl">Nothing matches these filters</p>
        <p className="mt-2 text-dim text-[12px] tracking-[0.14em] uppercase">
          Anything can be sourced — enquire on WhatsApp
        </p>
      </div>
    );
  }

  return (
    <>
      {shot.length ? (
        <div className={TILE_GRID_CLASS}>
          {shot.map((p, i) => (
            <ProductTile
              key={p.id}
              href={productUrl(p)}
              image={p.images[0]}
              alt={
                [p.brand, p.model, p.referenceNumber, p.materials]
                  .filter(Boolean)
                  .join(" ")
                  .trim() || p.title
              }
              title={p.title}
              meta={
                [p.model, p.referenceNumber ? `Ref ${p.referenceNumber}` : null]
                  .filter(Boolean)
                  .join(" · ") || undefined
              }
              cta="View Details"
              badge={<StockBadge state={p.stockState} />}
              priority={i < 3}
              ariaLabel={`View ${p.title}`}
            />
          ))}
        </div>
      ) : null}

      <EnquiryList
        rows={unshot.map(toRow)}
        label={shot.length ? "Also available to order" : "Available to order"}
      />
    </>
  );
}
