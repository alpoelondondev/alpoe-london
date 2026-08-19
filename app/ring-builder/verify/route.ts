import { NextResponse } from "next/server";
import { DEFAULT_CONFIG, type RingConfig } from "@/lib/ring/config";
import { BANDS, bandIcon } from "@/lib/ring/bands";
import { HEADS, headIcon, headsForShape, resolveHead } from "@/lib/ring/heads";
import { SHAPES, shapeIcon, stoneSizeMm } from "@/lib/ring/shapes";
import { METALS, metalIcon } from "@/lib/ring/metals";
import { RING_SIZES, ringSize } from "@/lib/ring/sizes";
import { ringSpecLines, ringSpecText } from "@/lib/ring/spec";
import { hasRenders, renderUrl } from "@/lib/ring/renders";
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

  // --- head/shape compatibility never dead-ends ----------------------------
  // Every shape must have at least one head, and switching shape must land the
  // customer on a head that actually holds the new stone in a single pass. A
  // fallback that itself failed the check would leave the pickers ping-ponging.
  for (const shp of SHAPES) {
    const allowed = headsForShape(shp.id);
    if (allowed.length === 0) {
      issues.push({ where: `shape ${shp.id}`, problem: "no head will hold it" });
      continue;
    }
    for (const h of HEADS) {
      const r = resolveHead(h.id, shp.id);
      if (!headsForShape(shp.id).includes(r.head)) {
        issues.push({
          where: `resolve ${h.id}+${shp.id}`,
          problem: `landed on ${r.head}, which still cannot hold it`,
        });
      }
    }
  }

  // Band must never constrain. The library's coverage is identical across all
  // fifteen, and heads.ts is written on that assumption — if it ever stops
  // being true, this is where it should be caught rather than in a 404.
  const coverage = SHAPES.reduce((n, s) => n + headsForShape(s.id).length, 0);
  if (coverage !== 119) {
    issues.push({
      where: "coverage",
      problem: `${coverage} shape × head pairs, library has 119`,
    });
  }

  // --- option icons --------------------------------------------------------
  // Every selectable value needs a tile picture. A missing one is not fatal —
  // the tile falls back to its label — but a rail with one blank card in it
  // reads as broken rather than as pending.
  const missingIcons = [
    ...BANDS.filter((b) => !bandIcon(b.id)).map((b) => `band/${b.id}`),
    ...HEADS.filter((h) => !headIcon(h.id)).map((h) => `head/${h.id}`),
    ...SHAPES.filter((s) => !shapeIcon(s.id)).map((s) => `shape/${s.id}`),
    ...METALS.filter((m) => !metalIcon(m.id)).map((m) => `metal/${m.id}`),
  ];
  if (missingIcons.length) {
    issues.push({
      where: "icons",
      problem: `${missingIcons.length} option tiles have no icon`,
    });
  }

  // --- render routes -------------------------------------------------------
  // Only checkable in shape, not in existence: the library is served from
  // object storage, so this asserts the route is well formed rather than that
  // the file is there. An unset NEXT_PUBLIC_RING_RENDERS_URL is a normal local
  // state, not a failure.
  const renders = { configured: hasRenders(), sample: renderUrl(DEFAULT_CONFIG) ?? null };
  if (hasRenders()) {
    const invalid = renderUrl({ ...DEFAULT_CONFIG, shape: "heart", head: "dual-halo" });
    if (invalid !== undefined) {
      issues.push({
        where: "renders",
        problem: "an unsupported head/shape pair resolved to a URL",
      });
    }
  }

  // --- the chain: selections -> specification -> WhatsApp ------------------
  // The builder is client-rendered, so this is where the handoff gets
  // exercised. A spec that drops the engraving, or writes the abbreviation ISO
  // 18323 prohibits, would look fine on screen and be wrong in the message that
  // reaches the bench.
  const sample: RingConfig = {
    band: "cathedral-pave", head: "classic-halo", shape: "oval", carat: 1.5,
    origin: "laboratory-grown", quality: "exceptional",
    headMetal: "18ct-white", bandMetal: "18ct-rose",
    size: "L-half", engraving: "12.09.26",
  };
  const specLines = ringSpecLines(sample);
  const specText = ringSpecText(sample, "https://alpoelondon.com/ring-builder?x=1");
  const waUrl = buildRingSpecUrl(specText);

  for (const token of [
    "Cathedral Pavé", "Classic Halo", "1.50ct", "Oval",
    "Laboratory-Grown", "L½", "12.09.26", "750", "Melee",
  ]) {
    if (!specText.includes(token)) {
      issues.push({ where: "spec", problem: `"${token}" missing from the specification` });
    }
  }
  if (!specText.includes("Head metal:") || !specText.includes("Band metal:")) {
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
      options: {
        bands: BANDS.length,
        heads: HEADS.length,
        shapes: SHAPES.length,
        metals: METALS.length,
        shapeHeadPairs: coverage,
        missingIcons,
      },
      renders,
      chain: { specLines, specText, whatsappUrl: waUrl.slice(0, 90) + "…" },
    },
    { status: issues.length === 0 ? 200 : 500 },
  );
}
