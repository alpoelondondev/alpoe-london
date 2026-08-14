"use client";

import { useState } from "react";
import ScrollReveal from "./ScrollReveal";
import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";
import type { FaqItem } from "@/lib/faqs";

function FaqCard({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-fg/[0.10] bg-fg/[0.04] h-fit">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-6 px-6 py-5 cursor-pointer text-left"
      >
        <span className="font-serif text-[17px] tracking-[0.03em] leading-snug">
          {item.question}
        </span>
        <span className="text-[15px] tracking-[0.2em] text-dim shrink-0">
          {open ? "−" : "+"}
        </span>
      </button>
      <div
        className={`grid transition-all duration-400 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-6 text-[14px] leading-[1.8] text-dim">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ({ items }: { items: FaqItem[] }) {
  return (
    <section
      id="faq"
      className="bg-panel-soft px-[52px] py-20 max-md:px-6 max-md:py-14"
    >
      <ScrollReveal>
        <h2 className="font-serif text-[clamp(34px,4.5vw,60px)] tracking-[0.02em] leading-none text-accent text-center mb-12">
          FAQS
        </h2>
      </ScrollReveal>
      <ScrollReveal>
        <div className="grid grid-cols-2 gap-4 items-start max-md:grid-cols-1">
          {items.map((item) => (
            <FaqCard key={item.question} item={item} />
          ))}
        </div>
      </ScrollReveal>
      <ScrollReveal>
        <div className="mt-10 flex flex-col items-center gap-3">
          <a
            href={buildGeneralWhatsAppUrl(
              "Hi Alpoe, I have a question about...",
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-accent text-bg font-serif tracking-[0.08em] text-[18px] py-4 px-8 uppercase hover:brightness-110 transition"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 2.1.55 4.15 1.6 5.96L2 22l4.25-1.11a9.9 9.9 0 0 0 5.79 1.84h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.02A9.87 9.87 0 0 0 12.04 2Zm0 18.07h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-2.52.66.67-2.46-.2-.31a8.18 8.18 0 0 1-1.26-4.39c0-4.53 3.69-8.22 8.22-8.22 2.2 0 4.26.86 5.82 2.41a8.19 8.19 0 0 1 2.41 5.82c0 4.53-3.69 8.22-8.22 8.22Zm4.52-6.15c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.96-.14.16-.29.18-.53.06-.25-.12-1.04-.38-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.12-.15.16-.25.24-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.83-.2-.48-.4-.42-.56-.42l-.48-.01a.92.92 0 0 0-.67.31c-.23.25-.88.86-.88 2.09 0 1.24.9 2.43 1.03 2.6.13.17 1.77 2.7 4.3 3.79.6.26 1.07.41 1.44.53.6.19 1.15.17 1.59.1.49-.07 1.5-.61 1.71-1.2.21-.58.21-1.08.14-1.2-.06-.12-.22-.19-.47-.31Z" />
            </svg>
            Ask a Question
          </a>
        </div>
      </ScrollReveal>
    </section>
  );
}
