"use client";

import type { GridQuery } from "./gridTile";

type Option = { value: string; label: string };

/**
 * The model / material / sort controls.
 *
 * Controlled, and no longer aware of the router. It used to own the query
 * itself, reading `useSearchParams` and calling `router.replace` on every
 * change — which put a navigation behind a dropdown and, more expensively,
 * meant the page it sat on had to read `searchParams` on the server and could
 * never be static. CatalogueGrid holds the state now; this is the control
 * surface for it.
 */
export default function Filters({
  modelOptions,
  materialOptions,
  value,
  onChange,
}: {
  modelOptions?: Option[];
  materialOptions?: Option[];
  value: GridQuery;
  onChange: (next: GridQuery) => void;
}) {
  const set = (key: keyof GridQuery, v: string) =>
    onChange({ ...value, [key]: v || undefined });

  return (
    <div className="flex flex-wrap gap-3 items-center mt-6 mb-10 text-[11px] tracking-[0.14em] uppercase">
      {modelOptions?.length ? (
        <label className="flex items-center gap-2 border border-fg/20 px-3 py-2">
          <span className="text-dim">Model</span>
          <select
            value={value.model ?? ""}
            onChange={(e) => set("model", e.target.value)}
            className="bg-transparent text-fg outline-none tracking-[0.14em] uppercase"
          >
            <option value="" className="bg-bg">All</option>
            {modelOptions.map((o) => (
              <option key={o.value} value={o.value} className="bg-bg">
                {o.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      {materialOptions?.length ? (
        <label className="flex items-center gap-2 border border-fg/20 px-3 py-2">
          <span className="text-dim">Material</span>
          <select
            value={value.material ?? ""}
            onChange={(e) => set("material", e.target.value)}
            className="bg-transparent text-fg outline-none tracking-[0.14em] uppercase"
          >
            <option value="" className="bg-bg">All</option>
            {materialOptions.map((o) => (
              <option key={o.value} value={o.value} className="bg-bg">
                {o.label}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      <label className="flex items-center gap-2 border border-fg/20 px-3 py-2 ml-auto">
        <span className="text-dim">Sort</span>
        <select
          value={value.sort ?? "featured"}
          onChange={(e) => set("sort", e.target.value)}
          className="bg-transparent text-fg outline-none tracking-[0.14em] uppercase"
        >
          <option value="featured" className="bg-bg">Featured</option>
          <option value="a-z" className="bg-bg">A–Z</option>
          <option value="z-a" className="bg-bg">Z–A</option>
        </select>
      </label>
    </div>
  );
}
