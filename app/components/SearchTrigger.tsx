"use client";

import { useEffect, useState } from "react";
import type { SearchIndexEntry } from "@/lib/types";
import SearchDialog from "./SearchDialog";

type Suggestion = { name: string; url: string; kind: "Brand" | "Category" };

/**
 * The search entry point is a bar rather than the magnifier icon it used to be.
 * It sits on its own row under the lockup and reads as a field you can type
 * into, so search is a visible invitation instead of a glyph people have to
 * recognise. It is still a button that opens the dialog — the real input lives
 * there, focused on open, so there is one search implementation rather than two
 * and no state to hand across.
 */
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
        className="group flex w-full items-center gap-2.5 border border-fg/15 bg-fg/[0.03] px-4 py-2.5 text-left transition hover:border-accent/50 hover:bg-fg/[0.06]"
        aria-label="Search"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="shrink-0 text-dim transition-colors group-hover:text-accent"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <span className="truncate text-[12px] text-dim">
          Search watches, jewellery, references…
        </span>
        {/* The slash shortcut still works; the hint only shows where there is
            a keyboard to press it on. */}
        <kbd className="ml-auto shrink-0 border border-fg/15 px-1.5 py-0.5 text-[10px] leading-none text-dim max-md:hidden">
          /
        </kbd>
      </button>
      <SearchDialog open={open} onClose={() => setOpen(false)} index={index} suggestions={suggestions} />
    </>
  );
}
