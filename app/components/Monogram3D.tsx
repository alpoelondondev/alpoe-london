"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { createRoseGoldEnvironment } from "./roseGoldEnvironment";
import { LOCKUP_ASPECT } from "./heroLockupShapes";
import { LOCKUP_MODEL_URL } from "./lockupModel";

/**
 * The lockup as live rose gold — a drop-in stand-in for the flat SVG in the
 * nav. It idles with a slow sway while a light orbits it, so the bevel
 * highlight travels around the letterforms: the shimmer is real reflection
 * movement, not an opacity trick.
 *
 * The mark itself is the full lockup as exported from Blender — AP monogram,
 * ALPOE LONDON and the frame rules in one Draco-compressed mesh. The URL comes
 * from lockupModel.ts, which the /ourbrand viewer reads too, so the bar and
 * that page cannot drift apart or serve different revisions.
 *
 * Deliberately lean for a header: no controls, no shadows, pixel ratio capped,
 * and the loop pauses whenever the tab is hidden. Falls back to rendering
 * nothing on failure — the <Link> around it still carries the accessible name.
 */
export default function Monogram3D({
  height = 40,
  width,
}: {
  height?: number;
  /** Defaults to height × the lockup's own aspect. */
  width?: number;
}) {
  const mountRef = useRef<HTMLDivElement>(null);
  const w = width ?? Math.round(height * LOCKUP_ASPECT);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // ACES desaturates toward white, so a hot exposure bleached the hue out
    // of the brightest specular hits.
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, w / height, 0.1, 100);

    // Shared with the /ourbrand viewer: at metalness 1 the mark's colour is
    // whatever it reflects, and RoomEnvironment's white-and-grey box turned it
    // to chrome wherever the key light wasn't hitting it.
    const envRT = createRoseGoldEnvironment(renderer);
    scene.environment = envRT.texture;

    // The orbiting key is what makes it shimmer — as it circles, the specular
    // highlight walks along the bevels.
    const key = new THREE.DirectionalLight(0xffd9c2, 1.8);
    key.position.set(2, 3, 4);
    scene.add(key);
    scene.add(new THREE.HemisphereLight(0xffe6d4, 0x2a1a13, 0.45));

    let model: THREE.Object3D | null = null;
    let raf = 0;
    let disposed = false;
    let hidden = document.hidden;

    const draco = new DRACOLoader();
    draco.setDecoderPath(
      "https://www.gstatic.com/draco/versioned/decoders/1.5.7/",
    );
    const loader = new GLTFLoader();
    loader.setDRACOLoader(draco);

    loader.load(
      LOCKUP_MODEL_URL,
      (gltf) => {
        if (disposed) return;
        model = gltf.scene;

        model.traverse((obj) => {
          const mesh = obj as THREE.Mesh;
          if (!mesh.isMesh) return;
          const mats = Array.isArray(mesh.material)
            ? mesh.material
            : [mesh.material];
          for (const m of mats) {
            const std = m as THREE.MeshStandardMaterial;
            if (!("metalness" in std)) continue;
            std.metalness = 1.0;
            std.roughness = 0.22;
            std.envMapIntensity = 0.9;
            std.needsUpdate = true;
          }
        });

        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const centre = box.getCenter(new THREE.Vector3());
        model.position.sub(centre);
        scene.add(model);

        const fov = (camera.fov * Math.PI) / 180;
        const fitH = size.y / 2 / Math.tan(fov / 2);
        const fitW = size.x / 2 / Math.tan(fov / 2) / camera.aspect;
        const distance = Math.max(fitH, fitW) * 1.28;
        camera.position.set(0, 0, distance);
        camera.near = distance / 50;
        camera.far = distance * 50;
        camera.updateProjectionMatrix();
      },
      undefined,
      () => {
        /* leave the mount empty — the link text still names the brand */
      },
    );

    const onVisibility = () => {
      hidden = document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);

    const t0 = performance.now();
    function animate() {
      raf = requestAnimationFrame(animate);
      if (hidden) return;
      const t = (performance.now() - t0) / 1000;
      if (model && !reduceMotion) {
        // Gentle sway rather than a full spin — a nav mark that turns its
        // back on the reader every few seconds reads as a glitch.
        model.rotation.y = Math.sin(t * 0.7) * 0.38;
        model.rotation.x = Math.sin(t * 0.45) * 0.1;
        // Light orbits the opposite way, doubling the apparent movement of
        // the highlight without moving the mark further.
        key.position.set(
          Math.cos(t * 0.6) * 3.5,
          2.5,
          Math.abs(Math.sin(t * 0.6)) * 3 + 1.5,
        );
      }
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      draco.dispose();
      envRT.dispose();
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (!mesh.isMesh) return;
        mesh.geometry?.dispose();
        const mat = mesh.material;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else mat?.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [w, height]);

  return (
    <div
      ref={mountRef}
      style={{ width: w, height }}
      aria-hidden="true"
      className="[&>canvas]:block"
    />
  );
}
