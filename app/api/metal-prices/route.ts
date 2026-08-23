import { getMetalPrices } from "@/lib/metal-prices";

/**
 * Spot, fetched rather than rendered into every page.
 *
 * The announcement strip in the bar used to be built on the server, and
 * `SiteHeader` sits above every route — so a five-minute `revalidate` on the
 * upstream price fetch became a five-minute revalidate on all 535 pages. Every
 * one of them then re-rendered in a function the first time it was asked for
 * after its window expired, which is a serverless invocation per page per five
 * minutes to keep a gold price current. A crawler alone can drive that into
 * the tens of thousands a day.
 *
 * One route instead. It is prerendered and revalidated on the same five-minute
 * cadence, and the Cache-Control header lets the CDN hold it for the same
 * window, so a busy five minutes is one origin call rather than one per page.
 * Everything above it goes back to being static HTML off the edge.
 */
export const revalidate = 300;

export async function GET() {
  return Response.json(await getMetalPrices(), {
    headers: {
      "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=3600",
    },
  });
}
