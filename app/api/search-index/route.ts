import { buildSearchIndex } from "@/lib/products";

/**
 * The catalogue search index, fetched rather than embedded.
 *
 * It used to travel inside every page. `<SiteHeader>` sits in the layout, so
 * every one of the site's 456 documents carried the whole index — and carried
 * it *twice*, once in the server-rendered markup and again in the React Flight
 * payload that hydrates it. That is roughly 73KB of the homepage's 223KB of
 * serialised props, on every page, to serve a dialog that most visitors never
 * open. Every one of them paid to download and parse it anyway.
 *
 * Moving it here costs one request, made when somebody actually opens search
 * (or quietly on idle, once the page has finished loading — see
 * SearchTrigger). The index is derived from a CSV that only changes at build
 * time, so it can be cached hard at every layer.
 */
export const dynamic = "force-static";

export function GET() {
  return Response.json(buildSearchIndex(), {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
