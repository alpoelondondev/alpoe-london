"use client";

import { useState } from "react";
import ScrollReveal from "./ScrollReveal";

export default function Contact() {
  const [open, setOpen] = useState(false);

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="px-[52px] border-t border-fg/[0.10] max-md:px-6"
    >
      {/*
        A section heading that is announced rather than drawn.

        The homepage's design has no visible headline over these bands, which
        left the document outline running h1 straight to h3 and left three
        whole sections with no name at all — a screen-reader user landing in
        the middle of the page had nothing telling them what they were in. It
        also meant the page said nothing, in heading text, about the things it
        exists to sell. This is the standard fix for a section whose identity
        is carried by a picture: state it for the readers who cannot see it.
      */}
      <h2 id="contact-heading" className="sr-only">
        Contact Alpoe London in Hatton Garden
      </h2>
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
