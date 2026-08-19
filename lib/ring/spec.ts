import { metal } from "./metals";
import { shape, stoneSizeMm } from "./shapes";
import { ringSize } from "./sizes";
import { ORIGINS, quality, type RingConfig } from "./config";
import { band } from "./bands";
import { head } from "./heads";

/**
 * A ring configuration, written out the way the workshop needs to read it.
 *
 * This is the actual deliverable of the whole builder. The 3D is what makes
 * someone want the ring; this is what lets a bench make it. So it is written
 * in trade terms, in millimetres, and it says plainly where the customer was
 * unsure rather than inventing a value to fill the field.
 *
 * Two wording rules are load-bearing. "Laboratory-grown" is never abbreviated —
 * ISO 18323 prohibits "lab grown" outright and the ASA has upheld complaints on
 * exactly that point. And the carat quoted is the CENTRE STONE, not total
 * weight: a halo's melee bundled into one "1.30ct" figure reads as a bigger
 * stone than the customer is getting, which is the sort of thing that ends in a
 * refund. Total weight goes on its own line when there is melee.
 */

export type SpecLine = { label: string; value: string };

export function ringSpecLines(config: RingConfig): SpecLine[] {
  const b = band(config.band);
  const h = head(config.head);
  const sh = shape(config.shape);
  const q = quality(config.quality);
  const origin = ORIGINS.find((o) => o.id === config.origin)!;
  const { widthMm, lengthMm } = stoneSizeMm(config.shape, config.carat);

  const lines: SpecLine[] = [];

  // Two lines rather than one, because the bench builds them as two parts. A
  // combined "Cathedral Pavé Hidden Halo" reads as a catalogue name for a thing
  // that has one, and most of these combinations do not.
  lines.push({ label: "Band", value: b.label });
  lines.push({ label: "Head", value: h.label });

  // Two-tone is worth spelling out; matched metals read better as one line.
  if (config.headMetal === config.bandMetal) {
    lines.push({ label: "Metal", value: metal(config.bandMetal).label });
  } else {
    lines.push({ label: "Head metal", value: metal(config.headMetal).label });
    lines.push({ label: "Band metal", value: metal(config.bandMetal).label });
  }

  const dims =
    sh.lengthToWidth === 1
      ? `${widthMm.toFixed(1)}mm`
      : `${lengthMm.toFixed(1)} × ${widthMm.toFixed(1)}mm`;
  lines.push({
    label: "Diamond",
    value: `${config.carat.toFixed(2)}ct ${sh.label} — approx. ${dims}`,
  });

  // Melee is quoted as a count-and-note rather than folded into the centre
  // weight. See the rule at the top of this file — a halo's small stones added
  // into one figure reads as a bigger centre stone than the customer is buying.
  if (b.set || h.melee) {
    const from = [b.set && "band", h.melee && "head"].filter(Boolean).join(" and ");
    lines.push({
      label: "Melee",
      value: `Additional diamonds in the ${from} — total weight confirmed at CAD`,
    });
  }

  lines.push({ label: "Origin", value: origin.label });

  lines.push({
    label: "Quality",
    value: config.origin === "laboratory-grown" ? q.laboratoryGrown : q.natural,
  });

  const size = ringSize(config.size);
  lines.push({
    label: "Ring size",
    value: size
      ? `UK ${size.label} — ${size.diameterMm.toFixed(2)}mm inside diameter`
      : "Not known yet — happy to be measured in store",
  });

  if (config.engraving.trim()) {
    lines.push({ label: "Engraving", value: `"${config.engraving.trim()}"` });
  }

  // Hallmarking is not optional in the UK and no engagement ring is ever light
  // enough to be exempt, so the fineness belongs in the spec rather than in
  // small print somewhere else.
  lines.push({
    label: "Hallmark",
    value: `${metal(config.bandMetal).hallmark}, London Assay Office`,
  });

  return lines;
}

export function ringSpecText(config: RingConfig, url?: string): string {
  const lines = ringSpecLines(config)
    .map((l) => `${l.label}: ${l.value}`)
    .join("\n");
  const link = url ? `\n\n${url}` : "";
  return `Bespoke ring enquiry — Alpoe London\n\n${lines}${link}`;
}
