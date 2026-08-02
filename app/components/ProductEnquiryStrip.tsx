import ScrollReveal from "./ScrollReveal";
import EnquiryForm, { type EnquiryField } from "./EnquiryForm";
import type { Product } from "@/lib/types";

/**
 * Bottom-of-page enquiry strip. The piece being viewed is baked into the
 * WhatsApp intro so we always know what the enquiry is about.
 */
export default function ProductEnquiryStrip({ product }: { product: Product }) {
  const name = product.referenceNumber
    ? `${product.title} (Ref: ${product.referenceNumber})`
    : product.title;

  const fields: EnquiryField[] = [
    { name: "name", label: "Name", required: true, half: true, placeholder: "Your name" },
    {
      name: "contact",
      label: "Phone or Email",
      required: true,
      half: true,
      placeholder: "How we reach you",
    },
    {
      name: "intent",
      label: "What do you need?",
      type: "select",
      required: true,
      half: true,
      options: [
        "Price and availability",
        "More photos or video",
        "Reserve this piece",
        "Part-exchange against this",
        "Book a viewing",
      ],
    },
    { name: "budget", label: "Budget (optional)", half: true, placeholder: "e.g. £8,000–£12,000" },
    {
      name: "details",
      label: "Anything else",
      type: "textarea",
      placeholder: "Bracelet preference, sizing, timescales…",
    },
  ];

  return (
    <section
      id="enquire"
      className="bg-champagne-soft px-[52px] py-20 max-md:px-6 max-md:py-14"
    >
      <ScrollReveal>
        <p className="text-center text-[11px] tracking-[0.2em] uppercase text-accent">
          Enquire
        </p>
        <h2 className="mx-auto mt-3 max-w-2xl text-center font-serif text-[clamp(26px,3.4vw,42px)] leading-tight">
          Ask about the {product.model ?? product.title}
        </h2>
        <p className="mx-auto mt-3 mb-10 max-w-xl text-center text-[14px] leading-relaxed text-dim">
          Fill this in and it opens WhatsApp with this piece and your details already
          written out — just press send.
        </p>
        <div className="mx-auto max-w-3xl">
          <EnquiryForm
            fields={fields}
            intro={`Hi Alpoe, I'm interested in the ${name}.`}
            submitLabel="Send Enquiry"
            note="Straight to our Hatton Garden team — usually a same-day reply."
          />
        </div>
      </ScrollReveal>
    </section>
  );
}
