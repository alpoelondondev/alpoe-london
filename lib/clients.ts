/**
 * The clients who have agreed to be named on /clients.
 *
 * One entry per client. The page, its structured data and its anchors all
 * read from here, so adding a client is adding an entry — nothing else.
 *
 * ── The rule for `sameAs` ──
 *
 * Every link must be the client's own, verified official account — checked
 * against the profile itself (follower count, verified badge) and against
 * Wikidata where the client has an entry. A fan account or a lookalike handle
 * links Alpoe to the wrong person, publicly, and tells Google the same thing
 * in the structured data. `@gemmacollins1` looks right and is not her: 672
 * followers, no posts.
 */
export type ClientLink = {
  /** Shown on the page, e.g. "Instagram". */
  label: string;
  /** The handle as the client writes it, e.g. "@gemmacollins". */
  handle: string;
  href: string;
};

export type Client = {
  /** The page anchor: /clients#gemma-collins */
  slug: string;
  name: string;
  /** What the client is known as, in a few words. Also the schema `jobTitle`. */
  role: string;
  /** One or two sentences. Kept short on purpose. */
  blurb: string;
  /** What people know the client from — shown as pills under the blurb. */
  knownFor: string[];
  /**
   * The photograph on the client's card. Alpoe's own jewellery photography
   * unless there is a cleared picture of the client: a photo of a person needs
   * their permission and the photographer's.
   */
  image: { src: string; alt: string };
  /** Shown as buttons on the card. */
  links: ClientLink[];
  /**
   * Reference profiles that identify the person for search engines but are
   * not the client's own accounts — Wikipedia, Wikidata, IMDb. Published in the
   * structured data only, alongside `links`.
   */
  references: string[];
};

export const CLIENTS: Client[] = [
  {
    slug: "gemma-collins",
    name: "Gemma Collins",
    role: "Television personality",
    blurb:
      "Gemma Collins wears Alpoe London jewellery on screen and at her public appearances — pieces made at our Hatton Garden bench.",
    knownFor: ["The Only Way Is Essex", "Dancing on Ice", "I'm a Celebrity"],
    image: {
      src: "/alpoe-diamond-riviere-y-drop-necklace-hatton-garden.jpg",
      alt: "Alpoe London diamond rivière Y-drop necklace on a black velvet bust",
    },
    links: [
      {
        label: "Instagram",
        handle: "@gemmacollins",
        href: "https://www.instagram.com/gemmacollins/",
      },
      {
        label: "TikTok",
        handle: "@gemmacollins",
        href: "https://www.tiktok.com/@gemmacollins",
      },
    ],
    // gemmacollins.com is her official site per Wikidata (Q16208544) but was
    // a password-protected "Private Site" on 2026-10-07. Add it to `links`
    // once it is public — a link to a login wall helps nobody.
    references: [
      "https://en.wikipedia.org/wiki/Gemma_Collins",
      "https://www.wikidata.org/wiki/Q16208544",
      "https://www.imdb.com/name/nm4391346/",
    ],
  },
];

/** Initials for the card's monogram: "Gemma Collins" → "GC". */
export const clientInitials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();
