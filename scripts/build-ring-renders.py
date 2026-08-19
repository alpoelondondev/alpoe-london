#!/usr/bin/env python3
"""
Prepares the ring render library for the web, and writes it out ready to upload.

The source library is 32,115 JPEGs at 1600x1600, about 780 MB. The builder's
viewport is capped at 420 CSS pixels — see RingViewport.tsx, where never taking
more than half the screen is a hard rule — so the source is roughly four times
larger than anything that will ever be displayed. Shipping it as-is would mean
every click in the builder pulling a 24 KB image to draw it at a quarter scale.

So: 900px WebP at quality 75. 900 rather than 840 (2x of 420) to leave a little
headroom if the viewport ever grows; WebP because it is roughly a
quarter of the source's bytes at a size where the difference is not visible on
a photograph of polished metal.

Quality 75 is the knee of the curve, measured rather than guessed: on the
worst-case ring in the set — an alternating baguette band under a classic halo,
which is about as much fine detail as jewellery gets — q80 is 25.3 KB, q75 is
21.3 KB and q70 is 20.3 KB. Dropping from 80 to 75 saves 16%; dropping from 75
to 70 saves 5% and starts costing visible sharpness on the facets. So 75.

The whole library lands around 620 MB, and each image around 21 KB. The second
number is the one that matters: it is what a customer downloads when they click
an option, and it is small enough that the ring is the fastest thing on the
page rather than the slowest.

The route is preserved exactly:

    <band>/<shape>/<head>/<metal>/<band>_<shape>_<head>_<metal>_<view>.webp

which is what lib/ring/renders.ts derives from a configuration with no lookup
table. That is the whole reason the option ids are the library's own strings —
keep them identical and the URL is four concatenations that cannot fall out of
step with what is on disk.

Idempotent: a file already present and newer than its source is skipped, so an
interrupted run resumes rather than starting again.

Threads rather than processes, which is the opposite of the usual advice for
CPU-bound Python and is right here anyway: the work is entirely inside Pillow's
C code, and Pillow releases the GIL for `resize` and `save`. So threads
parallelise this as well as processes would, without paying to pickle 32,115
paths across process boundaries — and without `multiprocessing.Pool`, which
deadlocked on this machine under Python 3.14 with the workers alive at 0% CPU
and no work moving.

Run:  python3 scripts/build-ring-renders.py [--src DIR] [--out DIR] [--jobs N]
"""

import argparse
import os
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor

# macOS SF_DATALESS: an iCloud placeholder. The name, size and dates are on
# disk; the bytes are not. Opening one blocks while the OS fetches it — which
# is slow, but it does work, and it is the only thing that reliably does.
#
# `brctl download` was the obvious tool and it is not usable here: it queues
# asynchronously, returns success immediately, and on this library materialised
# nothing at all inside a minute for a folder of 2,142 files. A plain read
# faults the file in synchronously every time.
#
# So the flag is no longer used to skip files. It is used to decide how much
# concurrency to ask for, because a dataless read is network latency rather
# than CPU — see JOBS_CLOUD.
SF_DATALESS = 0x40000000

try:
    from PIL import Image
except ImportError:
    sys.exit("Pillow is required:  pip3 install Pillow")

SRC = os.path.expanduser("~/Desktop/Rings-Organised")
OUT = os.path.expanduser("~/Desktop/Rings-Web")

# Concurrency, and it is deliberately far above the core count. Encoding is
# ~30ms of CPU; faulting a file in from iCloud is hundreds of milliseconds of
# waiting, so the run is network-bound and the threads mostly sleep. The
# converter sits at 0% CPU throughout.
#
# The number is worth measuring rather than reasoning about, and the measuring
# is worth doing GENTLY, which is the lesson here. A burst test at 48 / 96 /
# 160 threads produced this:
#
#     48 threads   49.2s per 96 files
#     96 threads   19.1s per 96 files   <- apparently best
#    160 threads   46.4s per 96 files
#
# and then, a few minutes later, iCloud rate-limited the machine so hard that
# individual reads went from 0.2s to between 9 and 35 seconds and throughput
# fell to nothing. The 96-thread figure was not a sustainable rate, it was the
# last of the allowance being spent.
#
# So: a modest, steady number. iCloud throttles bursts and the throttle decays
# with time rather than with backing off mid-request, which means a slow run
# that never trips it finishes sooner than a fast one that does. The connection
# here measures 17 Mbps and iCloud never offered more than about a sixth of it,
# so there was never much to win by pushing.
JOBS_CLOUD = 16

