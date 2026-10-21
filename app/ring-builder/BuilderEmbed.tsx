"use client";

import { useSearchParams } from "next/navigation";
import { builderAddresses } from "@/lib/ring-builder";

export default function BuilderEmbed() {
  const params = useSearchParams();
  const { embed, hosted } = builderAddresses(params);
  return (
    <div className="bg-white pt-[var(--nav-h)]">
      <iframe
        src={embed}
        title="Alpoe London Complete ring builder, powered by softwarebosh.com"
        allow="camera; accelerometer; gyroscope; screen-wake-lock; clipboard-write; fullscreen"
        allowFullScreen
        className="block h-[calc(100svh-var(--nav-h))] min-h-[34rem] w-full border-0"
      />
      <p className="on-sheet px-6 py-3 text-center text-sm text-sheet-dim">
        Prefer a separate window?{" "}
        <a href={hosted} target="_blank" rel="noopener noreferrer" className="text-sheet-ink underline underline-offset-4">
          Open Alpoe London’s ring builder
        </a>
      </p>
    </div>
  );
}
