/**
 * The site's public origin.
 *
 * The root layout hands this to `metadataBase`, which turns each page's
 * relative canonical into an absolute URL. The sitemap and robots.txt have no
 * `metadataBase` to lean on and print absolute URLs themselves, so all three
 * read the host from here - a sitemap naming a different host from the
 * canonicals on the pages it lists would give crawlers two answers to which
 * URL is the real one.
 */
export const SITE_URL = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://portal24.uz",
);

/** `"/news/foo/"` -> `"https://portal24.uz/news/foo/"`. */
export function absoluteUrl(path: string): string {
  return new URL(path, SITE_URL).href;
}
