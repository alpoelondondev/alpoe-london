import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/**
 * Crawl rules.
 *
 * Two things are going on here beyond "let everyone in".
 *
 * The first is crawl budget. A small site gets a small allowance, and the
 * search page will happily mint a distinct URL for every query anyone has ever
 * typed — an unbounded space of near-identical pages that all resolve to the
 * same handful of products. Those URLs carry noindex on the page itself, but a
 * crawler has to fetch a page to learn that, so blocking the query form here
 * stops the fetch from happening at all and leaves the allowance for the
 * product and guide pages we actually want indexed.
 *
 * The second is AI assistants. Every one of these agents is allowed by the
 * wildcard rule already, so naming them changes no behaviour today. It is
 * written down because two of them — Google-Extended and Applebot-Extended —
 * exist *only* as opt-outs, and because being quoted by ChatGPT, Claude,
 * Perplexity and AI Overviews for "bespoke jeweller in Hatton Garden" is worth
 * as much to this business as a blue link. Stating the permission explicitly
 * means nobody removes it by accident while tightening something else, and it
 * pairs with /llms.txt, which tells those same agents what is on the site.
 */

const AI_AGENTS = [
  "GPTBot", // OpenAI training + ChatGPT browsing corpus
  "OAI-SearchBot", // ChatGPT search index
  "ChatGPT-User", // a person asking ChatGPT to open our page
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended", // Gemini / AI Overviews grounding — opt-out by default
  "Applebot",
  "Applebot-Extended", // Apple Intelligence — opt-out by default
  "meta-externalagent",
  "Amazonbot",
  "Bytespider",
  "cohere-ai",
  "Diffbot",
  "DuckAssistBot",
  "MistralAI-User",
  "YouBot",
];

// Anything that is a real page but has no business in an index: the search
// results screen and its query permutations, and the ring builder's internal
// verification endpoint.
const CRAWL_WASTE = ["/search?", "/*?q=", "/ring-builder/verify"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: CRAWL_WASTE },
      ...AI_AGENTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: CRAWL_WASTE,
      })),
    ],
    sitemap: siteUrl("/sitemap.xml"),
    host: siteUrl(),
  };
}
