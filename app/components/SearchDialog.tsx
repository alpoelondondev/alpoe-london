"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Fuse from "fuse.js";
import type { SearchIndexEntry } from "@/lib/types";

type Suggestion = { name: string; url: string; kind: "Brand" | "Category" };

export default function SearchDialog({
  open,
  onClose,
  index,
  suggestions,
}: {
  open: boolean;
  onClose: () => void;
  index: SearchIndexEntry[];
  suggestions: Suggestion[];
}) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const fuse = useMemo(
    () =>
      new Fuse(index, {
        keys: [
          { name: "title", weight: 0.4 },
          { name: "brand", weight: 0.25 },
          { name: "model", weight: 0.15 },
          { name: "reference", weight: 0.1 },
          { name: "materials", weight: 0.05 },
          { name: "category", weight: 0.05 },
        ],
        threshold: 0.35,
        ignoreLocation: true,
      }),
    [index],
  );

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 20);
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  const productResults = q ? fuse.search(q, { limit: 8 }).map((r) => r.item) : [];
  const suggestionResults = q
    ? suggestions.filter((s) => s.name.toLowerCase().includes(q.toLowerCase())).slice(0, 6)
    : suggestions.slice(0, 8);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search products"
      className="fixed inset-0 z-[900] bg-bg/90 backdrop-blur-sm flex items-start justify-center pt-24 px-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl bg-bg border border-fg/20">
        <div className="flex items-center gap-3 border-b border-fg/20 px-4 py-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-dim">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search Rolex, engagement rings, reference numbers…"
            className="flex-1 bg-transparent outline-none text-[15px] placeholder:text-dim"
            aria-label="Search"
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close search"
            className="text-dim hover:text-fg text-[11px] tracking-[0.14em] uppercase"
          >
            Esc
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {q ? (
            <>
              <Group title="Products">
                {productResults.length ? (
                  productResults.map((p) => (
                    <ResultLink
                      key={p.id}
                      href={p.url}
                      title={p.title}
                      meta={[p.brand, p.model, p.reference].filter(Boolean).join(" · ")}
                      onClick={onClose}
                    />
                  ))
                ) : (
                  <p className="px-4 py-3 text-dim text-[12px]">No products match — try a brand or category.</p>
                )}
              </Group>
              <Group title="Brands & Categories">
                {suggestionResults.length ? (
                  suggestionResults.map((s) => (
                    <ResultLink key={s.url} href={s.url} title={s.name} meta={s.kind} onClick={onClose} />
                  ))
                ) : null}
              </Group>
            </>
          ) : (
            <Group title="Browse">
              {suggestions.map((s) => (
                <ResultLink key={s.url} href={s.url} title={s.name} meta={s.kind} onClick={onClose} />
              ))}
            </Group>
          )}
        </div>
      </div>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="px-4 pt-4 pb-2 text-[10px] tracking-[0.2em] uppercase text-accent">{title}</p>
      <ul>{children}</ul>
    </div>
  );
}

function ResultLink({
  href,
  title,
  meta,
  onClick,
}: {
  href: string;
  title: string;
  meta?: string;
  onClick?: () => void;
}) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className="flex items-center justify-between gap-4 px-4 py-3 hover:bg-fg/[0.05] transition"
      >
        <span className="text-[14px]">{title}</span>
        {meta ? (
          <span className="text-[10px] tracking-[0.14em] uppercase text-dim shrink-0">{meta}</span>
        ) : null}
      </Link>
    </li>
  );
}