# 2x the viewport's 420px cap, plus headroom. Raising this is the one knob that
# costs real bytes — it is roughly quadratic.
EDGE = 900
QUALITY = 75

# WebP's effort dial, and the one place a whole-library job is worth tuning.
# Measured on the worst-case ring: method 6 is 21.3 KB at 66ms, method 4 is
# 22.5 KB at 30ms, method 2 is 23.2 KB at 15ms. Six is the smallest and the
# obvious choice for something that runs once — except that "once" is 32,115
# images, which is 35 minutes of pure encoding versus 16. Four costs 5% in
# bytes and halves the wall clock, and 5% of 22 KB is a kilobyte nobody will
# ever perceive.
METHOD = 4


LOCAL_ONLY = False


def convert(job):
    src, dst = job
    try:
        st = os.stat(src)
        # Reading a dataless file faults it in from iCloud, which is the whole
        # mechanism this script relies on — and exactly what must not happen
        # when the service is throttling or a bulk download is already running.
        # Skipping banks the work that is free without adding to the pressure.
        if LOCAL_ONLY and (st.st_flags & SF_DATALESS):
            return ("cloud", 0)
        if os.path.exists(dst) and os.path.getmtime(dst) >= st.st_mtime:
            return ("skip", os.path.getsize(dst))
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        with Image.open(src) as im:
            im = im.convert("RGB")
            if im.width != EDGE:
                im = im.resize((EDGE, EDGE), Image.LANCZOS)
            im.save(dst, "WEBP", quality=QUALITY, method=METHOD)
        return ("done", os.path.getsize(dst))
    except Exception as exc:  # noqa: BLE001 - one bad file must not kill the run
        return ("fail", f"{src}: {exc}")


# Stop before the disk does. Converting into a nearly-full volume does not fail
# once, it fails thousands of times: the run that hit this produced 2,040 errors
# in one band and then four more bands of 2,142 instant failures each, because
# every worker kept trying. Worse, macOS itself needs headroom — below about a
# gigabyte, applications start failing to save.
#
# One band of output is roughly 45 MB and one band of source about 190 MB, so a
# gigabyte is a comfortable floor with room for whatever else the machine is
# doing.
MIN_FREE_BYTES = 1_000_000_000


def free_bytes(path):
    st = os.statvfs(path)
    return st.f_bavail * st.f_frsize


def evict(folder):
    """
    Puts a band back in the cloud once it has been converted.

    This is what makes the library convertible on a machine with no room for
    it. The source is 2.81 GB and the disk this runs on has about 11 GB free at
    95% full, which is exactly the condition under which macOS starts evicting
    faster than it fetches — the first attempt at this watched a completed band
    go backwards from 2142 local files to 1888 while it worked.

    Converting a band and immediately putting it back means peak usage is one
    band, about 190 MB, rather than everything at once. Eviction stops being
    something fighting the script and becomes part of it.
    """
    subprocess.run(["brctl", "evict", folder], capture_output=True, check=False)


