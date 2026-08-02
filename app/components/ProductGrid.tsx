import type { Product } from "@/lib/types";
import { hasPhotography } from "@/lib/products";
import { buildEnquiryUrl } from "@/lib/whatsapp";
import ProductCard from "./ProductCard";
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
      <div className="py-20 text-center border border-black/[0.08]">
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
        <div className="grid grid-cols-12 gap-5 max-md:gap-4">
          {shot.map((p, i) => (
            <div key={p.id} className="col-span-4 max-md:col-span-12">
              <ProductCard product={p} priority={i < 3} />
            </div>
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
