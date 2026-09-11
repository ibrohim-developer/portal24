import type { MetadataRoute } from "next";

import { getNewsRepository } from "@/lib/news/repository";
import { absoluteUrl } from "@/lib/site";

/**
 * Rebuilt at most every 15 minutes, the same timer as the article pages.
 *
 * Like any ISR route, the request that finds this expired is answered with the
 * old copy while the new one renders. Rendering per request instead would walk
 * the whole CMS archive for anyone who fetched the file, against an API that
 * rate-limits at 120 requests a minute.
 */
export const revalidate = 900;

/**
 * Every indexable URL on the site - the file submitted to Search Console.
 *
 * Left out on purpose:
 *
 *  - `/search/`, which is `noindex`.
 *  - `/authors/[slug]/`. Those pages still serve the three fixture writers,
 *    not anyone the CMS knows (see `api-repository`); list them once bylines
 *    come from the API.
 *
 * No `priority` or `changeFrequency`: Google ignores both. `lastModified` is
 * set only where it is true - a story's publication time, or the newest story
 * in a feed - because Google does read it, but stops trusting it on a site
 * that stamps every URL with the time of the build.
 *
 * A sitemap holds at most 50,000 URLs. When the archive nears that, split it
 * with `generateSitemaps`.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const repo = getNewsRepository("api");

  const [categories, articles] = await Promise.all([
    repo.getCategories(),
    repo.getAllArticles(),
  ]);

  // The archive comes newest first, so the first story seen in a category is
  // its latest. `publishedAt` is "" when the CMS date could not be parsed.
  const latestIn = new Map<string, string>();
  for (const { category, publishedAt } of articles) {
    if (publishedAt && !latestIn.has(category.slug)) {
      latestIn.set(category.slug, publishedAt);
    }
  }

  const latest = articles.find((article) => article.publishedAt)?.publishedAt;

  return [
    { url: absoluteUrl("/"), lastModified: latest },
    { url: absoluteUrl("/popular/") },
    { url: absoluteUrl("/about/") },
    ...categories.map((category) => ({
      url: absoluteUrl(`/${category.slug}/`),
      lastModified: latestIn.get(category.slug),
    })),
    ...articles.map((article) => ({
      url: absoluteUrl(`/news/${article.slug}/`),
      lastModified: article.publishedAt || undefined,
    })),
  ];
}