def collect(src_root, out_root):
    jobs = []
    for dirpath, dirnames, filenames in os.walk(src_root):
        dirnames[:] = [d for d in dirnames if not d.startswith((".", "_"))]
        for name in filenames:
            if not name.endswith(".jpg"):
                continue
            rel = os.path.relpath(os.path.join(dirpath, name), src_root)
            jobs.append((
                os.path.join(src_root, rel),
                os.path.join(out_root, os.path.splitext(rel)[0] + ".webp"),
            ))
    return sorted(jobs)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", default=SRC)
    ap.add_argument("--out", default=OUT)
    ap.add_argument("--jobs", type=int, default=JOBS_CLOUD)
    ap.add_argument(
        "--local-only",
        action="store_true",
        help="convert only files already on disk, skipping anything still in "
             "iCloud — safe to run while a download is in progress or the "
             "service is throttling",
    )
    ap.add_argument(
        "--stream",
        action="store_true",
        help="download, convert and evict one band at a time — for a full disk "
             "or a library that lives in iCloud",
    )
    args = ap.parse_args()

    global LOCAL_ONLY
    LOCAL_ONLY = args.local_only

    if not os.path.isdir(args.src):
        sys.exit(f"source library not found: {args.src}")

    jobs = collect(args.src, args.out)
    if not jobs:
        sys.exit(f"no .jpg files under {args.src}")
    print(f"{len(jobs)} renders -> {args.out}  ({EDGE}px WebP q{QUALITY}, {args.jobs} workers)", flush=True)

    if args.stream:
        return stream(args, jobs)

    done = skipped = failed = 0
    total_bytes = 0
    errors = []
    with ThreadPoolExecutor(max_workers=args.jobs) as pool:
        for i, (status, payload) in enumerate(pool.map(convert, jobs), 1):
            if status == "fail":
                failed += 1
                errors.append(payload)
            else:
                total_bytes += payload
                if status == "done":
                    done += 1
                else:
                    skipped += 1
            if i % 500 == 0 or i == len(jobs):
                print(f"  {i}/{len(jobs)}  {total_bytes / 1e6:.0f} MB", flush=True)

    print(f"\nconverted {done}, already done {skipped}, failed {failed}")
    print(f"library is {total_bytes / 1e6:.0f} MB across {done + skipped} files")
    for e in errors[:10]:
        print(f"  ! {e}")

    if failed:
        sys.exit(1)


def stream(args, jobs):
    """
    One band at a time: convert, then put it back in the cloud.

    Reading a source file is what pulls it out of iCloud, so there is no fetch
    step — the conversion is the fetch. Evicting after each band is what keeps
    peak disk usage to one band rather than the whole 2.81 GB library. See
    `evict`.
    """
    bands = sorted({os.path.relpath(src, args.src).split(os.sep)[0] for src, _ in jobs})
    total_bytes = converted = failed = 0
    started = time.time()

    for n, band in enumerate(bands, 1):
        folder = os.path.join(args.src, band)
        outstanding = [j for j in jobs if j[0].startswith(folder + os.sep) and not os.path.exists(j[1])]
        if not outstanding:
            print(f"[{n}/{len(bands)}] {band} — already done", flush=True)
            continue

        free = free_bytes(args.out)
        if free < MIN_FREE_BYTES:
            print(
                f"\nStopping: {free / 1e9:.1f} GB free, need at least "
                f"{MIN_FREE_BYTES / 1e9:.1f} GB.\n"
                f"Free some space and re-run — everything converted so far is kept.",
                flush=True,
            )
            break

        t0 = time.time()
        with ThreadPoolExecutor(max_workers=args.jobs) as pool:
            results = list(pool.map(convert, outstanding))

        ok = [r for r in results if r[0] in ("done", "skip")]
        bad = [r[1] for r in results if r[0] == "fail"]
        in_cloud = sum(1 for r in results if r[0] == "cloud")
        total_bytes += sum(r[1] for r in ok)
        converted += len(ok)
        failed += len(bad)

        el = time.time() - t0
        print(
            f"[{n}/{len(bands)}] {band} — {len(ok)}/{len(outstanding)} in {el / 60:.1f} min"
            + (f", {in_cloud} still in iCloud" if in_cloud else "")
            + (f", {len(bad)} failed" if bad else ""),
            flush=True,
        )
        for e in bad[:3]:
            print(f"    ! {e}", flush=True)
        if not LOCAL_ONLY:
            evict(folder)

    print(
        f"\n{converted} renders, {total_bytes / 1e6:.0f} MB in {args.out}"
        f"  ({(time.time() - started) / 60:.0f} min)"
    )
    remaining = sum(1 for _, dst in jobs if not os.path.exists(dst))
    if remaining:
        print(f"{remaining} still outstanding — re-run to pick them up")
    if failed:
        sys.exit(1)


if __name__ == "__main__":
    main()
