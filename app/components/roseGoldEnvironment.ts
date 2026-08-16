import * as THREE from "three";

/**
 * A rose gold world for the lockup to reflect.
 *
 * At metalness 1 a surface has no diffuse colour at all: everything visible is
 * reflection, and the material's base colour only tints it. Lit by three's
 * RoomEnvironment — white and grey panels — the mark therefore reflected a
 * neutral room and read as chrome from most angles, however warm the base
 * colour was. Blender never had this problem because it was reflecting a real
 * HDRI with warmth in it.
 *
 * So the fix is to tint what it reflects rather than the metal itself. This
 * builds an equirectangular gradient in the house rose golds, from a warm
 * highlight overhead through the mid metal to a deep shadow below, plus a
 * bright band near the horizon that gives the bevels something to catch as the
 * model turns. Every reflection then carries the hue at every angle.
 *
 * Drawn to a canvas rather than shipped as an HDRI: it costs no request, and a
 * smooth gradient is exactly what a small mark wants — a detailed environment
 * would only show up as noise across letterforms this size.
 */
export function createRoseGoldEnvironment(renderer: THREE.WebGLRenderer) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d")!;

  // Top of the image is straight up in an equirectangular map, bottom straight
  // down, so this reads as sky-to-ground.
  const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
  sky.addColorStop(0.0, "#fff1e4"); // warm highlight overhead
  sky.addColorStop(0.32, "#e8b494"); // pale rose
  sky.addColorStop(0.5, "#c48a6f"); // the house metal, at the horizon
  sky.addColorStop(0.72, "#7c4a34"); // shadowed underside
  sky.addColorStop(1.0, "#2a1a13"); // deep ground
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // A soft bright band just above the horizon, the way a studio strip light
  // sits. This is what travels across the bevels as the mark rotates, so the
  // highlight reads as movement rather than a static sheen.
  const strip = ctx.createLinearGradient(0, canvas.height * 0.34, 0, canvas.height * 0.52);
  strip.addColorStop(0, "rgba(255,255,255,0)");
  strip.addColorStop(0.5, "rgba(255,240,228,0.85)");
  strip.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = strip;
  ctx.fillRect(0, canvas.height * 0.34, canvas.width, canvas.height * 0.18);

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;

  const pmrem = new THREE.PMREMGenerator(renderer);
  const target = pmrem.fromEquirectangular(texture);

  texture.dispose();
  pmrem.dispose();

  // Caller owns the render target and must dispose it on unmount.
  return target;
}
