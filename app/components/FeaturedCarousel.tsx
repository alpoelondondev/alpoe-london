import ScrollReveal from "./ScrollReveal";
import DragCarousel from "./DragCarousel";
import ProductCard from "./ProductCard";
import type { Product } from "@/lib/types";

/**
 * Featured-pieces strip: same drag, haptics and snap behaviour as the homepage
 * carousel, on the champagne band. Used wherever a page shows a curated row.
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
  /** Champagne band behind the strip; off for strips already inside one. */
  band?: boolean;
}) {
  if (!products.length) return null;

  return (
    <section
      className={
        band
          ? "bg-champagne-soft py-16 mb-20 max-md:py-12 max-md:mb-14"
          : "py-4 pb-20 max-md:pb-14"
      }
    >
      <ScrollReveal>
        <p className="section-label text-[11px] tracking-[0.2em] uppercase text-accent mb-8 px-[52px] max-md:px-6">
          {label}
        </p>
      </ScrollReveal>
      <DragCarousel
        ariaLabel={ariaLabel}
        className="snap-proximity gap-4 px-[52px] max-md:px-6 max-md:gap-3 max-md:snap-mandatory"
      >
        {products.map((p, i) => (
          <ScrollReveal
            key={p.id}
            className="flex-none w-[calc((100vw-152px)/4)] max-md:w-[78vw] snap-center"
            delay={i * 0.08}
          >
            <ProductCard product={p} priority={i < 3} />
          </ScrollReveal>
        ))}
      </DragCarousel>
    </section>
  );
}
