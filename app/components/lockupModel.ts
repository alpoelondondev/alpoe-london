/**
 * The one place the lockup model's URL is written down.
 *
 * The nav's Monogram3D and the /ourbrand viewer load the same GLB, and each
 * used to declare the path itself. That is harmless right up until the mesh is
 * re-exported and one of them is left describing a file that no longer looks
 * the way the comment above it claims.
 *
 * The ?v= is a cache buster, not decoration. Files under public/ are served
 * with a long max-age once deployed, so re-exporting the GLB under an
 * unchanged URL leaves returning visitors on the mesh they already cached —
 * the new mark on a fresh browser, the old one on everybody else's, which is
 * the worst of both. Bump MODEL_REVISION whenever alpoe-lockup.glb is
 * re-exported from Blender and the change is meant to be seen.
 */

/** Bump on every re-export of alpoe-lockup.glb. */
export const MODEL_REVISION = "2026-08-18-corrected-a";

export const LOCKUP_MODEL_URL = `/models/alpoe-lockup.glb?v=${MODEL_REVISION}`;
