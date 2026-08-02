"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import type { SearchIndexEntry } from "@/lib/types";

const MAX_RESULTS = 6;

/**
 * Inline typeahead for product pages — type a reference or model and jump
 * straight to it if we carry it. Same index the header search uses.
 */
export default function ProductSearch({
  index,
  label = "Looking for a different piece?",
  placeholder = "Search a model or reference — e.g. Submariner, 126710",
}: {
  index: SearchIndexEntry[];
  label?: string;
  placeholder?: string;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fuse = useMemo(
    () =>
      new Fuse(index, {
        keys: [
          { name: "title", weight: 0.4 },
          { name: "reference", weight: 0.25 },
          { name: "model", weight: 0.2 },
          { name: "brand", weight: 0.15 },
          { name: "category", weight: 0.1 },
        ],
        threshold: 0.34,
        ignoreLocation: true,
      }),
    [index],
  );

  const results = useMemo(() => {
    const term = q.trim();
    if (term.length < 2) return [];
    return fuse.search(term, { limit: MAX_RESULTS }).map((r) => r.item);
  }, [q, fuse]);

  const go = (entry: SearchIndexEntry) => {
    setOpen(false);
    setQ("");
    router.push(entry.url);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[active] ?? results[0]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const showList = open && q.trim().length >= 2;

  return (
    <div className="relative w-full">
      <label className="flex flex-col gap-2">
        <span className="text-[10px] tracking-[0.18em] uppercase text-dim">{label}</span>
        <input
          type="search"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          // Delay so a click on a result lands before the list unmounts.
          onBlur={() => {
            blurTimer.current = setTimeout(() => setOpen(false), 120);
          }}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          role="combobox"
          aria-expanded={showList}
          aria-controls="product-search-results"
          aria-autocomplete="list"
          className="w-full border border-black/15 bg-transparent px-4 py-3 text-[14px] text-fg outline-none transition focus:border-accent placeholder:text-dim/70"
        />
      </label>

      {showList ? (
        <ul
          id="product-search-results"
          role="listbox"
          className="absolute left-0 right-0 top-full z-30 mt-1 max-h-[320px] overflow-y-auto border border-black/15 bg-bg shadow-[0_18px_40px_rgba(23,18,18,0.12)]"
        >
          {results.length ? (
            results.map((r, i) => (
              <li key={r.id} role="option" aria-selected={i === active}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={() => {
                    if (blurTimer.current) clearTimeout(blurTimer.current);
                  }}
                  onClick={() => go(r)}
                  className={`flex w-full flex-col items-start gap-0.5 px-4 py-3 text-left transition ${
                    i === active ? "bg-black/[0.05]" : "hover:bg-black/[0.03]"
                  }`}
                >
                  <span className="font-serif text-[15px] leading-tight">{r.title}</span>
                  <span className="text-[10px] tracking-[0.14em] uppercase text-dim">
                    {[r.brand ?? r.category, r.model, r.reference ? `Ref ${r.reference}` : null]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </button>
              </li>
            ))
          ) : (
            <li className="px-4 py-4">
              <p className="text-[13px] text-dim">
                Nothing matching &ldquo;{q.trim()}&rdquo; on site — we can still source it.
              </p>
            </li>
          )}
        </ul>
      ) : null}
    </div>
  );
}
