"use client";

import { useState, type FormEvent } from "react";
import { buildGeneralWhatsAppUrl } from "@/lib/whatsapp";

export type EnquiryField = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "textarea" | "select";
  options?: string[];
  required?: boolean;
  placeholder?: string;
  /** Half-width on desktop so two fields share a row. */
  half?: boolean;
};

/**
 * Collects details, composes them into a readable WhatsApp message and hands
 * off to wa.me. Nothing is stored or posted anywhere — the enquiry travels
 * with the customer into their own WhatsApp thread.
 */
export default function EnquiryForm({
  fields,
  intro,
  submitLabel = "Send on WhatsApp",
  note,
}: {
  fields: EnquiryField[];
  intro: string;
  submitLabel?: string;
  note?: string;
}) {
  const [sent, setSent] = useState(false);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const lines = fields
      .map((f) => {
        const v = String(data.get(f.name) ?? "").trim();
        return v ? `${f.label}: ${v}` : null;
      })
      .filter(Boolean);

    const message = `${intro}\n\n${lines.join("\n")}`;
    // Opened from inside the submit handler so it counts as a user gesture.
    window.open(buildGeneralWhatsAppUrl(message), "_blank", "noopener,noreferrer");
    setSent(true);
  }

  const inputClass =
    "w-full bg-transparent border border-black/15 px-4 py-3 text-[14px] text-fg outline-none transition focus:border-accent placeholder:text-dim/70";

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
      {fields.map((f) => (
        <label
          key={f.name}
          className={`flex flex-col gap-2 ${f.half ? "col-span-1" : "col-span-2 max-md:col-span-1"}`}
        >
          <span className="text-[10px] tracking-[0.18em] uppercase text-dim">
            {f.label}
            {f.required ? " *" : ""}
          </span>
          {f.type === "textarea" ? (
            <textarea
              name={f.name}
              required={f.required}
              rows={4}
              placeholder={f.placeholder}
              className={`${inputClass} resize-y`}
            />
          ) : f.type === "select" ? (
            <select name={f.name} required={f.required} defaultValue="" className={inputClass}>
              <option value="" disabled>
                Select…
              </option>
              {f.options?.map((o) => (
                <option key={o} value={o} className="bg-bg">
                  {o}
                </option>
              ))}
            </select>
          ) : (
            <input
              name={f.name}
              type={f.type ?? "text"}
              required={f.required}
              placeholder={f.placeholder}
              className={inputClass}
            />
          )}
        </label>
      ))}

      <div className="col-span-2 flex flex-col gap-3 max-md:col-span-1">
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-3 bg-accent px-8 py-4 font-serif text-[18px] uppercase tracking-[0.08em] text-bg transition hover:brightness-110 cursor-pointer"
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" fill="currentColor">
            <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 2.1.55 4.15 1.6 5.96L2 22l4.25-1.11a9.9 9.9 0 0 0 5.79 1.84h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.02A9.87 9.87 0 0 0 12.04 2Zm0 18.07h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-2.52.66.67-2.46-.2-.31a8.18 8.18 0 0 1-1.26-4.39c0-4.53 3.69-8.22 8.22-8.22 2.2 0 4.26.86 5.82 2.41a8.19 8.19 0 0 1 2.41 5.82c0 4.53-3.69 8.22-8.22 8.22Zm4.52-6.15c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.56.12-.16.25-.64.8-.78.96-.14.16-.29.18-.53.06-.25-.12-1.04-.38-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.12-.15.16-.25.24-.41.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.83-.2-.48-.4-.42-.56-.42l-.48-.01a.92.92 0 0 0-.67.31c-.23.25-.88.86-.88 2.09 0 1.24.9 2.43 1.03 2.6.13.17 1.77 2.7 4.3 3.79.6.26 1.07.41 1.44.53.6.19 1.15.17 1.59.1.49-.07 1.5-.61 1.71-1.2.21-.58.21-1.08.14-1.2-.06-.12-.22-.19-.47-.31Z" />
          </svg>
          {submitLabel}
        </button>
        <p className="text-[11px] tracking-[0.14em] uppercase text-dim" aria-live="polite">
          {sent
            ? "Opened in WhatsApp — press send to reach us."
            : (note ?? "Goes straight to our Hatton Garden team.")}
        </p>
      </div>
    </form>
  );
}
