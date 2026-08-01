import type { Product } from "@/lib/types";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return (
      <div className="py-20 text-center border border-black/[0.08]">
        <p className="font-serif text-2xl">Nothing matches these filters</p>
        <p className="mt-2 text-dim text-[12px] tracking-[0.14em] uppercase">
          Anything can be sourced — enquire on WhatsApp
        </p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-12 gap-5 max-md:gap-4">
      {products.map((p, i) => (
        <div key={p.id} className="col-span-4 max-md:col-span-12">
          <ProductCard product={p} priority={i < 3} />
        </div>
      ))}
    </div>
  );
}
