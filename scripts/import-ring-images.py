#!/usr/bin/env python3
"""
Imports the engraved ring artwork into public/ring-builder/settings/.

The source files are SVGs in name only — no vector paths at all, just a base64
PNG (sometimes two) wrapped in an SVG container with a filter. This pulls the
bitmap back out and writes a real PNG that next/image can optimise and serve as
AVIF or WebP.

── The bit that matters ──

Most of these files carry TWO embedded images, and taking only the larger one is
wrong. That was the first version of this importer and it is why sixteen of
seventeen rings came out sitting on solid black.

The pair is artwork plus a greyscale luminance mask. It is how a PNG-to-SVG
converter reproduces an alpha channel it cannot otherwise express: the SVG's
feColorMatrix — the row reading `0.2126 0.7152 0.0722` is the standard
luminance formula — turns the mask's brightness into opacity and composites the
two at render time. Extract only the colour image and you keep whatever happened
to be behind the ring, which in these exports is black.

So: composite them back. Bright mask means opaque, dark means transparent. Files
that carry a single image already have their background baked in and are written
through unchanged.

Written in Python rather than Node because it needs to actually decode a PNG,
and Pillow is here. scripts/normalize-logos.py sets the same precedent.

Provenance, recorded because filenames lose it: this artwork was derived from a
57 Jewellers page download — five source filenames still carry that site's build
hashes — and regenerated with the Alpoe mark added. Used at the owner's explicit
direction. Replacing it with Alpoe's own photography needs nothing but new files
at the same paths; see docs/ring-builder-photography.md for the shot list.

Run: python3 scripts/import-ring-images.py
"""

import base64
import hashlib
import io
import os
import re
import sys

from PIL import Image

SRC = "docs/reference/ring-artwork"
OUT = "public/ring-builder/settings"
STONES_SRC = "docs/reference/57-jewellers"
STONES_OUT = "public/ring-builder/shapes"
COMPOSITES_OUT = "public/ring-builder/composites"
MANIFEST = "lib/ring/generated/photo-manifest.ts"

# Source file -> the setting id it illustrates, from lib/ring/config.ts.
MAPPING = {
    "solitaire-4prongDjdztrh3.svg": "solitaire",
    "bezel.svg": "rubover",
    "halo-CDG0.svg": "halo",
    "pave.svg": "grain-set",
    "hiddenhalo-DO5VLDq7.svg": "hidden-halo",
    "doublehalo.svg": "double-halo",
    "knifeedge.svg": "knife-edge",
    "threestone-CCg3QOTE.svg": "trilogy",
    "sidestone-COyY4QkU.svg": "side-stone",
    "channel .svg": "channel-set",
    "splitshank.svg": "split-shank",
    "twist.svg": "crossover",
    "Cluster.svg": "cluster",
    "vintage.svg": "vintage",
    "trellis.svg": "trellis",
    "tension.svg": "tension",
    "toietmoi.svg": "toi-et-moi",
}

# One of these filenames carries a non-breaking space (U+00A0) before its
# extension. It is indistinguishable from a normal space in a listing and
# matches nothing, so resolve by normalised comparison instead of trusting the
# literal string.
def normalise(name):
    return re.sub(r"[^a-z0-9]", "", name.lower())


def load_embedded(path):
    """Every PNG embedded in an SVG container, largest first."""
    raw = open(path, "rb").read().decode("utf8", "ignore")
    images = []
    for b64 in re.findall(r"base64,([A-Za-z0-9+/=]+)", raw):
        data = base64.b64decode(b64)
        if data[:8] == b"\x89PNG\r\n\x1a\n":
            images.append(data)
    images.sort(key=len, reverse=True)
    return images


def composite(artwork_bytes, mask_bytes):
    """Colour image + luminance mask -> RGBA, the way the SVG filter intends."""
    art = Image.open(io.BytesIO(artwork_bytes)).convert("RGB")
    mask = Image.open(io.BytesIO(mask_bytes)).convert("L")
    if mask.size != art.size:
        mask = mask.resize(art.size, Image.LANCZOS)
    out = art.convert("RGBA")
    out.putalpha(mask)
    return out


