export type NewsItem = {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
};

/**
 * Latest metals coverage, taken from Google News' RSS search. No key and no
 * account — the feed is public — so this stays a plain server-side fetch on the
 * same cache window as the prices beside it.
 *
 * The query is deliberately narrow: "gold" alone drags in awards, medals and
 * football, none of which belong under a spot table.
 */
const FEED =
  "https://news.google.com/rss/search?q=" +
  encodeURIComponent('"gold price" OR "silver price" OR bullion OR "precious metals"') +
  "&hl=en-GB&gl=GB&ceid=GB:en";

/** RSS carries entities twice over — once for XML, once for the HTML inside. */
function decodeEntities(s: string) {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .trim();
}

function tag(block: string, name: string) {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`));
  if (!m) return "";
  return decodeEntities(m[1].replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1"));
}

/**
 * Google suffixes the publisher onto every headline ("… - Reuters"). The
 * publisher already has its own column, so the tail comes off rather than
 * being printed twice.
 */
function stripSourceSuffix(title: string, source: string) {
  if (!source) return title;
  const suffix = ` - ${source}`;
  return title.endsWith(suffix) ? title.slice(0, -suffix.length).trim() : title;
}

export async function getMetalsNews(limit = 8): Promise<NewsItem[]> {
  try {
    const res = await fetch(FEED, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; AlpoeLondon/1.0)" },
      next: { revalidate: 900 },
    });
    if (!res.ok) throw new Error(`News feed responded ${res.status}`);
    const xml = await res.text();

    const items: NewsItem[] = [];
    for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
      const block = m[1];
      const source = tag(block, "source");
      const title = stripSourceSuffix(tag(block, "title"), source);
      const url = tag(block, "link");
      const publishedAt = tag(block, "pubDate");
      if (!title || !url) continue;
      items.push({ title, url, source, publishedAt });
      if (items.length >= limit) break;
    }
    return items;
  } catch (err) {
    // The table beside it is the point of the page — a dead feed hides the
    // list rather than taking the page down with it.
    console.error("Metals news fetch failed:", err);
    return [];
  }
}

/** "3 hours ago" — how old a headline is matters more than when it ran. */
export function formatAge(pubDate: string, now: Date = new Date()) {
  const then = new Date(pubDate);
  if (Number.isNaN(then.getTime())) return "";
  const mins = Math.round((now.getTime() - then.getTime()) / 60000);
  if (mins < 2) return "just now";
  if (mins < 60) return `${mins} minutes ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}
