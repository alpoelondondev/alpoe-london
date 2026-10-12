import type { Product } from "@/lib/types";
import { buildEnquiryUrl } from "@/lib/whatsapp";

/**
 * The price row on a product page. Every piece is priced on request, so the
 * row is the question a buyer has at that moment — tapping it opens WhatsApp
 * with this piece named and the price asked for.
 */
export default function PriceEnquiry({ product }: { product: Product }) {
  return (
    <a
      href={buildEnquiryUrl(product, { ask: "price" })}
      target="_blank"
      rel="noopener noreferrer"
      className="group mt-8 flex items-center justify-between border-y border-fg/[0.14] py-4"
    >
      <span className="text-[11px] tracking-[0.18em] uppercase text-dim">Price</span>
      <span className="flex flex-col items-end gap-1">
        <span className="font-serif text-2xl tracking-[0.02em]">On Request</span>
        <span className="text-[11px] tracking-[0.14em] uppercase text-accent transition-colors group-hover:text-blush">
          Get the price on WhatsApp
        </span>
      </span>
    </a>
  );
}
