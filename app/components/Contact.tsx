"use client";

import { useState } from "react";
import ScrollReveal from "./ScrollReveal";

export default function Contact() {
  const [open, setOpen] = useState(false);

  return (
    <section
      id="contact"
      className="px-[52px] border-t border-white/[0.05] max-md:px-6"
    >
      <ScrollReveal>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="w-full flex items-center justify-between py-8 cursor-pointer text-left"
        >
          <span className="text-[16px] tracking-[0.2em] uppercase text-accent">
            Get in touch
          </span>
          <span className="text-[16px] tracking-[0.2em] uppercase text-dim">
            {open ? "−" : "+"}
          </span>
        </button>
      </ScrollReveal>

      <div
        className={`grid transition-all duration-500 ease-out ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="text-center pb-14 pt-4">
            <a
              className="text-[15px] text-dim no-underline border-b border-white/20 pb-[3px] tracking-[0.04em]"
              href="mailto:info@alpoelondon.com"
            >
              info@alpoelondon.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
