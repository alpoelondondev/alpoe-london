"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";

type Option = { value: string; label: string };

export default function Filters({
  modelOptions,
  materialOptions,
  showStock = true,
}: {
  modelOptions?: Option[];
  materialOptions?: Option[];
  showStock?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const current = {
    stock: params.get("stock") ?? "all",
    model: params.get("model") ?? "",
    material: params.get("material") ?? "",
    sort: params.get("sort") ?? "featured",
  };

  const setParam = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (!value || value === "all" || value === "") next.delete(key);
      else next.set(key, value);
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [params, pathname, router],
  );

  return (
    <div className="flex flex-wrap gap-3 items-center mt-6 mb-10 text-[11px] tracking-[0.14em] uppercase">
      {showStock ? (
        <div role="group" aria-label="Stock filter" className="flex border border-white/10">
          {(
            [
              { value: "all", label: "All" },
              { value: "in_stock", label: "In Stock" },
              { value: "sourceable", label: "Sourceable" },
            ] as const
          ).map((opt) => {
            const active = current.stock === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setParam("stock", opt.value)}
                className={`px-3 py-2 transition ${
                  active ? "bg-accent text-bg" : "text-fg/70 hover:text-fg"
                }`}
                aria-pressed={active}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      ) : null}

      {modelOptions?.length ? (
        <label className="flex items-center gap-2 border border-white/10 px-3 py-2">
          <span className="text-dim">Model</span>
          <select
            value={current.model}
            onChange={(e) => setParam("model", e.target.value)}
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
        <label className="flex items-center gap-2 border border-white/10 px-3 py-2">
          <span className="text-dim">Material</span>
          <select
            value={current.material}
            onChange={(e) => setParam("material", e.target.value)}
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

      <label className="flex items-center gap-2 border border-white/10 px-3 py-2 ml-auto">
        <span className="text-dim">Sort</span>
        <select
          value={current.sort}
          onChange={(e) => setParam("sort", e.target.value)}
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
