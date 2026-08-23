"use client";

import { useEffect, useState } from "react";
import Filters from "./Filters";
import GridEmpty from "./GridEmpty";
import ProductTile, { TILE_GRID_CLASS } from "./ProductTile";
import {
  filterTiles,
  queryFromSearch,
  searchFromQuery,
  type GridQuery,
  type GridTile,
} from "./gridTile";

/**
 * A listing grid with its filters, filtered in the browser.
 *
 * ── Why not `useSearchParams` ──
 *
 * The obvious version reads the query with `useSearchParams`. It cannot be
 * used here: in a statically rendered page that hook pushes its component past
 * the nearest Suspense boundary and out of the prerender, so what ships in the
 * HTML is the fallback and not the tiles. A brand page whose ninety listings
 * exist only after hydration is worse than the server render it replaced —
 * that is the page's entire content, and crawlers would find an empty grid.
 *
 * So the state lives here instead. The server renders the default order — every
 * tile, in the HTML, exactly as before — and the URL is read once after mount
 * for anyone arriving on a filtered link. Changing a filter writes the URL back
 * with `replaceState` rather than a navigation: the address stays shareable, and
 * nothing about it makes the route dynamic.
 *
 * The one visible cost is that a filtered link paints unfiltered for a frame
 * before the effect runs. Against it: the page is static, served from the edge,
 * and complete without JavaScript.
 */
export default function CatalogueGrid({
  tiles,
  modelOptions,
  materialOptions,
}: {
  tiles: GridTile[];
  modelOptions?: { value: string; label: string }[];
  materialOptions?: { value: string; label: string }[];
}) {
  const [query, setQuery] = useState<GridQuery>({});

  // After mount, not during render: reading location while prerendering would
  // throw, and seeding state from it would not match the HTML anyway.
  useEffect(() => {
    const fromUrl = queryFromSearch(window.location.search);
    if (fromUrl.model || fromUrl.material || fromUrl.sort) setQuery(fromUrl);
  }, []);

  const apply = (next: GridQuery) => {
    setQuery(next);
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${searchFromQuery(next)}`,
    );
  };

  const shown = filterTiles(tiles, query);

  return (
    <>
      <Filters
        modelOptions={modelOptions}
        materialOptions={materialOptions}
        value={query}
        onChange={apply}
      />
      {shown.length ? (
        <div className={TILE_GRID_CLASS}>
          {shown.map((t, i) => (
            <ProductTile
              key={t.id}
              href={t.href}
              image={t.image}
              alt={t.alt}
              title={t.title}
              meta={t.meta}
              cta="View Details"
              priority={i < 3}
              ariaLabel={`View ${t.title}`}
            />
          ))}
        </div>
      ) : (
        <GridEmpty />
      )}
    </>
  );
}
