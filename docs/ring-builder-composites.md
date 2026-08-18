# Setting × shape composites

## The gap these close

Every setting photograph is shot with the same 1.00ct round, which is right for
comparing settings against each other. It is wrong the moment somebody picks a
marquise: the tile still shows a round, so the picture and the specification
disagree — and the picture is what people believe.

Photography cannot close it. Seventeen settings × eight shapes is **136 rings**,
none of which exist. You would have to manufacture every one before you could
photograph it, which is the same wall the whole builder was designed around.

Image-to-image generation can, because the job is not "invent a ring" but "take
this exact photograph and change one element" — which is what these models are
genuinely good at. The base stays the real photographed setting; only the stone
changes.

## Status

**Blocked on one thing: an image-generation MCP server.**

Nothing currently connected can generate images — Blender's generators produce
3D meshes, not pictures. A **Gemini Pro subscription does not help**: that is
the consumer app and has no API.

What is needed is a **Google AI Studio API key**, which has a free tier, plus an
MCP server wired up with `claude mcp add`. Once that is connected, all 135
generations can be driven unattended in one pass.

Everything downstream is already built and will pick them up with no further
code changes.

## What already works without them

The fallback chain is complete, so nothing is broken while this is outstanding:

```
composite (this setting, this shape)
  └─ setting photograph (shot with a round)
       └─ live procedural render
            └─ text label
```

A missing composite is not a failure state. When the chosen stone *is* round —
36% of the UK market, and the default — the plain photograph is already the
correct picture.

## Generating them

**135, not 136.** Round is deliberately excluded: the base photographs already
show a round stone, so those composites would be regenerated copies of images we
already have. Worse, and seventeen wasted generations.

The prompt is built by `compositePrompt()` in `lib/ring/composites.ts`. It is
written to *constrain* rather than to describe, because the failure mode here is
a model that helpfully improves the lighting, reframes the shot or restyles the
band — which would make tile 4 stop matching tile 5 and destroy the grid as a
comparison. So it is mostly a list of things that must not change, with the
shape as the only variable.

Output:

```
public/ring-builder/composites/{settingId}-{shapeId}.png
```

Then run `python3 scripts/import-ring-images.py`, which content-hashes them into
the manifest alongside everything else. The hash goes in the filename rather
than a query string — Next rejects unlisted query strings on local images, and
some CDNs ignore them when caching.

## Checking the output

Two failures matter more than the rest, and neither is obvious from one image:

- **Drift across the grid.** Open the setting row and look along it. If the
  lighting or crop wanders between tiles, the row stops working as a comparison
  even though each image looks fine on its own.
- **Claws that don't grip.** A marquise or a pear needs a claw at each point.
  A composite that keeps the round setting's four claws and simply drops a
  pointed stone into it is physically wrong, and a jeweller will see it
  instantly.

Anything that fails either should be deleted rather than shipped — the fallback
is a correct photograph of a round, which is honest, where a bad composite is a
misleading picture of a ring we would then be asked to make.
