import type { SettingId } from "./config";
import type { ShapeId } from "./shapes";
import { PHOTO_FILES } from "./generated/photo-manifest";

/**
 * Setting × shape composites — the setting photograph with the chosen stone in
 * place.
 *
 * This exists because of a real gap. The setting photographs are all shot with
 * the same one-carat round, which is right for comparing settings but wrong the
 * moment somebody picks a marquise: the tile still shows a round, so the
 * picture and the specification disagree.
 *
 * Photography cannot close it. Seventeen settings across eight shapes is 136
 * rings, none of which exist — you would have to manufacture every one before
 * you could photograph it. That is the same wall the whole builder was designed
 * around.
 *
 * Image-to-image generation can, because the job is not "invent a ring" but
 * "take this exact photograph and change one element", which is what these
 * models are actually good at. The base image stays the real photographed
 * setting; only the stone changes.
 *
 * Everything here degrades cleanly. A missing composite falls back to the plain
 * setting photograph, exactly as a missing photograph falls back to the live
 * render. The builder works today, works better with each image that lands, and
 * never breaks in between.
 */

export function compositeKey(settingId: SettingId, shapeId: ShapeId): string {
  return `${settingId}-${shapeId}`;
}

/**
 * The composite for a pair, if it has been generated.
 *
 * Round is deliberately absent from the lookup rather than generated: the base
 * photographs already show a round stone, so a composite would be a
 * regenerated copy of an image we already have — worse, and 17 wasted
 * generations.
 */
export function compositePhoto(
  settingId: SettingId,
  shapeId: ShapeId,
): string | undefined {
  if (shapeId === "round") return undefined;
  const file = PHOTO_FILES[`composites/${compositeKey(settingId, shapeId)}`];
  return file ? `/ring-builder/composites/${file}` : undefined;
}

/**
 * The prompt for one composite.
 *
 * Written to constrain rather than describe. The failure mode with image
 * editing is a model that helpfully "improves" the lighting, reframes the
 * shot, or restyles the band — which would make tile 4 not match tile 5 and
 * destroy the grid as a comparison. So the prompt is mostly a list of things
 * that must not change, and the shape is the only variable.
 */
export function compositePrompt(settingLabel: string, shapeLabel: string): string {
  return [
    `Replace only the centre diamond in this engagement ring photograph with a ${shapeLabel.toLowerCase()} cut diamond of the same carat weight.`,
    "",
    "Keep absolutely everything else identical:",
    "- the same camera angle, framing, crop and scale",
    "- the same lighting, reflections and shadows",
    "- the same metal colour and finish",
    `- the same ${settingLabel.toLowerCase()} setting, band width and profile`,
    "- the same ALPOE LONDON engraving inside the shank",
    "- the same pure white background",
    "",
    `Adjust only the claws or setting where they must physically grip a ${shapeLabel.toLowerCase()} stone rather than a round one — a pointed stone needs a claw at each point.`,
    "Photorealistic product photography. Do not restyle, recolour, reframe or relight.",
  ].join("\n");
}
