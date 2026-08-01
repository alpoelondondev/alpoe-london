import Nav from "./Nav";
import { buildSearchIndex } from "@/lib/products";
import { WATCH_BRANDS, JEWELLERY_CATEGORIES } from "@/lib/taxonomy";

export default function SiteHeader() {
  const index = buildSearchIndex();
  const suggestions = [
    ...WATCH_BRANDS.map((b) => ({
      name: b.name,
      url: `/watches/${b.slug}`,
      kind: "Brand" as const,
    })),
    ...JEWELLERY_CATEGORIES.map((c) => ({
      name: c.name,
      url: `/jewellery/${c.slug}`,
      kind: "Category" as const,
    })),
  ];
  return <Nav searchIndex={index} suggestions={suggestions} />;
}
