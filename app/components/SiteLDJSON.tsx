import { ldJsonGraph, localBusinessLd, organizationLd, websiteLd } from "@/lib/seo";

export default function SiteLDJSON() {
  const graph = ldJsonGraph([organizationLd(), localBusinessLd(), websiteLd()]);
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
