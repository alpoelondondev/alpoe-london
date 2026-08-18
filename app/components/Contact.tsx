"use client";

import { useState } from "react";
import ScrollReveal from "./ScrollReveal";

export default function Contact() {
  const [open, setOpen] = useState(false);

  return (
    <section
      id="contact"
      className="px-[52px] border-t border-fg/[0.10] max-md:px-6"
    >
      <ScrollReveal>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="w-full flex items-center justify-between py-8 cursor-pointer text-left"
        >
          <span className="t-eyebrow !text-accent">
            Get in touch
          </span>
          <span
            aria-hidden="true"
            className={`text-[18px] leading-none text-dim transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          >
            ↓
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
              className="text-[15px] text-dim no-underline border-b border-fg/30 pb-[3px] tracking-[0.04em]"
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
