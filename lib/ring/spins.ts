import type { SettingId } from "./config";


/**
 * 360° spin sequences — the real ring, photographed all the way round.
 *
 * This is how the whole category does drag-to-rotate on real jewellery, and it
 * is worth being clear that there is nothing clever about it: it is a flipbook.
 * Put the ring on a turntable, photograph it every ten degrees, and swap frames
 * as the pointer moves. Every frame is a photograph, so it looks perfect,
 * because it is.
 *
 * What we deliberately did NOT do:
 *
 *   Photogrammetry (Meshroom, COLMAP) reconstructs geometry by matching
 *   features between frames. Polished metal and a refractive diamond are close
 *   to the worst possible subject for it — the highlights move as the camera
 *   moves, so there is nothing stable to match on. It fails on exactly the
 *   thing we would be pointing it at.
 *
 *   Image-to-3D models will produce a mesh from a single photograph, but they
 *   smooth away claw tips, facet edges and millgrain — the details that make
 *   jewellery read as jewellery. The result would be worse than the geometry
 *   we already generate.
 *
 * So: spin photography for rings that physically exist, and the procedural 3D
 * for the customer's own configuration, which no photograph can ever show
 * because the ring has not been made yet.
 *
 * ── Shooting ──
 *
 *   public/ring-builder/spin/{settingId}/000.jpg … 035.jpg
 *
 * Thirty-six frames, one every 10°, zero-padded to three digits and numbered
 * from the front-on view. Fixed camera, fixed lighting, white sweep — the same
 * setup as the stills, so a spin and a still of the same ring match. Rotate the
 * ring about the vertical axis, as worn.
 *
 * Frames can be modest: the competition ships 573×421 at around 6 KB each. At
 * 900px square and sensible compression a sequence is roughly 3 MB, which is
 * why they are only fetched when someone actually asks to spin.
 */

/** Settings we have a full sequence for. Everything else uses the still. */
const SPINS: Partial<Record<SettingId, true>> = {
  // solitaire: true,
};

export const SPIN_FRAMES = 36;

export function hasSpin(id: SettingId): boolean {
  return Boolean(SPINS[id]);
}

/**
 * Frame URLs for a setting, in order.
 *
 * Not content-hashed, unlike the stills, because these are plain <img> tags
 * rather than next/image and a re-shoot would mean 36 new files. If a sequence
 * is ever re-shot, bump the folder name — `spin/solitaire-2/` — rather than
 * overwriting in place, or the year-long cache will hold the old turn.
 */
export function spinFrames(id: SettingId): string[] {
  if (!hasSpin(id)) return [];
  return Array.from(
    { length: SPIN_FRAMES },
    (_, i) => `/ring-builder/spin/${id}/${String(i).padStart(3, "0")}.jpg`,
  );
}
