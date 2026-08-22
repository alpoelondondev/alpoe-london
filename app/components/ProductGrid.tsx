import type { Product } from "@/lib/types";
import { productUrl } from "@/lib/products";
import ProductTile, { TILE_GRID_CLASS } from "./ProductTile";

// One grid, every piece a tile — photographed or not. The split into "shot"
// cards and a separate "available to order" list is gone: everything listed is
// held in stock, and the tile is the same whether or not we have a photograph.
export default function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return (
      <div className="py-20 text-center border border-fg/[0.10]">
        <p className="font-serif text-2xl">Nothing matches these filters</p>
        <p className="mt-2 text-dim text-[12px] tracking-[0.14em] uppercase">
          Looking for something specific? Enquire on WhatsApp
        </p>
      </div>
    );
  }

  return (
    <div className={TILE_GRID_CLASS}>
      {products.map((p, i) => (
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
          priority={i < 3}
          ariaLabel={`View ${p.title}`}
        />
      ))}
    </div>
  );
}
