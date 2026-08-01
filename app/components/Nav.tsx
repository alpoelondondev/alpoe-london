"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import SearchTrigger from "./SearchTrigger";
import type { SearchIndexEntry } from "@/lib/types";

type Suggestion = { name: string; url: string; kind: "Brand" | "Category" };

const LINKS = [
  { label: "Watches", href: "/watches" },
  { label: "Jewellery", href: "/jewellery" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export default function Nav({
  searchIndex,
  suggestions,
}: {
  searchIndex: SearchIndexEntry[];
  suggestions: Suggestion[];
}) {
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      setHidden(y > 80 && y > lastY.current);
      lastY.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Link
        href="/"
        className="fixed top-2.5 left-[52px] z-[201] block max-md:left-6 max-md:top-2"
        aria-label="Alpoe London — Home"
      >
        <Image
          src="/alpoe-london-logo-transparent.svg"
          alt="Alpoe London"
          width={48}
          height={48}
          className="opacity-90"
          priority
        />
      </Link>

      <nav
        className={`fixed top-0 left-0 right-0 z-200 px-[52px] py-4 flex justify-between items-center bg-bg/80 backdrop-blur-md border-b border-black/[0.07] max-md:px-6 max-md:py-3 transition-transform duration-300 ${
          hidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="w-10 h-10" />
        <ul className="flex gap-11 list-none max-md:hidden">
          {LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-[11px] tracking-[0.14em] uppercase text-fg no-underline opacity-70 transition-opacity duration-200 hover:opacity-100"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-5">
          <SearchTrigger index={searchIndex} suggestions={suggestions} />
          <button
            type="button"
            aria-label="Menu"
            className="hidden max-md:inline-flex text-[11px] tracking-[0.14em] uppercase text-fg/80"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      {mobileOpen ? (
        <div className="fixed inset-0 z-[199] bg-bg/95 backdrop-blur-md pt-20 px-6 hidden max-md:block">
          <ul className="flex flex-col gap-6">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-serif text-3xl tracking-[0.02em]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}
