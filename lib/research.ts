import { RESEARCH, type ReferenceResearch } from "./generated/research-index";

// Verified spec/description data compiled from data/research/**. Keyed lookups
// used to enrich live-catalogue items into full product pages.

const refIndex = new Map<string, ReferenceResearch>();
const overviewIndex = new Map<string, string>();

for (const model of RESEARCH) {
  if (model.modelOverview) {
    overviewIndex.set(`${model.brandSlug}/${model.modelSlug}`, model.modelOverview);
  }
  for (const [ref, spec] of Object.entries(model.references ?? {})) {
    refIndex.set(`${model.brandSlug}/${ref.toLowerCase()}`, spec);
  }
}

export function getReferenceResearch(
  brandSlug: string,
  reference: string,
): ReferenceResearch | undefined {
  if (!reference) return undefined;
  return refIndex.get(`${brandSlug}/${reference.toLowerCase()}`);
}

export function getModelOverview(brandSlug: string, modelSlug: string): string | undefined {
  return overviewIndex.get(`${brandSlug}/${modelSlug}`);
}

// Prefer a variant-specific description when the researcher supplied one,
// otherwise fall back to the reference-level description.
export function getDescription(
  brandSlug: string,
  reference: string,
  variant: string,
): string | undefined {
  const spec = getReferenceResearch(brandSlug, reference);
  if (!spec) return undefined;
  const variantDesc = variant ? spec.variants?.[variant] : undefined;
  return variantDesc ?? spec.description;
}
