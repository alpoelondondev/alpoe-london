import type { JewelleryCategorySlug } from "./types";
import { asset } from "./assets";

/**
 * Workshop films, one per piece. These stand in for photographed stock on the
 * jewellery category pages: the footage IS the listing, so each film carries
 * enough of a name and spec to seed a WhatsApp enquiry on its own — there is no
 * product page behind it to fill in the details.
 *
 * `poster` is the film's own first frame, generated alongside it, so a tile
 * paints something real before the clip has buffered.
 */
export type Film = {
  /** Stable key — also the basename of both the .mp4 and its poster .jpg. */
  slug: string;
  title: string;
  /** Materials and stones, in the order a jeweller would say them aloud. */
  spec: string;
};

const filmSrc = (slug: string) => asset(`/${slug}.mp4`);
const filmPoster = (slug: string) => `/${slug}.jpg`;

export function filmVideo(film: Film) {
  return filmSrc(film.slug);
}

export function filmImage(film: Film) {
  return filmPoster(film.slug);
}

/**
 * Only the four categories we have footage for. A category absent from this
 * map keeps the ordinary product grid — see the jewellery category route.
 */
export const CATEGORY_FILMS: Partial<Record<JewelleryCategorySlug, Film[]>> = {
  rings: [
    {
      slug: "alpoe-diamond-rings-hatton-garden",
      title: "Radiant Cut Diamond Halo Ring",
      spec: "radiant cut centre with a full diamond halo and baguette shoulders",
    },
    {
      slug: "alpoe-oval-three-stone-diamond-ring-hatton-garden",
      title: "Oval Three-Stone Diamond Ring",
      spec: "oval brilliant centre with pear-cut sides, on a slim pavé band",
    },
    {
      slug: "alpoe-rose-gold-diamond-eternity-band-hatton-garden",
      title: "Rose Gold Diamond Cluster Eternity Band",
      spec: "18ct rose gold, cluster-set brilliants running the full band",
    },
  ],
  bracelets: [
    {
      slug: "alpoe-diamond-bracelets-hatton-garden",
      title: "Five-Row Diamond Cuff Bracelet",
      spec: "18ct rose gold, five rows of round brilliants",
    },
    {
      slug: "alpoe-baguette-diamond-tennis-bracelet-set-hatton-garden",
      title: "Baguette & Round Diamond Tennis Bracelet Set",
      spec: "three bracelets — baguette and round rows in rose and white gold",
    },
    {
      slug: "alpoe-two-tone-pave-cuban-link-bracelet-hatton-garden",
      title: "Two-Tone Pavé Cuban Link Bracelet",
      spec: "18ct rose and white gold, pavé-set links with a box clasp",
    },
    {
      slug: "alpoe-rose-gold-baguette-cluster-bracelet-hatton-garden",
      title: "Rose Gold Baguette Cluster Bracelet",
      spec: "18ct rose gold, alternating baguette and cluster panels",
    },
    {
      slug: "alpoe-halo-cluster-diamond-tennis-bracelet-hatton-garden",
      title: "Halo Cluster Diamond Tennis Bracelet",
      spec: "18ct white gold, alternating round and baguette halo clusters",
    },
    {
      slug: "alpoe-diamond-cross-charm-bracelet-hatton-garden",
      title: "Diamond Cross Charm Infinity Bracelet",
      spec: "18ct white gold infinity links hung with pavé cross charms",
    },
    {
      slug: "alpoe-gemstone-infinity-link-bracelet-hatton-garden",
      title: "Gemstone Infinity Link Bracelet",
      spec: "18ct rose gold infinity links with marquise emerald, citrine or sapphire centres",
    },
  ],
  "necklaces-pendants": [
    {
      slug: "alpoe-diamond-necklaces-chains-hatton-garden",
      title: "Two-Tone Infinity Link Chain",
      spec: "18ct rose and white gold, fully pavé-set infinity links",
    },
    {
      slug: "alpoe-diamond-infinity-link-chain-hatton-garden",
      title: "Diamond Infinity Link Chain",
      spec: "18ct white gold, pavé infinity links at a 20-inch drop",
    },
    {
      slug: "alpoe-double-row-diamond-tennis-necklace-hatton-garden",
      title: "Double Row Diamond Tennis Necklace",
      spec: "two graduated rows of round brilliants in 18ct white gold",
    },
    {
      slug: "alpoe-mixed-cut-diamond-riviere-necklace-hatton-garden",
      title: "Mixed Cut Diamond Rivière Necklace",
      spec: "round, emerald, radiant and pear cuts alternating in 18ct white gold",
    },
    {
      slug: "alpoe-diamond-riviere-y-drop-necklace-hatton-garden",
      title: "Diamond Rivière Y-Drop Necklace",
      spec: "graduated cushion cuts with a detachable drop tail",
    },
    {
      slug: "alpoe-rose-gold-pear-diamond-tennis-chain-hatton-garden",
      title: "Rose Gold Pear & Round Diamond Tennis Chain",
      spec: "18ct rose gold, alternating pear and round brilliants",
    },
  ],
  earrings: [
    {
      slug: "alpoe-diamond-earrings-hatton-garden",
      title: "Round Solitaire Diamond Stud Earrings",
      spec: "18ct rose gold basket settings, round brilliant solitaires",
    },
  ],
};

export function filmsForCategory(slug: JewelleryCategorySlug): Film[] {
  return CATEGORY_FILMS[slug] ?? [];
}
