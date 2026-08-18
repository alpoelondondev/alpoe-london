# 360° spin sequences

Drop a folder per setting here and the hero picks it up automatically:

```
public/ring-builder/spin/solitaire/000.jpg … 035.jpg
```

Then flip the setting to `true` in `lib/ring/spins.ts`. Nothing else changes —
settings without a sequence keep showing their single still.

## Shooting

**36 frames, one every 10°**, numbered from the front-on view, zero-padded to
three digits. Ring on a turntable, rotating about the vertical axis as worn.

Fixed camera, fixed lighting, white sweep — the same setup as the stills, so a
spin and a still of the same ring match rather than reading as two shoots.

Frames can be modest. The competition ships 573×421 at around 6 KB each; at
900px square and sensible compression a full sequence is roughly 3 MB, and it is
only fetched when someone actually asks to spin.

## Why frames rather than a model

Photogrammetry reconstructs geometry by matching features between frames, and
polished metal with a refractive stone is close to the worst possible subject —
the highlights move with the camera, so there is nothing stable to match on.
Image-to-3D models will produce *a* mesh from one photograph but smooth away
claw tips, facet edges and millgrain, which is exactly the detail that makes
jewellery read as jewellery.

A flipbook of real photographs has neither problem, because every frame is real.
