import { SITE } from "./site";
import type { Product } from "./types";

export type EnquiryOptions = {
  bracelet?: string;
};

function normalisePhone(n: string) {
  return n.replace(/[^\d]/g, "");
}

export function buildEnquiryMessage(product: Product, opts?: EnquiryOptions): string {
  const name = product.nickname
    ? `${product.brand ?? ""} ${product.model ?? ""} "${product.nickname}"`.trim()
    : product.title;
  const ref = product.referenceNumber ? ` (Ref: ${product.referenceNumber})` : "";
  const bracelet = opts?.bracelet?.trim();
  const braceletSuffix = bracelet ? ` on ${bracelet} bracelet` : "";
  return `Hi, I'm interested in the ${name}${ref}${braceletSuffix}. Is it available?`;
}

export function buildEnquiryUrl(product: Product, opts?: EnquiryOptions): string {
  const number = normalisePhone(SITE.whatsapp);
  const text = encodeURIComponent(buildEnquiryMessage(product, opts));
  return `https://wa.me/${number}?text=${text}`;
}

export function buildCatalogueEnquiryUrl(item: {
  brand: string;
  model?: string;
  variant: string;
  reference?: string;
}): string {
  const number = normalisePhone(SITE.whatsapp);
  const name = `${item.brand}${item.model ? ` ${item.model}` : ""} "${item.variant}"`.trim();
  const ref = item.reference ? ` (Ref: ${item.reference})` : "";
  const text = encodeURIComponent(`Hi, I'm interested in the ${name}${ref}. Is it available?`);
  return `https://wa.me/${number}?text=${text}`;
}

/**
 * Films have no product page behind them, so the message has to carry the piece
 * on its own — the spec is what tells the workshop which of six tennis
 * bracelets the viewer just watched.
 */
export function buildFilmEnquiryUrl(film: { title: string; spec: string }): string {
  const number = normalisePhone(SITE.whatsapp);
  const text = encodeURIComponent(
    `Hi, I'm interested in the ${film.title} (${film.spec}) from your website. Is it available?`,
  );
  return `https://wa.me/${number}?text=${text}`;
}

/**
 * A ring built in the Custom Studio.
 *
 * The message carries the full written specification rather than a product
 * name, because there is no product — the workshop is being handed a brief. The
 * link matters as much as the text: the configuration lives entirely in the URL,
 * so whoever picks this up at the counter can open it and see the exact ring on
 * screen rather than reconstructing it from a list.
 */
export function buildRingSpecUrl(spec: string): string {
  const number = normalisePhone(SITE.whatsapp);
  return `https://wa.me/${number}?text=${encodeURIComponent(spec)}`;
}

export function buildGeneralWhatsAppUrl(message?: string): string {
  const number = normalisePhone(SITE.whatsapp);
  if (!message) return `https://wa.me/${number}`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
