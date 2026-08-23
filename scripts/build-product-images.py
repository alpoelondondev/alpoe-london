#!/usr/bin/env python3
"""
Builds public/products/<brand>/<refKey>/<NN>-<name>.webp from data/image-sources/<brand>.tsv.

Each TSV row is   <reference> TAB <source> TAB <provenance note>   ("#" lines are comments).
Rows for one reference are numbered 01..NN in file order and the rest of the name is read
off the note, so a file says what it is: "01-datejust-36-wimbledon.webp", not "1.webp".
The number stays because it is what orders the set — image 01 is the hero on the tile and
the gallery — and because data/variant-images.tsv pins a configuration to a filename, so
rows must never be reordered within a reference. Renaming a file means updating that pin
and any /products/… path in data/products.csv; gen-image-manifest.mjs warns about a pin
it cannot resolve, and `pnpm gen:data` is where you will see it.

<source> is an https URL (manufacturer DAM / retailer CDN) or a local path. Every
image is decoded, kept RGBA (the pack shots are cut-outs on transparency; a shot on
white paper is cut out here), trimmed to the watch and re-mounted centred on a 4:5
canvas so every brand carries the same margin, then resampled to at most MAX_WIDTH
wide — never upscaled — and written as WebP. 800px is more than
the 640px the gallery hero ever renders at, and q80 / method 4 is the knee measured
on this set (Rolex 1000px: q85 57KB, q80 50KB, q75 44KB; visible softness starts
below 80). Everything lands at 20–100KB against 250KB–11MB sources.

Reference -> folder uses the same fold as referenceKey() in lib/catalogue.ts, so
"5811/1G-001" lands in "5811-1g-001" and "RM 67-01" in "rm-67-01".

Re-running is safe: an existing <n>.webp is left alone unless --force. Downloads are
cached under ~/.cache/alpoe-image-sources so a rebuild does not hit the CDNs again.

    python3 scripts/build-product-images.py <brand-slug> [--force] [--dry-run]
    python3 scripts/build-product-images.py all

Afterwards: pnpm gen:data   (refreshes lib/generated/image-manifest.ts)
"""
import hashlib, io, os, re, subprocess, sys
from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SOURCES = ROOT / "data" / "image-sources"
OUT = ROOT / "public" / "products"
CACHE = Path.home() / ".cache" / "alpoe-image-sources"
MAX_WIDTH = 800
QUALITY = 80
METHOD = 4
# Every finished file is the same 4:5 canvas — the frame ProductTile and
# ProductGallery both draw — with the watch centred inside these fractions of
# it. Sources disagree wildly about their own margins: a Rolex render is an
# 800x1190 frame whose watch spans barely half the width, Cartier's arrive as
# 488x610 shots on white paper, Richard Mille's run to the edge of the file.
# Left alone that is a small Rolex beside a big Cartier in the same grid, which
# is exactly what the brand pages looked like. Normalising here rather than in
# CSS means one rule covers the tile, the gallery hero (object-cover, so
# anything that is not 4:5 gets cropped) and the search results.
CANVAS_RATIO = 4 / 5
CONTENT_W = 0.88
CONTENT_H = 0.92
# Alpha at or below this does not count towards the watch's bounds. It is set
# well above "not quite transparent" on purpose: the Rolex renders are the
# 'with-shadow' set, and that shadow is a soft ellipse wider than the case and
# 119px deeper than the bracelet. On white paper it is the point of the render;
# on this site's near-black tile it is invisible, and measuring it cost Rolex
# 13% of the frame and pushed every watch up out of centre.
ALPHA_FLOOR = 64
# Flood-fill tolerance, summed across RGB, for "this pixel is still the paper".
WHITE_TOL = 24
# Flood fill is pure Python, so a full-resolution backdrop would crawl. Nothing
# white-backed is anywhere near this today; the cap is here for the day it is.
FLOOD_MAX_WIDTH = 1200
UA = "Mozilla/5.0 (Macintosh) AlpoeLondon-catalogue-build"


def reference_key(ref: str) -> str:
    return re.sub(r"^-|-$", "", re.sub(r"[^a-z0-9]+", "-", ref.lower()))


# The longest a slug may run before it is cut back to a word boundary. Long
# enough for "royal-oak-selfwinding-41mm-blue-dial", short enough that a path
# stays readable in a diff.
NAME_MAX = 52


