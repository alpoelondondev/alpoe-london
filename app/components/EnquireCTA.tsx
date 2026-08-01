"use client";

import type { Product } from "@/lib/types";
import { buildEnquiryUrl } from "@/lib/whatsapp";

export default function EnquireCTA({
  product,
  bracelet,
}: {
  product: Product;
  bracelet?: string;
}) {
  const href = buildEnquiryUrl(product, bracelet ? { bracelet } : undefined);
  return (
    <div className="flex flex-col gap-3 mt-8">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-3 bg-accent text-bg font-serif tracking-[0.08em] text-[18px] py-4 px-8 uppercase hover:brightness-110 transition"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 2.1.55 4.15 1.6 5.96L2 22l4.25-1.11a9.9 9.9 0 0 0 5.79 1.84h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.02A9.87 9.87 0 0 0 12.04 2Zm0 18.07h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-2.52.66.67-2.46-.2-.31a8.18 8.18 0 0 1-1.26-4.39c0-4.53 3.69-8.22 8.22-8.22 2.2 0 4.26.86 5.82 2.41a8.19 8.19 0 0 1 2.41 5.82c0 4.53-3.69 8.22-8.22 8.22Zm4.52-6.15c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.96-.14.16-.29.18-.53.06-.25-.12-1.04-.38-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.12-.15.16-.25.24-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.83-.2-.48-.4-.42-.56-.42l-.48-.01a.92.92 0 0 0-.67.31c-.23.25-.88.86-.88 2.09 0 1.24.9 2.43 1.03 2.6.13.17 1.77 2.7 4.3 3.79.6.26 1.07.41 1.44.53.6.19 1.15.17 1.59.1.49-.07 1.5-.61 1.71-1.2.21-.58.21-1.08.14-1.2-.06-.12-.22-.19-.47-.31Z" />
        </svg>
        Enquire on WhatsApp
      </a>
      <p className="text-[11px] tracking-[0.14em] uppercase text-dim">
        Instant reply · Monday–Saturday · Hatton Garden showroom
      </p>
    </div>
  );
}
