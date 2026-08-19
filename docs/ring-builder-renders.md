# Ring Builder — the render library

---

## ⏸ RESUME HERE — hosting is not set up yet

**Blocked on:** adding a payment card to Cloudflare, so the R2 bucket can be
created. Nothing else is waiting on anything.

**Current state.** The builder is finished and deployable *right now*. With no
bucket configured it degrades to a live specification card in the viewer — no
broken images, no 404s, no console errors. `/ring-builder/verify` returns
`ok: true` in this state. So there is no rush and nothing is half-built.

### What is already done

- [x] Builder rebuilt on four axes — band, shape, head, metal
- [x] All 46 option icons imported, re-encoded to 200px WebP (417 KB → 112 KB)
- [x] Head/shape coverage table matches the library's 119 pairs exactly
- [x] `renderUrl()` derives every path from the configuration, no lookup table
- [x] Performance layer: preconnect, build-time LCP preload, decode-before-swap,
      intent prefetch on hover, idle warming of the shape and metal rails
- [x] `scripts/build-ring-renders.py` — conversion pipeline
- [x] `scripts/upload-ring-renders.sh` — upload, with the R2 traps handled

### What is left

- [ ] **1. Finish the conversion.** `python3 scripts/build-ring-renders.py --stream`
      Idempotent — re-run it and it picks up where it stopped. Check progress with
      `find ~/Desktop/Rings-Web -name '*.webp' | wc -l` against 32,115.
- [ ] **2. Cloudflare R2 bucket.** Sign up → R2 Object Storage → Create bucket
      `alpoe-ring-renders` → Settings → Public Development URL → **Enable** →
      copy the `https://pub-….r2.dev` URL.
- [ ] **3. API token.** R2 → Manage R2 API Tokens → Create → **Object Read &
      Write**, scoped to that bucket. Save the Access Key ID, Secret Access Key
      and the `.r2.cloudflarestorage.com` endpoint — the secret is shown once.
- [ ] **4. Upload.** `brew install rclone`, then `rclone config` (new remote →
      `s3` → provider **Cloudflare R2**), then
      `./scripts/upload-ring-renders.sh r2:alpoe-ring-renders`
- [ ] **5. Netlify.** Site configuration → Environment variables → add
      `NEXT_PUBLIC_RING_RENDERS_URL` = the public URL from step 2. Scope it to
      all deploy contexts. **Then trigger a redeploy** — `NEXT_PUBLIC_*` is
      inlined at build time, so editing it without rebuilding does nothing.
- [ ] **6. Verify.** This must return `200` and `content-type: image/webp`:
      ```
      curl -sI "$URL/solitaire/round-diamond/6-prong-nouveau/platinum/solitaire_round-diamond_6-prong-nouveau_platinum_angled.webp"
      ```
      That is the default configuration — the one the page preloads. If it 200s,
      the builder works. If it 404s, the bucket root is one level off: the root
      listing should show `alternating-baguette` … `twist-pave`.

### Two things that will waste an hour if forgotten

1. **The disk / iCloud problem.** This Mac's Desktop is iCloud-synced and the
   disk sits around 95% full, so macOS evicts the source library to iCloud and
   the bytes are not local. `brctl download` does **not** work for this — it
   queues, returns success immediately, and materialises nothing. A plain read
   faults each file in, which is why the conversion *is* the fetch and why it
   runs 48 threads: the job is network-bound, not CPU-bound. Turning off
   **System Settings → iCloud → iCloud Drive → Optimise Mac Storage** stops the
   eviction fight. Do **not** turn off Desktop & Documents syncing itself.
2. **`--s3-no-check-bucket`** is already in the upload script and must stay. R2
   rejects rclone's pre-flight `HeadBucket` call for a token scoped to a single
   bucket, and the resulting 403 looks exactly like bad credentials.

---

The builder is photographic end to end. Every selectable combination has a real
render, which is what makes it different from every previous version of this
page: nothing on screen is ever a stand-in for the configuration beside it.

## The four axes

| Axis  | Count | Source of truth |
|-------|-------|-----------------|
| Band  | 15    | `lib/ring/bands.ts` |
| Shape | 10    | `lib/ring/shapes.ts` |
| Head  | 15    | `lib/ring/heads.ts` |
| Metal | 6 renders, 7 UK metals | `lib/ring/metals.ts` |

