#!/usr/bin/env python3
"""
Builds public/products/<brand>/<refKey>/<n>.webp from data/image-sources/<brand>.tsv.

Each TSV row is   <reference> TAB <source> TAB <provenance note>   ("#" lines are comments).
Rows for one reference are numbered 1..N in file order — data/variant-images.tsv pins
by that number, so rows must never be reordered within a reference.

<source> is an https URL (manufacturer DAM / retailer CDN) or a local path. Every
image is decoded, kept RGBA (the pack shots are cut-outs on transparency), resampled
to at most MAX_WIDTH wide — never upscaled — and written as WebP. 800px is more than
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

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SOURCES = ROOT / "data" / "image-sources"
OUT = ROOT / "public" / "products"
CACHE = Path.home() / ".cache" / "alpoe-image-sources"
MAX_WIDTH = 800
QUALITY = 80
METHOD = 4
UA = "Mozilla/5.0 (Macintosh) AlpoeLondon-catalogue-build"


def reference_key(ref: str) -> str:
    return re.sub(r"^-|-$", "", re.sub(r"[^a-z0-9]+", "-", ref.lower()))


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


def convert(raw: bytes) -> bytes:
    im = Image.open(io.BytesIO(raw))
    im.load()
    im = im.convert("RGBA")
    if im.width > MAX_WIDTH:
        h = round(im.height * MAX_WIDTH / im.width)
        im = im.resize((MAX_WIDTH, h), Image.LANCZOS)
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
        dest = OUT / brand / reference_key(ref) / f"{n}.webp"
        label = f"{ref:<22} {reference_key(ref)}/{n}.webp"
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
