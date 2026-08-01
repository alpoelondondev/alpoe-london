import Link from "next/link";
import { breadcrumbLd, ldJsonGraph } from "@/lib/seo";

export type Crumb = { name: string; href: string; current?: boolean };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  const ld = ldJsonGraph([breadcrumbLd(items.map((i) => ({ name: i.name, url: i.href })))]);
  return (
    <>
      <nav
        aria-label="Breadcrumb"
        className="text-[11px] tracking-[0.14em] uppercase text-dim"
      >
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {items.map((item, i) => {
            const last = i === items.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-2">
                {last ? (
                  <span aria-current="page" className="text-fg">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="opacity-70 hover:opacity-100 transition-opacity"
                  >
                    {item.name}
                  </Link>
                )}
                {!last ? <span aria-hidden="true" className="text-accent">/</span> : null}
              </li>
            );
          })}
        </ol>
      </nav>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
    </>
  );
}