def main():
    if not os.path.isdir(SRC):
        sys.exit(f"source directory not found: {SRC}")
    os.makedirs(OUT, exist_ok=True)

    on_disk = os.listdir(SRC)
    lookup = {normalise(f): f for f in on_disk}

    written, skipped = [], []

    for wanted, setting_id in MAPPING.items():
        actual = lookup.get(normalise(wanted))
        if not actual:
            skipped.append(wanted)
            continue

        images = load_embedded(os.path.join(SRC, actual))
        if not images:
            skipped.append(f"{wanted} (no embedded PNG)")
            continue

        dest = os.path.join(OUT, f"{setting_id}.png")

        if len(images) >= 2:
            composite(images[0], images[1]).save(dest, "PNG", optimize=True)
            kind = "cut out"
        else:
            with open(dest, "wb") as fh:
                fh.write(images[0])
            kind = "as-is"

        written.append((setting_id, os.path.getsize(dest) / 1024, kind))

    stones = import_stones()

    for setting_id, kb, kind in sorted(written):
        print(f"  {setting_id:<16} {kb:6.0f} KB  {kind}")
    if stones:
        print()
        for shape_id, kb in sorted(stones):
            print(f"  stone/{shape_id:<10} {kb:6.0f} KB")
    if skipped:
        print("\n  skipped:")
        for s in skipped:
            print(f"    {s}")

    write_manifest()
    print(f"\n{len(written)} settings + {len(stones)} stones imported")
    print(f"manifest written to {MANIFEST}")


# Loose stones for the centre-stone picker. These arrive as plain PNGs rather
# than SVG-wrapped, so they only need copying and renaming to the shape ids.
STONE_MAPPING = {
    "round": "imgi_20_stone-round",
    "oval": "imgi_21_stone-oval",
    "cushion": "imgi_23_stone-cushion",
    "emerald": "imgi_24_stone-emerald",
    "pear": "imgi_25_stone-pear",
    "marquise": "imgi_26_stone-marquise",
    "asscher": "imgi_27_stone-asscher",
    "radiant": "imgi_28_stone-radiant",
}


def import_stones():
    if not os.path.isdir(STONES_SRC):
        return []
    os.makedirs(STONES_OUT, exist_ok=True)
    on_disk = os.listdir(STONES_SRC)
    out = []
    for shape_id, prefix in STONE_MAPPING.items():
        match = next((f for f in on_disk if f.startswith(prefix)), None)
        if not match:
            continue
        dest = os.path.join(STONES_OUT, f"{shape_id}.png")
        Image.open(os.path.join(STONES_SRC, match)).convert("RGBA").save(
            dest, "PNG", optimize=True
        )
        out.append((shape_id, os.path.getsize(dest) / 1024))
    return out


def write_manifest():
    """
    Content-hashed FILENAMES for cache-busting, and this is not optional.

    next.config.ts sets `minimumCacheTTL: 31536000` — a year — so a browser that
    has fetched one of these once will not ask again. Re-export a ring,
    overwrite the file at the same path, and everyone who saw the old version
    keeps seeing it indefinitely. That is exactly the bug where fifteen tiles
    stayed on their black-background versions while the two that happened to be
    re-requested came through correctly.

    The hash goes in the filename rather than a `?v=` query string, for two
    reasons. Next 16 rejects query strings on local images unless every one is
    whitelisted in `images.localPatterns`, which is unmaintainable when the
    value changes with the content. And more fundamentally, some CDNs strip or
    ignore query strings when deciding what to cache, so `?v=` can fail to bust
    anything at all. A different filename is unambiguous everywhere.
    """
    entries = []
    for folder, kind in (
        (OUT, "settings"),
        (STONES_OUT, "shapes"),
        (COMPOSITES_OUT, "composites"),
    ):
        if not os.path.isdir(folder):
            continue

        # Clear out previous hashed builds so public/ does not accumulate every
        # version ever exported.
        for name in os.listdir(folder):
            if re.fullmatch(r"[a-z0-9-]+\.[0-9a-f]{8}\.png", name):
                os.remove(os.path.join(folder, name))

        for name in sorted(os.listdir(folder)):
            if not name.endswith(".png"):
                continue
            path = os.path.join(folder, name)
            digest = hashlib.sha1(open(path, "rb").read()).hexdigest()[:8]
            stem = name[:-4]
            hashed = f"{stem}.{digest}.png"
            os.replace(path, os.path.join(folder, hashed))
            entries.append((f"{kind}/{stem}", hashed))

    os.makedirs(os.path.dirname(MANIFEST), exist_ok=True)
    lines = [
        "// Generated by scripts/import-ring-images.py — do not edit by hand.",
        "//",
        "// Content-hashed filenames for the ring artwork. The hash is in the name",
        "// rather than a ?v= query string because Next rejects unlisted query",
        "// strings on local images, and some CDNs ignore them when caching.",
        "",
        "export const PHOTO_FILES: Record<string, string> = {",
    ]
    for key, filename in entries:
        lines.append(f'  "{key}": "{filename}",')
    lines.append("};")
    with open(MANIFEST, "w") as fh:
        fh.write("\n".join(lines) + "\n")


if __name__ == "__main__":
    main()
