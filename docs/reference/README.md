# Reference material — NOT for publication

Everything in this directory is **third-party material held for research only**. None of it may
be served from `public/`, embedded in the site, or used as a source asset.

## `57-jewellers/`

Scraped from 57 Jewellers' CDN (filenames still carry their Vite build hashes, e.g.
`imgi_6_card-halo-CDG0.webp`). 17 setting cards and 10 stone renders. Copyright 57 Jewellers.

Useful as reference for the setting taxonomy and as a quality benchmark for
`/ring-builder`. It is the reason we know their list runs Solitaire → Knife Edge, and that
their UI labels laboratory-grown diamonds "LAB GROWN" — which ISO 18323 cl. 2.4 prohibits.

## `57-jewellers/Rings Engraved/`

**Do not use under any circumstances.** These are the same 57 Jewellers bitmaps re-wrapped in an
SVG container (zero vector paths; two base64 PNGs each) with "ALPOE … LONDON" added onto the band
by an AI edit. Several filenames still carry 57J's hashes.

Publishing them would be three separate problems:

1. Adding text creates a **derivative work**, infringing the adaptation right on top of the copy.
2. Presenting a competitor's product photograph as an Alpoe ring is a **misleading action** under
   s.226 of the Digital Markets, Competition and Consumers Act 2024.
3. The branding removes any "internal reference" argument, and it is trivially provable —
   identical pixels, competitor's hash in the filename.

They are also wrong on the merits: the engraving sits on the *outside* of the band, where no UK
jeweller puts one. Hallmarks and personal engraving go inside the shank.

**The Ring Builder generates its own imagery from procedural geometry, so none of this is
needed.** See `docs/ring-builder.md`.