def describe(brand: str, ref: str, note: str) -> str:
    """The human half of a provenance note, as a filename slug.

    Notes come in two shapes. Most brands lead with the source's own id and put
    the description after a dash — "m126234-0015 — Rolex Datejust 36 Wimbledon".
    Patek's lead with the description and use the dash for a remark about why
    the row exists. What tells them apart is that an id is a single token, so a
    head with a space in it is already the description.
    """
    head, _, tail = note.partition("—")
    text = tail if tail and head.strip().count(" ") < 1 else head
    text = re.sub(r"^\s*57J label:\s*", "", text, flags=re.I)   # a cataloguing prefix
    text = re.sub(r"\[.*?\]", "", text)                         # asides in brackets
    text = re.sub(rf"^\s*{re.escape(brand.replace('-', ' '))}\s+", "", text.strip(), flags=re.I)
    slug = re.sub(r"^-|-$", "", re.sub(r"[^a-z0-9]+", "-", text.lower()))
    # The folder is already the reference; carrying it in the name too is noise.
    slug = re.sub(rf"^{reference_key(ref)}-|-{reference_key(ref)}$", "", slug)
    if len(slug) > NAME_MAX:
        slug = slug[:NAME_MAX].rsplit("-", 1)[0]
    return slug.strip("-") or "photo"


def file_name(brand: str, ref: str, n: int, note: str) -> str:
    """`03-datejust-41-wimbledon-jubilee.webp` — order first, then what it is.

    Zero-padded so a plain `ls` and the manifest's numeric sort agree about
    image 2 coming before image 10.
    """
    return f"{n:02d}-{describe(brand, ref, note)}.webp"


def fetch(source: str) -> bytes:
    if not source.startswith("http"):
        return Path(os.path.expanduser(source)).read_bytes()
    CACHE.mkdir(parents=True, exist_ok=True)
    cached = CACHE / hashlib.sha1(source.encode()).hexdigest()
    if cached.exists() and cached.stat().st_size > 0:
        return cached.read_bytes()
    subprocess.run(
        ["curl", "-sSL", "--fail", "--max-time", "120", "-A", UA, "-o", str(cached), source],
        check=True,
    )
    return cached.read_bytes()


def _fit(im: Image.Image, width: int) -> Image.Image:
    return im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)


