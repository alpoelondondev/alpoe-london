"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { createRoseGoldEnvironment } from "../components/roseGoldEnvironment";
import { LOCKUP_MODEL_URL } from "../components/lockupModel";

/**
 * The lockup as it was actually built in Blender — same geometry, same rose
 * gold, live in the browser. Vanilla three rather than react-three-fiber: the
 * site carries no React 3D stack, and this is the only 3D on it, so pulling in
 * fiber + drei to render one static model would be three dependencies to keep
 * on side for no gain.
 *
 * Everything is created inside the effect and torn down on unmount — a WebGL
 * context that outlives its component is the one leak that will kill a phone
 * after a few navigations.
 */
export default function BrandModelViewer() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<string | null>("Loading model…");

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // Respect the OS setting — the idle spin is decoration, not information.
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // ACES desaturates as it approaches white, so an exposure that clipped the
    // specular hits was bleaching the hue out of exactly the brightest parts.
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = null; // the page's off-black shows through

    const camera = new THREE.PerspectiveCamera(
      40,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000,
    );

    // Polished metal is almost entirely reflection, so what it reflects decides
    // its colour. RoomEnvironment is a white and grey box, which is why the
    // mark went to chrome as soon as it turned away from the key light.
    const envRT = createRoseGoldEnvironment(renderer);
    scene.environment = envRT.texture;

    // Warmed and calmed. The old near-white key at 2.2 blew the specular past
    // where any hue survives; the tinted environment now carries most of the
    // modelling, so the lights only need to shape it.
    const key = new THREE.DirectionalLight(0xffd9c2, 1.6);
    key.position.set(3, 4, 5);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0xffc9a8, 1.1);
    rim.position.set(-4, 2, -5);
    scene.add(rim);

    scene.add(new THREE.HemisphereLight(0xffe6d4, 0x2a1a13, 0.4));

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = false; // panning a centred logo only ever loses it
    controls.autoRotate = !reduceMotion;
    controls.autoRotateSpeed = 0.8;
    // Explicit touch mapping: one finger turns the mark, a pinch zooms it.
    // (Two-finger pan stays off with enablePan above.)
    controls.touches.ONE = THREE.TOUCH.ROTATE;
    controls.touches.TWO = THREE.TOUCH.DOLLY_PAN;
    controls.rotateSpeed = 0.9; // a touch slower than mouse default - finger
    // travel is shorter than mouse travel, and 1.0 feels twitchy on a phone

    // ---- haptics ---------------------------------------------------------
    // A soft tick when you take hold of the mark, and a firmer one when a
    // pinch runs into the zoom stops. navigator.vibrate is Android/Chrome
    // only - iOS ignores it silently, so this degrades to nothing there.
    // Skipped entirely when the OS asks for reduced motion.
    const canVibrate =
      !reduceMotion && typeof navigator.vibrate === "function";
    const buzz = (ms: number) => {
      if (canVibrate) navigator.vibrate(ms);
    };
    let touching = false;
    let lastLimitBuzz = 0;
    const onTouchStart = () => {
      touching = true;
      buzz(8); // grab acknowledgement
    };
    const onTouchEnd = () => {
      touching = false;
    };
    renderer.domElement.addEventListener("touchstart", onTouchStart, {
      passive: true,
    });
    renderer.domElement.addEventListener("touchend", onTouchEnd, {
      passive: true,
    });

    controls.addEventListener("start", () => {
      controls.autoRotate = false;
    });
    controls.addEventListener("change", () => {
      if (!touching) return;
      // Firmer tick when the pinch hits either zoom stop, rate-limited so a
      // held pinch at the stop doesn't turn into a continuous rattle.
      const d = camera.position.distanceTo(controls.target);
      const atStop =
        d <= controls.minDistance * 1.005 || d >= controls.maxDistance * 0.995;
      const now = performance.now();
      if (atStop && now - lastLimitBuzz > 350) {
        lastLimitBuzz = now;
        buzz(18);
      }
    });

    /** Frames whatever it is handed, so the camera never needs hard-coding. */
    function frame(object: THREE.Object3D) {
      const box = new THREE.Box3().setFromObject(object);
      const size = box.getSize(new THREE.Vector3());
      const centre = box.getCenter(new THREE.Vector3());
      object.position.sub(centre);

      const fov = (camera.fov * Math.PI) / 180;
      // Fit on width as well as height — the lockup is far wider than it is
      // tall, so height alone would run it off both edges.
      const fitH = size.y / 2 / Math.tan(fov / 2);
      const fitW = size.x / 2 / Math.tan(fov / 2) / camera.aspect;
      const distance = Math.max(fitH, fitW) * 1.25;

      camera.position.set(0, 0, distance);
      camera.near = distance / 100;
      camera.far = distance * 100;
      camera.updateProjectionMatrix();

      controls.target.set(0, 0, 0);
      controls.minDistance = distance * 0.45;
      controls.maxDistance = distance * 2.5;
      controls.update();
    }

    let model: THREE.Object3D | null = null;
    let raf = 0;
    let disposed = false;

    // The GLB is Draco-compressed (569 KB instead of 10.8 MB). The decoder
    // comes from Google's CDN so no wasm files need to live in public/.
    const draco = new DRACOLoader();
    draco.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.7/");
    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(draco);

    gltfLoader.load(
      LOCKUP_MODEL_URL,
      (gltf) => {
        if (disposed) return;
        model = gltf.scene;

        // Enforce the polished rose gold from the Blender scene. The GLB
        // carries the right values, but loader/extension quirks (clearcoat,
        // anisotropy) can land as a duller compound material — this pins the
        // finish so the web model can never read rougher than the renders.
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
            // Sharper is not more metallic. At 0.12 the reflection was a hard
            // mirror and the base colour never got a look in; a little
            // diffusion lets the rose read while it still polishes.
            std.roughness = 0.22;
            // Was 1.3, which pushed the environment harder than the tint.
            std.envMapIntensity = 0.9;
            std.needsUpdate = true;
          }
        });

        scene.add(model);
        frame(model);
        setStatus(null);
      },
      (e) => {
        if (e.total > 0) {
          setStatus(`Loading model… ${Math.round((e.loaded / e.total) * 100)}%`);
        }
      },
      () => {
        if (!disposed) setStatus("Model unavailable");
      },
    );

    function onResize() {
      const w = mount!.clientWidth;
      const h = mount!.clientHeight;
      if (!w || !h) return; // pre-layout, or a hidden tab
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (model) frame(model);
    }
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    function animate() {
      raf = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.domElement.removeEventListener("touchstart", onTouchStart);
      renderer.domElement.removeEventListener("touchend", onTouchEnd);
      draco.dispose();
      controls.dispose();
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
  }, []);

  return (
    <div className="relative h-full w-full">
      <div ref={mountRef} className="absolute inset-0 [&>canvas]:touch-none" />

      {status && (
        <p className="pointer-events-none absolute inset-0 flex items-center justify-center font-sans text-[11px] tracking-[0.18em] uppercase text-dim">
          {status}
        </p>
      )}

      <p className="pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 font-sans text-[10px] tracking-[0.2em] uppercase text-dim/70">
        Drag or swipe to rotate · pinch or scroll to zoom
      </p>
    </div>
  );
}
