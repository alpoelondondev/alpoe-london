# Logo — brand source assets

Master artwork for the Alpoe London lockup. Everything here is generated from
`alpoe.london-final.blend`, which is the single source of truth for the mark.

**The app does not load anything from this folder.** The site loads
`/models/alpoe-lockup.glb`, via `LOCKUP_MODEL_URL` in
`app/components/lockupModel.ts`. The GLB here is a reference copy for handing
to third parties.

| File | What it is |
| --- | --- |
| `alpoe.london-final.blend` | Blender source. Everything else is exported from it. |
| `alpoe-monogram.glb` | AD monogram in 3D, rose gold. Copy of the served asset. |
| `alpoe-london-logo-full.svg` | Full lockup, flat vector, `currentColor`. |
| `alpoe-london-logo-full-rosegold.svg` | Full lockup with the rose gold gradient. |
| `alpoe-monogram-ad.svg` | AD monogram only, `currentColor`. |
| `alpoe-monogram-ad-rosegold.svg` | AD monogram only, rose gold gradient. |

## Re-exporting

If the mark changes in Blender, all of these go stale together. Re-export the
GLB to **both** `public/models/` and here, then bump `MODEL_REVISION` in
`app/components/lockupModel.ts` — without that bump, returning visitors keep
the mesh their browser already cached.

The flat SVGs are traced from the Blender geometry rather than drawn by hand,
so they need regenerating too.

## Known drift

`app/components/heroLockupShapes.ts` holds a **separate** hand-supplied vector
of the same lockup (a 1620×933 artboard) used for the hero mask, the footer and
the mentorship band. It is not generated from the Blender file and its `A` is
the older, heavier-stroked drawing. Until it is regenerated, the flat mask and
the 3D mark are not the same letterform.

## Note

This folder sits under `public/`, so every file in it is publicly downloadable
and ships with the deploy — including the ~6.7 MB `.blend`. Move it outside
`public/` if that is not wanted.