def _looks_white_backed(im: Image.Image) -> bool:
    """A pack shot on paper: fully opaque, every edge pixel near white."""
    if im.getchannel("A").getextrema()[0] != 255:
        return False
    w, h = im.size
    px = im.convert("RGB").load()
    xs, ys = range(0, w, max(1, w // 32)), range(0, h, max(1, h // 32))
    edge = [px[x, 0] for x in xs] + [px[x, h - 1] for x in xs]
    edge += [px[0, y] for y in ys] + [px[w - 1, y] for y in ys]
    return all(sum(255 - c for c in p) <= WHITE_TOL for p in edge)


def _drop_white_backdrop(im: Image.Image) -> Image.Image:
    """Flood the paper away from the edges, leaving the watch on transparency.

    Flood fill and not a luminance threshold: a threshold also eats the white
    dial of a Ballon Bleu. What makes a pixel backdrop is that it is connected
    to the border, not that it is pale.
    """
    sentinel = (255, 0, 255)
    rgb = im.convert("RGB")
    w, h = rgb.size
    for seed in ((0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1),
                 (w // 2, 0), (w // 2, h - 1), (0, h // 2), (w - 1, h // 2)):
        ImageDraw.floodfill(rgb, seed, sentinel, thresh=WHITE_TOL)
    r, g, b = rgb.split()
    backdrop = ImageChops.multiply(
        ImageChops.multiply(
            r.point(lambda v: 255 if v == 255 else 0),
            g.point(lambda v: 255 if v == 0 else 0),
        ),
        b.point(lambda v: 255 if v == 255 else 0),
    )
    out = im.copy()
    # Half a pixel of blur takes the jaggies off the cut edge. Without it the
    # anti-aliased rim the fill could not reach reads as a white outline.
    out.putalpha(ImageChops.invert(backdrop).filter(ImageFilter.GaussianBlur(0.8)))
    return out


def _mount(im: Image.Image) -> Image.Image:
    """Crop to the watch, then re-mount it centred on the shared 4:5 canvas.

    Cropping happens before any downscale, so the 3840px Patek sources spend
    their pixels on the watch instead of on the margin around it. Content is
    only ever shrunk to fit MAX_WIDTH — a small source keeps a smaller canvas
    rather than being upscaled into softness, since the layout is driven by the
    aspect ratio and not by the pixel count.
    """
    box = im.getchannel("A").point(lambda v: 255 if v > ALPHA_FLOOR else 0).getbbox()
    if box is None:
        return im
    cw, ch = box[2] - box[0], box[3] - box[1]
    if cw >= im.width * 0.98 and ch >= im.height * 0.98:
        return im  # a full-bleed photograph, not a cut-out — mounting adds bars
    content = im.crop(box)
    width = max(cw / CONTENT_W, ch / CONTENT_H * CANVAS_RATIO)
    if width > MAX_WIDTH:
        content = _fit(content, max(1, round(cw * MAX_WIDTH / width)))
        width = MAX_WIDTH
    canvas = Image.new("RGBA", (round(width), round(width / CANVAS_RATIO)), (0, 0, 0, 0))
    canvas.alpha_composite(
        content,
        ((canvas.width - content.width) // 2, (canvas.height - content.height) // 2),
    )
    return canvas


def convert(raw: bytes) -> bytes:
    im = Image.open(io.BytesIO(raw))
    im.load()
    im = im.convert("RGBA")
    if _looks_white_backed(im):
        if im.width > FLOOD_MAX_WIDTH:
            im = _fit(im, FLOOD_MAX_WIDTH)
        im = _drop_white_backdrop(im)
    im = _mount(im)
    if im.width > MAX_WIDTH:
        im = _fit(im, MAX_WIDTH)
    buf = io.BytesIO()
    im.save(buf, "WEBP", quality=QUALITY, method=METHOD)
    return buf.getvalue()


def rows_for(brand: str):
    path = SOURCES / f"{brand}.tsv"
    if not path.exists():
        sys.exit(f"no source map at data/image-sources/{brand}.tsv")
    counts: dict[str, int] = {}
    for lineno, line in enumerate(path.read_text().splitlines(), 1):
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        parts = line.split("\t")
        if len(parts) < 2 or not parts[0] or not parts[1]:
            print(f"  ! {path.name}:{lineno} malformed, skipped")
            continue
        ref, source = parts[0].strip(), parts[1].strip()
        note = parts[2].strip() if len(parts) > 2 else ""
        n = counts.get(ref, 0) + 1
        counts[ref] = n
        yield ref, n, source, note


def build(brand: str, force: bool, dry_run: bool) -> tuple[int, int, int]:
    written = skipped = failed = 0
    for ref, n, source, note in rows_for(brand):
        name = file_name(brand, ref, n, note)
        dest = OUT / brand / reference_key(ref) / name
        label = f"{ref:<22} {reference_key(ref)}/{name}"
        if dest.exists() and not force:
            skipped += 1
            continue
        if dry_run:
            print(f"  → {label}  {source}")
            continue
        try:
            out = convert(fetch(source))
        except Exception as err:  # noqa: BLE001 — report and carry on
            print(f"  ✗ {label}  {str(err).splitlines()[0]}")
            failed += 1
            continue
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_bytes(out)
        print(f"  ✓ {label}  {len(out) // 1024:>3}KB  {note[:60]}")
        written += 1
    return written, skipped, failed


def main() -> None:
    args = sys.argv[1:]
    force = "--force" in args
    dry_run = "--dry-run" in args
    brands = [a for a in args if not a.startswith("--")]
    if not brands:
        sys.exit(__doc__)
    if brands == ["all"]:
        brands = sorted(p.stem for p in SOURCES.glob("*.tsv"))
    totals = [0, 0, 0]
    for brand in brands:
        print(f"{brand}:")
        w, s, f = build(brand, force, dry_run)
        totals[0] += w; totals[1] += s; totals[2] += f
    print(f"\n{totals[0]} written, {totals[1]} skipped, {totals[2]} failed")
    if totals[0]:
        print("run `pnpm gen:data` to refresh the image manifest")
    if totals[2]:
        sys.exit(1)


if __name__ == "__main__":
    main()
