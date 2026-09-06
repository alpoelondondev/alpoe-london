import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceGuideView from "../../components/ServiceGuideView";
import { serviceGuideBySlug } from "@/lib/services/serviceGuides";
import { pageMetadata } from "@/lib/seo";

/* A static child of /services, sharing <ServiceGuideView> with the others. */

const SLUG = "ring-remodelling";

export const metadata: Metadata = (() => {
  const g = serviceGuideBySlug(SLUG)!;
  return pageMetadata({
    title: g.title,
    description: g.description,
    path: g.path,
    image: "/og/bespoke.jpg",
  });
})();

export default function Page() {
  const g = serviceGuideBySlug(SLUG);
  if (!g) notFound();
  return <ServiceGuideView guide={g} />;
}
