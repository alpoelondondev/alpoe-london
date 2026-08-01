"use client";

export default function BraceletSelector({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div className="mt-8">
      <p className="text-[11px] tracking-[0.18em] uppercase text-dim mb-3">Bracelet</p>
      <div role="radiogroup" aria-label="Bracelet" className="flex flex-wrap gap-3">
        {options.map((opt) => {
          const active = opt === value;
          return (
            <button
              key={opt}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(opt)}
              className={`px-4 py-2 text-[11px] tracking-[0.14em] uppercase border transition ${
                active
                  ? "bg-accent text-bg border-accent"
                  : "border-white/20 text-fg/70 hover:text-fg hover:border-white/40"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
