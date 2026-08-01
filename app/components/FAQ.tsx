"use client";

import { useState } from "react";
import ScrollReveal from "./ScrollReveal";
import type { FaqItem } from "@/lib/faqs";

function FaqCard({ item }: { item: FaqItem }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-white/[0.06] bg-white/[0.02] h-fit">
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
      className="px-[52px] py-20 border-t border-white/[0.05] max-md:px-6 max-md:py-14"
    >
      <h2 className="sr-only">Frequently Asked Questions</h2>
      <ScrollReveal>
        <div className="grid grid-cols-2 gap-4 items-start max-md:grid-cols-1">
          {items.map((item) => (
            <FaqCard key={item.question} item={item} />
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
