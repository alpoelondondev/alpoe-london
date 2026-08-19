import { ICON_FILES } from "./generated/icon-manifest";
import type { ShapeId } from "./shapes";

/**
 * Head styles — how the centre stone is actually held.
 *
 * The head is the half of the ring that decides what the stone looks like: a
 * bezel closes it in, a halo widens it, six fine claws all but disappear. It is
 * also the half with real physical constraints, which is what `supports` below
 * carries.
 *
 * See bands.ts for why head and band are separate pickers.
 */

export type HeadId =
  | "4-prong-nouveau"
  | "6-prong-nouveau"
  | "classic-basket"
  | "diamond-basket"
  | "surprise-diamond"
  | "6-prong-diamond"
  | "diamond-tulip"
  | "classic-halo"
  | "floral-halo"
  | "hidden-halo"
  | "dual-halo"
  | "fancy-halo"
  | "clustered-diamond"
  | "vintage-trefoil"
  | "classic-bezel";

export type Head = {
  id: HeadId;
  label: string;
  aliases: string[];
  description: string;
  /**
   * Whether the head adds diamonds of its own. Matters for the specification:
   * a halo's melee must not be folded into the centre stone's carat figure, or
   * the customer reads a bigger stone than they are buying.
   */
  melee: boolean;
};

export const HEADS: Head[] = [
  {
    id: "4-prong-nouveau", label: "Four Claw", aliases: ["4 prong", "four prong"],
    description: "Four tapered claws and nothing else. The least metal over the stone, so the most light through it.",
    melee: false,
  },
  {
    id: "6-prong-nouveau", label: "Six Claw", aliases: ["6 prong", "tiffany setting"],
    description: "Six finer claws instead of four. More secure, and it makes a round stone read rounder.",
    melee: false,
  },
  {
    id: "classic-basket", label: "Classic Basket", aliases: ["basket setting"],
    description: "The claws are seated in a woven basket beneath the stone, which sets it lower and protects the girdle.",
    melee: false,
  },
  {
    id: "diamond-basket", label: "Diamond Basket", aliases: ["pavé basket"],
    description: "The same basket with diamonds set into its sides — only visible in profile, which is exactly the point.",
    melee: true,
  },
  {
    id: "surprise-diamond", label: "Surprise Diamond", aliases: ["peekaboo", "hidden stone"],
    description: "A single diamond set into the gallery under the centre stone, where only the wearer sees it. Often a birthstone instead, if you ask.",
    melee: true,
  },
  {
    id: "6-prong-diamond", label: "Six Claw Diamond", aliases: ["diamond crown"],
    description: "Six claws over a diamond-set gallery. Light comes through the sides as well as the table.",
    melee: true,
  },
  {
    id: "diamond-tulip", label: "Diamond Tulip", aliases: ["tulip setting"],
    description: "A tulip-shaped gallery, diamond set, opening up to hold the stone. The most decorative profile here that is still not a halo.",
    melee: true,
  },
  {
    id: "classic-halo", label: "Classic Halo", aliases: ["halo"],
    description: "A single ring of pavé around the centre stone. It makes a stone look roughly half a carat larger than it is, which is the honest reason it is the most-asked-for head we make.",
    melee: true,
  },
  {
    id: "floral-halo", label: "Floral Halo", aliases: ["petal halo"],
    description: "The halo broken into petals rather than a continuous ring, so it reads as a flower head-on.",
    melee: true,
  },
  {
    id: "hidden-halo", label: "Hidden Halo", aliases: ["under halo", "gallery halo"],
    description: "The halo sits underneath the girdle rather than around it. From above the stone stands alone; from the side there is a line of light beneath it.",
    melee: true,
  },
  {
    id: "dual-halo", label: "Double Halo", aliases: ["two row halo"],
    description: "Two concentric rings of pavé. The largest visual gain of anything here, and the widest across the finger.",
    melee: true,
  },
  {
    id: "fancy-halo", label: "Fancy Halo", aliases: ["scalloped halo"],
    description: "A shaped halo with a scalloped outer edge rather than a plain circle, softening where it meets the shoulders.",
    melee: true,
  },
  {
    id: "clustered-diamond", label: "Cluster", aliases: ["target", "cluster setting"],
    description: "Stones grouped so the whole head reads as one larger diamond. The most stone for the outlay, by some margin.",
    melee: true,
  },
  {
    id: "vintage-trefoil", label: "Vintage Trefoil", aliases: ["trefoil", "milgrain"],
    description: "A three-lobed gallery with milgrain along its edges — the beaded detail that dates the look to the 1920s rather than to now.",
    melee: true,
  },
  {
    id: "classic-bezel", label: "Rubover", aliases: ["bezel", "collet", "rub-over"],
    description: "A continuous collar of metal around the whole girdle. Nothing can catch, which is why it is what we fit for anyone who works with their hands.",
    melee: false,
  },
];

