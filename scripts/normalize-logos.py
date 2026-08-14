#!/usr/bin/env python3
"""Normalise the brand-strip PNGs in public/logos to a consistent optical size.

Manual asset step — NOT part of `pnpm build`. Run it after dropping a new brand
logo into public/logos, then commit the rewritten PNGs.

    python3 scripts/normalize-logos.py

The source marks are press-kit assets with wildly different amounts of
transparent padding: Patek's mark fills 36% of a 4096-square canvas, Omega's
fills 99% of a 352x172 one. The strip sizes logos by CSS height, so that padding
was being scaled along with the artwork and the marks came out at completely
different sizes.

Two passes fix it:
  1. Crop each image to its alpha bounding box, so padding stops counting.
  2. Redraw every mark at one common height in a canvas of that same fixed
     height, widened to the mark plus a small fixed margin. Since the strip
     sizes by height, a shared canvas height means every mark lands at the same
     rendered height; keeping the canvas *width* proportional to the mark (as
     opposed to one uniform canvas for all six) is what keeps the CSS gap
     reading as an even rhythm rather than collapsing around the narrow marks.

Idempotent: re-running on already-normalised files only re-encodes them.

Requires Pillow.
"""

from pathlib import Path

from PIL import Image

DIR = Path("public/logos")
CANVAS_H = 500  # shared canvas height — this is what the strip normalises against
MARK_H = 430  # mark height inside it, leaving even breathing room top and bottom
SIDE_MARGIN = 46  # padding added either side, so the CSS gap stays even
MAX_ASPECT = 3.2  # past this, a mark is scaled down so it stops dominating
ALPHA_FLOOR = 25

# Per-logo optical correction applied on top of the fit; 1.0 = no change.
# For marks whose bounding box lies about how big they read — Patek is a crest
# over a short wordmark, so it is mostly internal whitespace and has to run
# larger than its box suggests to sit level with the plain wordmarks.
NUDGE = {
    "patek-philippe-watches-logo.png": 1.15,
}


def main() -> None:
    for path in sorted(DIR.glob("*.png")):
        src = Image.open(path).convert("RGBA")

        # Threshold the alpha before measuring: several of these have a haze of
        # near-zero alpha out to the canvas edge, and getbbox() on the raw
        # channel would treat that as content and crop nothing.
        mask = src.getchannel("A").point(lambda a: 255 if a >= ALPHA_FLOOR else 0)
        bbox = mask.getbbox()
        if bbox is None:
            raise SystemExit(f"{path.name} is fully transparent")
        mark = src.crop(bbox)

        nudge = NUDGE.get(path.name, 1.0)
        target_h = MARK_H * nudge
        # A very wide wordmark set to the common height would tower over the
        # others in overall footprint, so cap the aspect and let it sit shorter.
        aspect = mark.width / mark.height
        if aspect > MAX_ASPECT:
            target_h *= MAX_ASPECT / aspect
        target_h = min(target_h, CANVAS_H)

        scale = target_h / mark.height
        size = (max(1, round(mark.width * scale)), max(1, round(target_h)))

        canvas_w = size[0] + SIDE_MARGIN * 2
        out = Image.new("RGBA", (canvas_w, CANVAS_H), (0, 0, 0, 0))
        out.paste(
            mark.resize(size, Image.LANCZOS),
            (SIDE_MARGIN, (CANVAS_H - size[1]) // 2),
        )
        out.save(path, optimize=True)

        note = f"  (nudge {nudge})" if nudge != 1.0 else ""
        print(
            f"{path.name:34} {src.width}x{src.height} → mark {size[0]}x{size[1]} "
            f"in {canvas_w}x{CANVAS_H}{note}"
        )


if __name__ == "__main__":
    main()
