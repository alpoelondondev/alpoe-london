import type { Product } from "@/lib/types";
import { productUrl, hasPhotography } from "@/lib/products";
import ProductTile, { TILE_GRID_CLASS } from "./ProductTile";
import GridEmpty from "./GridEmpty";
import type { GridTile } from "./gridTile";

/**
 * A catalogue row as a tile, computed on the server because `productUrl` is.
 *
 * Shared with CatalogueGrid, which draws the same tiles in the browser so the
 * brand and category pages can filter without being server-rendered per visit.
 */
export function toGridTiles(products: Product[]): GridTile[] {
  return products.map((p) => ({
    id: p.id,
    href: productUrl(p),
    image: p.images[0],
    alt:
      [...new Set([p.brand, p.model, p.referenceNumber, p.materials])]
        .filter(Boolean)
        .join(" ")
        .trim() || p.title,
    title: p.title,
    meta:
      [p.model, p.referenceNumber ? `Ref ${p.referenceNumber}` : null]
        .filter(Boolean)
        .join(" \u00b7 ") || undefined,
    model: p.model,
    material: p.materials,
    featured: Boolean(p.featured),
    hasPhoto: hasPhotography(p),
  }));
}

// One grid, every piece a tile — photographed or not. The split into "shot"
// cards and a separate "available to order" list is gone: everything listed is
// held in stock, and the tile is the same whether or not we have a photograph.
export default function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) return <GridEmpty />;

  return (
    <div className={TILE_GRID_CLASS}>
      {toGridTiles(products).map((t, i) => (
        <ProductTile
          key={t.id}
          href={t.href}
          image={t.image}
          alt={t.alt}
          title={t.title}
          meta={t.meta}
          cta="View Details"
          priority={i < 3}
          ariaLabel={`View ${t.title}`}
        />
      ))}
    </div>
  );
}
