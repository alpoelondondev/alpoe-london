"use client";

import { useEffect, useState } from "react";
import type { SearchIndexEntry } from "@/lib/types";
import SearchDialog from "./SearchDialog";

type Suggestion = { name: string; url: string; kind: "Brand" | "Category" };

export default function SearchTrigger({
  index,
  suggestions,
}: {
  index: SearchIndexEntry[];
  suggestions: Suggestion[];
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "/" && !open) {
        const tag = (document.activeElement as HTMLElement | null)?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 text-[11px] tracking-[0.14em] uppercase text-fg/70 hover:text-fg transition"
        aria-label="Search"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <span className="max-md:hidden">Search</span>
      </button>
      <SearchDialog open={open} onClose={() => setOpen(false)} index={index} suggestions={suggestions} />
    </>
  );
}
