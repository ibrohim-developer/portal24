import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site";

/**
 * Crawl everything, and here are the sitemaps: the whole archive, and the last
 * two days for Google News.
 *
 * `/search/` is deliberately not disallowed. The page carries `noindex`, and a
 * crawler barred from fetching it never sees that tag - Google can still index
 * the bare URL from a link, just without being told not to.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: [absoluteUrl("/sitemap.xml"), absoluteUrl("/sitemap-news.xml")],
  };
}
