import { SHAPES, type ShapeId } from "@/lib/ring/shapes";
import { PHOTO_FILES } from "./generated/artwork-manifest";

/**
 * The Ring Collection — the pieces we hold, and the diamond shapes we cut to.
 *
 * These photographs used to be the ring builder's option tiles, which was the
 * wrong job for them. Every ring here is shot with the same round stone in the
 * same platinum, so as a *builder* preview they contradicted whatever the
 * customer had actually configured; as a *collection*, that consistency is the
 * point — the grid reads as one family and the only thing changing between
 * frames is the setting itself, which is what somebody comparing settings
 * wants to see.
 *
 * Provenance is recorded in scripts/import-ring-images.py, where it would
 * otherwise be lost.
 *
 * ── Why this list is its own ──
 *
 * These names used to be the builder's `SETTINGS` union, shared between the two
 * pages. That stopped being possible when the builder moved to band and head as
 * separate axes: there is no longer any single "Halo" or "Trilogy" in its model
 * to point at, because a halo is now a head that sits on any of fifteen bands.
 *
 * Trying to keep the sharing would have meant inventing a compatibility mapping
 * from seventeen photographed pieces to band/head pairs — a second model whose
 * only job is to make two unrelated things agree. These are photographs of
 * seventeen specific rings. Their names describe those rings, and that is all
 * they need to do.
 */

export type CollectionPiece = {
  id: string;
  label: string;
  description: string;
  /** Trade synonyms — the same list search already indexes. */
  aliases: string[];
  image: string;
  /**
   * Into the builder, on the nearest band and head we can offer. Nearest, not
   * exact — see the note above. Where a piece has no honest equivalent the link
   * simply opens the builder, which is better than opening it on a ring that is
   * not the one in the picture.
   */
  builderHref: string;
};

/**
 * The seventeen pieces, and the band + head that comes closest to each in the
 * builder's vocabulary. A `null` pair means nothing close enough exists.
 */
const PIECES: {
  id: string;
  label: string;
  aliases: string[];
  description: string;
  nearest: { band: string; head: string } | null;
}[] = [
  { id: "solitaire", label: "Solitaire", aliases: ["four claw", "4 prong"],
    description: "A single centre diamond held in a timeless four-claw setting.",
    nearest: { band: "solitaire", head: "4-prong-nouveau" } },
  { id: "rubover", label: "Rubover", aliases: ["bezel", "collet", "rub-over"],
    description: "A wall of metal wrapped fully around the stone. The most protective setting, and the most modern.",
    nearest: { band: "solitaire", head: "classic-bezel" } },
  { id: "halo", label: "Halo", aliases: ["cluster halo"],
    description: "A ring of grain-set diamonds framing the centre stone, making it read considerably larger.",
    nearest: { band: "solitaire", head: "classic-halo" } },
  { id: "grain-set", label: "Grain Set", aliases: ["pavé", "pave", "bead set"],
    description: "Diamonds set into the shoulders with raised beads of metal, so the band itself catches light.",
    nearest: { band: "french-pave", head: "4-prong-nouveau" } },
  { id: "hidden-halo", label: "Hidden Halo", aliases: ["under halo", "gallery set"],
    description: "A halo set beneath the girdle, invisible from above and a surprise from the side.",
    nearest: { band: "solitaire", head: "hidden-halo" } },
  { id: "double-halo", label: "Double Halo", aliases: ["dual halo"],
    description: "Two concentric rings of diamonds around the centre stone.",
    nearest: { band: "solitaire", head: "dual-halo" } },
  { id: "trilogy", label: "Trilogy", aliases: ["three stone", "past present future"],
    description: "Three stones together — traditionally read as past, present and future.",
    nearest: { band: "three-stone", head: "4-prong-nouveau" } },
  { id: "side-stone", label: "Side Stone", aliases: ["shoulder set"],
    description: "A centre stone flanked by smaller diamonds set into the shoulders.",
    nearest: { band: "cathedral-pave", head: "4-prong-nouveau" } },
  { id: "channel-set", label: "Channel Set", aliases: ["channel"],
    description: "Diamonds sunk between two rails of metal, flush and hard-wearing.",
    nearest: { band: "round-channel", head: "4-prong-nouveau" } },
  { id: "split-shank", label: "Split Shank", aliases: ["forked shoulders", "split band"],
    description: "The band divides as it approaches the setting, lifting the stone.",
    nearest: { band: "split-ring-solitaire", head: "4-prong-nouveau" } },
  { id: "knife-edge", label: "Knife Edge", aliases: [],
    description: "A band rising to a fine ridge, catching light as a single bright line.",
    nearest: { band: "knife-edge-solitaire", head: "4-prong-nouveau" } },
  { id: "crossover", label: "Crossover", aliases: ["twist", "bypass"],
    description: "Two bands crossing beneath the stone, wrapping the finger.",
    nearest: { band: "floral-bypass", head: "4-prong-nouveau" } },
  { id: "cluster", label: "Cluster", aliases: ["target"],
    description: "Similarly sized diamonds grouped as one flower-like head. A genuinely British setting, Georgian in origin.",
    nearest: { band: "solitaire", head: "clustered-diamond" } },
  { id: "vintage", label: "Vintage", aliases: ["trefoil", "milgrain"],
    description: "Millgrain edging and fine scrollwork, drawn from Edwardian and Art Deco pieces.",
    nearest: { band: "solitaire", head: "vintage-trefoil" } },
  { id: "trellis", label: "Trellis", aliases: [],
    description: "Claws that cross beneath the stone like woven basketwork.",
    nearest: { band: "solitaire", head: "classic-basket" } },
  // Tension and toi et moi have no equivalent: the library has neither a
  // tension-set head nor a two-stone band, and pointing them at something
  // approximate would open the builder on a ring that is visibly not the one
  // in the photograph.
  { id: "tension", label: "Tension Set", aliases: [],
    description: "The stone appears suspended, held by the spring of the metal alone. It cannot be resized in the ordinary way, so we size it carefully with you.",
    nearest: null },
  { id: "toi-et-moi", label: "Toi et Moi", aliases: ["you and me", "two stone"],
    description: "Two stones side by side — a French design meaning 'you and me'.",
    nearest: null },
];

export type CollectionStone = {
  id: ShapeId;
  label: string;
  aliases: string[];
  image: string;
};

/**
 * Resolves a hashed filename to its URL.
 *
 * The hash is in the filename rather than a `?v=` query string because
 * next.config.ts holds images for a year — see the note in the import script.
 * Anything without a file is dropped rather than rendered as a broken frame:
 * a collection is judged on what is in it, and one missing image in a grid of
 * seventeen reads as neglect rather than as a gap.
 */
function url(kind: "settings" | "shapes", id: string): string | undefined {
  const file = PHOTO_FILES[`${kind}/${id}`];
  return file ? `/rings/${kind}/${file}` : undefined;
}

export function collectionPieces(): CollectionPiece[] {
  return PIECES.flatMap((p) => {
    const image = url("settings", p.id);
    if (!image) return [];
    return [
      {
        id: p.id,
        label: p.label,
        description: p.description,
        aliases: p.aliases,
        image,
        builderHref: p.nearest
          ? `/ring-builder?band=${p.nearest.band}&head=${p.nearest.head}`
          : "/ring-builder",
      },
    ];
  });
}

export function collectionStones(): CollectionStone[] {
  return SHAPES.flatMap((s) => {
    const image = url("shapes", `${s.id}-diamond`) ?? url("shapes", s.id);
    if (!image) return [];
    return [{ id: s.id, label: s.label, aliases: s.aliases, image }];
  });
}
