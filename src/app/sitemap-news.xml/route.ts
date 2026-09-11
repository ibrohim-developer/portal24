import { getNewsRepository } from "@/lib/news/repository";
import { absoluteUrl } from "@/lib/site";
import { strings } from "@/lib/strings";

/**
 * Rebuilt at most once a minute, the front page's timer.
 *
 * As with any ISR route, the request that finds this expired still gets the
 * old copy while the new one renders, so a crawler that is the only visitor
 * sees the list as of its previous visit. Rendering per request would close
 * that gap, but would also hand anyone a URL that spends a CMS call per hit
 * against an API limited to 120 requests a minute.
 */
export const revalidate = 60;

/** Google reads a news sitemap for stories from the last two days only... */
const WINDOW_MS = 2 * 24 * 60 * 60 * 1000;

/** ...and for at most 1,000 of them. */
const MAX_ENTRIES = 1000;

function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * The Google News sitemap: the last two days of stories, each with the title
 * and publication time Google News reads, so a new story can be found before
 * a crawl of the front page would reach it.
 *
 * A route handler rather than a second `sitemap.ts`, because Next's
 * `MetadataRoute.Sitemap` has no `news:` fields.
 *
 * `news:name` has to match the publication's name as Google News shows it. It
 * reads `strings.site.name`, the name every page gives as `og:site_name`.
 */
export async function GET() {
  const since = new Date(Date.now() - WINDOW_MS);
  const articles = await getNewsRepository("api").getPublishedSince(since);

  const entries = articles.slice(0, MAX_ENTRIES).map(
    (article) => `  <url>
    <loc>${escapeXml(absoluteUrl(`/news/${article.slug}/`))}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(strings.site.name)}</news:name>
        <news:language>uz</news:language>
      </news:publication>
      <news:publication_date>${article.publishedAt}</news:publication_date>
      <news:title>${escapeXml(article.title.trim())}</news:title>
    </news:news>
  </url>`,
  );

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">',
    ...entries,
    "</urlset>",
    "",
  ].join("\n");

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
