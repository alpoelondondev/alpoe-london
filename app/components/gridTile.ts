/**
 * What a listing grid needs to draw a tile and to filter it, with nothing from
 * the catalogue that a tile does not use.
 *
 * The grid pages used to filter on the server, reading `searchParams` — which
 * opts the whole route out of static rendering, so every visit to a brand or
 * category page was a serverless render. Filtering happens in the browser now,
 * and this is the shape that crosses over: the tile's own props plus the three
 * fields the filters match on. It is deliberately not `Product` — the full row
 * carries a description, meta tags and a research blob that no tile reads, and
 * ninety of those would land in the payload for nothing.
 *
 * No server imports here, so a client component can hold it.
 */
export type GridTile = {
  id: string;
  href: string;
  image?: string;
  alt: string;
  title: string;
  meta?: string;
  /** Matched by the Model filter on brand pages. */
  model?: string;
  /** Matched by the Material filter on jewellery categories. */
  material?: string;
  featured: boolean;
  /** Photographed pieces lead, whatever the sort. */
  hasPhoto: boolean;
};

export type GridQuery = {
  model?: string;
  material?: string;
  /** "featured" (default), "a-z", "z-a". */
  sort?: string;
};

/**
 * The same order the server used to produce: photographed first, then the
 * chosen tiebreak. Kept as one pure function so the default the server renders
 * and the order the browser re-renders cannot drift apart.
 */
export function filterTiles(tiles: GridTile[], q: GridQuery = {}): GridTile[] {
  let out = tiles;
  if (q.model) out = out.filter((t) => t.model === q.model);
  if (q.material) out = out.filter((t) => t.material === q.material);

  const tiebreak =
    q.sort === "a-z"
      ? (a: GridTile, b: GridTile) => a.title.localeCompare(b.title)
      : q.sort === "z-a"
        ? (a: GridTile, b: GridTile) => b.title.localeCompare(a.title)
        : (a: GridTile, b: GridTile) => Number(b.featured) - Number(a.featured);

  return out
    .slice()
    .sort((a, b) => Number(b.hasPhoto) - Number(a.hasPhoto) || tiebreak(a, b));
}

/** The query as the URL carries it, for a link somebody may have been sent. */
export function queryFromSearch(search: string): GridQuery {
  const p = new URLSearchParams(search);
  return {
    model: p.get("model") ?? undefined,
    material: p.get("material") ?? undefined,
    sort: p.get("sort") ?? undefined,
  };
}

/** …and back, so the address bar still describes what is on screen. */
export function searchFromQuery(q: GridQuery): string {
  const p = new URLSearchParams();
  if (q.model) p.set("model", q.model);
  if (q.material) p.set("material", q.material);
  if (q.sort && q.sort !== "featured") p.set("sort", q.sort);
  const s = p.toString();
  return s ? `?${s}` : "";
}