15 × 10 × 15 = 2,250 possible band/shape/head combinations; **1,785 exist**,
because 119 of the 150 shape × head pairs are offered rather than all 150. That
coverage is identical for every band, which is why the constraint table in
`heads.ts` is two-dimensional and small enough to read.

× 6 metals × 3 views = **32,115 renders**.

## The route

    <root>/<band>/<shape>/<head>/<metal>/<band>_<shape>_<head>_<metal>_<view>.webp

Views are `angled`, `front`, `side`.

`lib/ring/renders.ts` builds this by concatenation — no manifest, no lookup
table, no generation step. That is only possible because the option ids in
`bands.ts`, `heads.ts` and `shapes.ts` **are** the library's folder names.
Keep them identical and the URL cannot fall out of step with what is on disk;
rename a folder and the builder breaks. It is the single most important
invariant here.

Two things are deliberately *not* in the path:

- **Carat.** Every render is the 1.00ct preview size. Stone dimensions are
  quoted in millimetres in the specification, which is the honest place for
  them — a photograph on a screen has no scale.
- **Head metal.** There are no two-tone renders. A customer who breaks the two
  metals apart is shown the band metal, and the viewport says so rather than
  letting the picture quietly overrule the specification.

## Building

    python3 scripts/build-ring-renders.py

Reads `~/Desktop/Rings-Organised`, writes `~/Desktop/Rings-Web`. Idempotent —
an interrupted run resumes.

Source is 2.81 GB of 1600×1600 JPEGs. Output is 900px WebP at quality 75,
around 21 KB each. Both numbers were measured, not guessed:

- **900px** is 2× the viewport's 420px cap, plus headroom. The source is four
  times larger than anything that will ever be displayed.
- **Quality 75** is the knee. On the worst-case ring in the set — an
  alternating baguette band under a classic halo — q80 is 25.3 KB, q75 is
  21.3 KB, q70 is 20.3 KB. 80→75 saves 16%; 75→70 saves 5% and starts costing
  visible sharpness on the facets.
- **Method 4**, not 6. Six is 5% smaller and takes 66ms per image against 30ms
  — which across 32,115 images is 35 minutes of encoding versus 16, for a
  kilobyte nobody will ever perceive.

## Uploading

    brew install rclone
    rclone config                                    # s3 → Cloudflare R2
    ./scripts/upload-ring-renders.sh r2:alpoe-ring-renders

Then set `NEXT_PUBLIC_RING_RENDERS_URL` to the public bucket URL. Unset, the
viewport falls back to a live specification card and nothing 404s.

**Why not Google Drive.** Drive is a file locker, not a CDN. It has no
`Cache-Control` you can set, redirects image requests through an HTML
interstitial, rate-limits and occasionally serves a virus-scan warning page in
place of the file, and cannot be pointed at a custom domain. Every one of those
is fatal for an `<img>` tag, and the caching alone would undo the performance
work below. R2 is the recommendation because 620 MB sits inside its 10 GB free
tier and egress is free; any S3-compatible bucket behind a CDN works identically.

## Performance

The renders are the page's LCP element, so this is not incidental.

- **`preconnect`** to the bucket origin, emitted from `app/ring-builder/page.tsx`
  only when one is configured. Without it the browser pays DNS + TCP + TLS —
  three round trips — and only after it has parsed far enough to discover the
  image URL.
- **Decode before swap.** `app/ring-builder/renderCache.ts` never changes what
  is displayed until the replacement has been through `decode()`. Pointing an
  `<img>` at a new URL leaves the old frame up until the new one arrives, which
  reads as the click having failed; unmounting leaves a white square, which
  reads worse.
- **Intent prefetch.** `pointerenter` on a tile fetches that option's render,
  which buys the 200–300ms before the press — enough for 21 KB on nearly any
  connection, so the ring changes in the same frame as the click. Touch gets
  `pointerdown`, roughly 100ms of warning.
- **Idle warming**, and only of the shape and metal rails: seventeen renders,
  about 350 KB, at `fetchPriority: "low"`, after the `load` event. Warming all
  four rails would be over a megabyte competing with the LCP image. Bands and
  heads are left to intent, which costs nothing.
- **Icons** are re-encoded to 200px WebP by `scripts/import-ring-icons.py`:
  417 KB → 112 KB. The shape icons alone arrived at 1300×1024 to be drawn in an
  86px tile.

## Verifying

`/ring-builder/verify` asserts the coverage table still matches the library's
119 pairs, that every option has an icon, that an unsupported head/shape pair
resolves to no URL, and that the specification reaching WhatsApp carries
everything it must.
