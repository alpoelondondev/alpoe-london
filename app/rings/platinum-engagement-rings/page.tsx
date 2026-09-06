import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MetalGuideView from "../../components/MetalGuideView";
import { metalGuideBySlug } from "@/lib/rings/metalGuides";
import { pageMetadata } from "@/lib/seo";
import { ROUTES } from "@/lib/routes";

/*
 * A static child of /rings, sharing <MetalGuideView> with the other three
 * metal pages. See that component for why these are static rather than a
 * second dynamic segment beside [shape].
 */

const SLUG = "platinum-engagement-rings";

export const metadata: Metadata = (() => {
  const g = metalGuideBySlug(SLUG)!;
  return pageMetadata({
    title: g.title,
    description: g.description,
    path: ROUTES.platinumEngagementRings,
    image: "/og/engagement-rings.jpg",
  });
})();

export default function Page() {
  const g = metalGuideBySlug(SLUG);
  if (!g) notFound();
  return <MetalGuideView guide={g} />;
}