const BY_ID = new Map(HEADS.map((h) => [h.id, h]));

export function head(id: HeadId): Head {
  return BY_ID.get(id) ?? HEADS[0];
}

export function headIcon(id: HeadId): string | undefined {
  const file = ICON_FILES[`head/${id}`];
  return file ? `/ring-builder/icons/head/${file}` : undefined;
}

/**
 * Which heads will hold which stone.
 *
 * Read off the reference library's own coverage rather than reasoned from
 * first principles, because the library is the constraint that actually
 * matters: a combination missing from it has no render, so offering it would
 * put the customer back in front of a blank viewport. It is also, reassuringly,
 * the same answer physics gives — six claws cannot grip the corners of a square
 * stone, a four-claw nouveau has no V-claw for a marquise's tip, and a heart's
 * cleft needs a head built around it, which rules out most baskets and halos.
 *
 * Band does not appear here. Coverage is identical for all fifteen bands — 119
 * of 150 shape × head pairs, every time — so the constraint is genuinely two
 * dimensional and the table stays small enough to read.
 */
const SUPPORTED: Record<ShapeId, HeadId[]> = (() => {
  const all = HEADS.map((h) => h.id);
  const except = (...out: HeadId[]) => all.filter((h) => !out.includes(h));
  return {
    round: all,
    oval: all,
    cushion: except("6-prong-diamond", "6-prong-nouveau"),
    princess: except("6-prong-diamond", "6-prong-nouveau", "fancy-halo", "vintage-trefoil"),
    emerald: except("6-prong-diamond", "6-prong-nouveau", "fancy-halo", "vintage-trefoil"),
    asscher: except("6-prong-diamond", "6-prong-nouveau", "fancy-halo"),
    radiant: except("6-prong-diamond", "6-prong-nouveau", "fancy-halo", "vintage-trefoil"),
    pear: except("4-prong-nouveau", "fancy-halo", "vintage-trefoil"),
    marquise: except("4-prong-nouveau", "fancy-halo", "vintage-trefoil"),
    heart: except(
      "6-prong-diamond", "6-prong-nouveau", "classic-basket", "diamond-basket",
      "dual-halo", "fancy-halo", "floral-halo", "vintage-trefoil",
    ),
  };
})();

export function headsForShape(id: ShapeId): HeadId[] {
  return SUPPORTED[id] ?? HEADS.map((h) => h.id);
}

export function headHoldsShape(headId: HeadId, shapeId: ShapeId): boolean {
  return headsForShape(shapeId).includes(headId);
}

/**
 * The nearest head that will actually hold this stone.
 *
 * Keeping the customer's head where it is legal is the point: someone who
 * chose a hidden halo and then switched to a heart should keep the hidden halo,
 * not be dropped back to a four-claw. Only when their choice is genuinely
 * impossible do we move them, and the caller tells them we did.
 */
export function resolveHead(headId: HeadId, shapeId: ShapeId): { head: HeadId; changed: boolean } {
  if (headHoldsShape(headId, shapeId)) return { head: headId, changed: false };
  return { head: headsForShape(shapeId)[0], changed: true };
}
