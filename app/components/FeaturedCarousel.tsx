import ScrollReveal from "./ScrollReveal";
import DragCarousel from "./DragCarousel";
import ProductCard from "./ProductCard";
import { hasPhotography } from "@/lib/products";
import type { Product } from "@/lib/types";

/**
 * Featured-pieces strip: same drag, haptics and snap behaviour as the homepage
 * carousel, on the off-black band. Used wherever a page shows a curated row.
 *
 * ── Photographed pieces only ──
 *
 * The filter is here rather than at each call site, because there are four of
 * them and they were not agreeing: the watches page filtered, the jewellery
 * page sorted photographed to the front and then sliced, and the two related
 * strips did the same. Sorting and slicing gets it right only while there are
 * enough photographed pieces to fill the row, and quietly starts showing empty
 * frames the moment there are not.
 *
 * A row headed "Featured" is the most deliberate thing on a page. One card in
 * it with no photograph does not read as a piece awaiting a shoot, it reads as
 * a broken carousel, and it undoes the row's whole purpose. Better a shorter
 * strip, or none.
 */
export default function FeaturedCarousel({
  label,
  products,
  ariaLabel,
  band = true,
}: {
  label: string;
  products: Product[];
  ariaLabel: string;
  /** Off-black band behind the strip; off for strips already inside one. */
  band?: boolean;
}) {
  const shown = products.filter(hasPhotography);
  if (!shown.length) return null;

  return (
    <section
      className={
        band
          ? "bg-panel py-16 mb-20 max-md:py-12 max-md:mb-14"
          : "py-4 pb-20 max-md:pb-14"
      }
    >
      <DragCarousel
        ariaLabel={ariaLabel}
        className="snap-proximity gap-4 px-[52px] max-md:px-6 max-md:gap-3 max-md:snap-mandatory"
      >
        {shown.map((p, i) => (
          <ScrollReveal
            key={p.id}
            className="flex-none w-[calc((100vw-152px)/4)] max-md:w-[78vw] snap-center"
            delay={i * 0.08}
          >
            <ProductCard product={p} priority={i < 3} onDark={band} />
          </ScrollReveal>
        ))}
      </DragCarousel>
    </section>
  );
}
