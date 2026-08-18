import { NextResponse } from "next/server";
import {
  DEFAULT_CONFIG,
  SETTINGS,
  resolveForSetting,
  resolveForShape,
  setting,
  type RingConfig,
} from "@/lib/ring/config";
import { SHAPES, stoneSizeMm } from "@/lib/ring/shapes";
import { RING_SIZES, ringSize } from "@/lib/ring/sizes";
import { ringSpecLines, ringSpecText } from "@/lib/ring/spec";
import { settingPhoto, shapePhoto } from "@/lib/ring/photos";
import { compositePhoto } from "@/lib/ring/composites";
import { buildRingSpecUrl } from "@/lib/whatsapp";

/**
 * A smoke test for everything the builder gets wrong silently.
 *
 * The geometry checks that used to live here went with the 3D. What remains is
 * the part that still fails invisibly: a size table that drifts, a carat
 * conversion that stops matching the trade, a compatibility rule that dead-ends
 * the pickers, or a specification that quietly drops the engraving. None of
 * those look wrong on screen — they look entirely normal and are simply
 * incorrect, which is exactly the class of bug worth asserting.
 */

type Issue = { where: string; problem: string };

export async function GET() {
  const issues: Issue[] = [];

  // --- UK ring sizes: monotonic, and anchored to a published chart ---------
  const sizes = RING_SIZES.map((s) => s.diameterMm);
  for (let i = 1; i < sizes.length; i++) {
    if (sizes[i] <= sizes[i - 1]) {
      issues.push({ where: "sizes", problem: `not monotonic at ${RING_SIZES[i].label}` });
      break;
    }
  }
  const L = ringSize("L")!;
  if (Math.abs(L.diameterMm - 16.41) > 0.05) {
    issues.push({ where: "sizes", problem: `UK L is ${L.diameterMm}mm, expected ~16.41` });
  }
  if (!RING_SIZES.some((s) => s.label === "L½")) {
    issues.push({ where: "sizes", problem: "half sizes are not written with ½" });
  }

  // --- carat to millimetres, against the published trade table -------------
  const caratTable = [
    { ct: 0.25, mm: 4.09 }, { ct: 0.5, mm: 5.16 }, { ct: 1.0, mm: 6.5 },
    { ct: 1.5, mm: 7.44 }, { ct: 2.0, mm: 8.19 }, { ct: 3.0, mm: 9.37 },
  ];
  const caratCheck = caratTable.map(({ ct, mm }) => {
    const got = stoneSizeMm("round", ct).widthMm;
    if (Math.abs(got - mm) > 0.06) {
      issues.push({ where: "carat", problem: `${ct}ct -> ${got.toFixed(2)}mm, table says ${mm}` });
    }
    return { ct, expectedMm: mm, gotMm: +got.toFixed(2) };
  });

  // --- compatibility never dead-ends, and always settles -------------------
  // Every shape must be reachable from every setting and vice versa, in one
  // pass. A fallback that itself failed the check would leave the two pickers
  // ping-ponging against each other.
  for (const s of SETTINGS) {
    for (const shp of SHAPES) {
      const r1 = resolveForShape(s.id, shp.id);
      if (!setting(r1.setting).supports.includes(shp.id)) {
        issues.push({
          where: `resolve ${s.id}+${shp.id}`,
          problem: `landed on ${r1.setting}, which still cannot hold it`,
        });
      }
      const r2 = resolveForSetting(s.id, shp.id);
      if (!s.supports.includes(r2.shape)) {
        issues.push({
          where: `resolve ${s.id}+${shp.id}`,
          problem: `landed on ${r2.shape}, which it still cannot hold`,
        });
      }
    }
  }

  // --- artwork coverage ----------------------------------------------------
  // Not a failure — tiles fall back to their label — but the gap is worth
  // surfacing rather than discovering by scrolling.
  const missingSettings = SETTINGS.filter((s) => !settingPhoto(s.id)).map((s) => s.id);
  const missingShapes = SHAPES.filter((s) => !shapePhoto(s.id)).map((s) => s.id);
  let missingComposites = 0;
  for (const s of SETTINGS) {
    for (const shp of s.supports) {
      if (shp === "round") continue; // base photographs already show a round
      if (!compositePhoto(s.id, shp)) missingComposites++;
    }
  }

  // --- the chain: selections -> specification -> WhatsApp ------------------
  // The builder is client-rendered, so this is where the handoff gets
  // exercised. A spec that drops the engraving, or writes the abbreviation ISO
  // 18323 prohibits, would look fine on screen and be wrong in the message that
  // reaches the bench.
  const sample: RingConfig = {
    setting: "halo", shape: "oval", carat: 1.5, origin: "laboratory-grown",
    quality: "exceptional", headMetal: "18ct-white", bandMetal: "18ct-rose",
    size: "L-half", engraving: "12.09.26",
  };
  const specLines = ringSpecLines(sample);
  const specText = ringSpecText(sample, "https://alpoelondon.com/ring-builder?x=1");
  const waUrl = buildRingSpecUrl(specText);

  for (const token of ["Halo", "1.50ct", "Oval", "Laboratory-Grown", "L½", "12.09.26", "750"]) {
    if (!specText.includes(token)) {
      issues.push({ where: "spec", problem: `"${token}" missing from the specification` });
    }
  }
  if (!specText.includes("Head:") || !specText.includes("Band:")) {
    issues.push({ where: "spec", problem: "two-tone not split into head and band" });
  }
  if (/lab[\s-]?grown|lab[\s-]?created|cultured/i.test(specText)) {
    issues.push({ where: "spec", problem: "prohibited abbreviation in the specification" });
  }
  if (!waUrl.startsWith("https://wa.me/") || !waUrl.includes("text=")) {
    issues.push({ where: "whatsapp", problem: "handoff URL malformed" });
  }

  // An unknown ring size must read as unknown rather than silently defaulting
  // to a number the customer never chose.
  const unsized = ringSpecLines({ ...DEFAULT_CONFIG }).find((l) => l.label === "Ring size");
  if (!unsized?.value.toLowerCase().includes("not known")) {
    issues.push({ where: "spec", problem: "unknown ring size does not say so" });
  }

  return NextResponse.json(
    {
      ok: issues.length === 0,
      issues,
      caratCheck,
      artwork: {
        settings: `${SETTINGS.length - missingSettings.length}/${SETTINGS.length}`,
        shapes: `${SHAPES.length - missingShapes.length}/${SHAPES.length}`,
        compositesOutstanding: missingComposites,
        missingSettings,
        missingShapes,
      },
      chain: { specLines, specText, whatsappUrl: waUrl.slice(0, 90) + "…" },
    },
    { status: issues.length === 0 ? 200 : 500 },
  );
}
