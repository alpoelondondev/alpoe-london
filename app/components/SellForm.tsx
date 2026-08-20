"use client";

import { useState, type FormEvent } from "react";
import ScrollReveal from "./ScrollReveal";

export default function SellForm() {
  const [submitted, setSubmitted] = useState(false);
  const [open, setOpen] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section
      id="sell"
      aria-labelledby="sell-heading"
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
      <h2 id="sell-heading" className="sr-only">
        Sell your watch or jewellery to Alpoe London
      </h2>
      <ScrollReveal>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="w-full flex items-center justify-between py-8 cursor-pointer text-left"
        >
          <span className="t-eyebrow !text-accent">
            Sell with us
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
      <div className="max-w-[720px] mx-auto pb-14 pt-4">
        <ScrollReveal>
          <p className="t-copy text-center mb-12 max-w-[480px] mx-auto">
            Looking to sell or trade your luxury watch or jewellery? We offer competitive
            prices and a seamless process.{" "}
            <strong className="text-fg font-normal">
              Get a free valuation today.
            </strong>
          </p>
        </ScrollReveal>

        {submitted ? (
          <ScrollReveal>
            <div className="text-center py-20">
              <p className="font-serif text-[clamp(26px,3vw,40px)] leading-[1.05] tracking-tight mb-5">
                THANK YOU
              </p>
              <p className="t-copy">
                We&apos;ll be in touch within 24 hours with your valuation.
              </p>
            </div>
          </ScrollReveal>
        ) : (
          <ScrollReveal>
            <form onSubmit={handleSubmit} className="flex flex-col gap-0">
              {/* Name row */}
              <div className="grid grid-cols-2 max-md:grid-cols-1">
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  required
                  className="bg-transparent border-b border-r border-fg/25 px-0 py-5 text-[15px] text-fg placeholder:text-dim/60 tracking-[0.03em] outline-none focus:border-accent/40 transition-colors max-md:border-r-0"
                />
                <input
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  required
                  className="bg-transparent border-b border-fg/25 py-5 pl-6 max-md:pl-0 text-[15px] text-fg placeholder:text-dim/60 tracking-[0.03em] outline-none focus:border-accent/40 transition-colors"
                />
              </div>

              {/* Email & Phone row */}
              <div className="grid grid-cols-2 max-md:grid-cols-1">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  className="bg-transparent border-b border-r border-fg/25 px-0 py-5 text-[15px] text-fg placeholder:text-dim/60 tracking-[0.03em] outline-none focus:border-accent/40 transition-colors max-md:border-r-0"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  className="bg-transparent border-b border-fg/25 py-5 pl-6 max-md:pl-0 text-[15px] text-fg placeholder:text-dim/60 tracking-[0.03em] outline-none focus:border-accent/40 transition-colors"
                />
              </div>

              {/* Item type */}
              {/*
                A <select> whose only description is its placeholder option is
                unlabelled as far as a screen reader is concerned — it
                announces the current value and nothing about what is being
                chosen. The visible design has no room for a label, so it is
                supplied directly.
              */}
              <select
                name="itemType"
                aria-label="What are you selling?"
                required
                defaultValue=""
                className="bg-transparent border-b border-fg/25 px-0 py-5 text-[15px] text-fg tracking-[0.03em] outline-none focus:border-accent/40 transition-colors appearance-none cursor-pointer [&:invalid]:text-dim/60 [&>option]:bg-bg [&>option]:text-fg"
              >
                <option value="" disabled className="text-dim">
                  What are you selling?
                </option>
                <option value="watch">Watch</option>
                <option value="ring">Ring</option>
                <option value="chain">Chain / Necklace</option>
                <option value="bracelet">Bracelet</option>
                <option value="earrings">Earrings</option>
                <option value="other">Other Jewellery</option>
              </select>

              {/* Brand / Description */}
              <input
                type="text"
                name="brand"
                placeholder="Brand / Designer (e.g. Rolex, Cartier)"
                className="bg-transparent border-b border-fg/25 px-0 py-5 text-[15px] text-fg placeholder:text-dim/60 tracking-[0.03em] outline-none focus:border-accent/40 transition-colors"
              />

              {/* Description */}
              <textarea
                name="description"
                placeholder="Tell us about your piece — condition, age, any paperwork or boxes included"
                rows={4}
                className="bg-transparent border-b border-fg/25 px-0 py-5 text-[15px] text-fg placeholder:text-dim/60 tracking-[0.03em] outline-none focus:border-accent/40 transition-colors resize-none"
              />

              {/* Submit */}
              <button
                type="submit"
                className="mt-12 self-center border border-fg/25 px-14 py-4 text-[11px] tracking-[0.2em] uppercase text-fg rounded-full hover:bg-fg/[0.06] hover:border-accent/30 transition-all duration-500 cursor-pointer"
              >
                Request Valuation
              </button>
            </form>
          </ScrollReveal>
        )}
      </div>
        </div>
      </div>
    </section>
  );
}
