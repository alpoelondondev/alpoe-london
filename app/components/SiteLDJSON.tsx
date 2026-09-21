import { ldJsonGraph, allLocationsLd, organizationLd, websiteLd } from "@/lib/seo";

export default function SiteLDJSON() {
  // Both shops, as separate LocalBusiness nodes. One node cannot carry two
  // addresses in a way a local result understands, so each city gets its own.
  const graph = ldJsonGraph([
    organizationLd(),
    ...allLocationsLd(),
    websiteLd(),
  ]);
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
