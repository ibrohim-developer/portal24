/**
 * Which image hosts this site will put through the Next optimizer.
 *
 * One list, imported by `next.config.ts` as its `images.remotePatterns` and by
 * the components as the test below, so the config and the guard cannot drift
 * apart - a host in one but not the other is exactly the crash this exists to
 * prevent.
 */
export const IMAGE_REMOTE_PATTERNS = [
  {
    protocol: "https" as const,
    hostname: "api.portal24.uz",
    pathname: "/uploads/**",
  },
];

/**
 * Whether `next/image` may optimize this URL.
 *
 * The CMS's own uploads can be: they are ours, they are on one known host, and
 * resizing them is where the front page's 85% saving comes from.
 *
 * Body images cannot be assumed to be ours. Editors paste `<img>` straight
 * from other publications - across 600 articles, 22 body images came from 16
 * different domains (gazeta.uz, openai.com, yandex avatars, a watch blog) and
 * the list grows with every story. An allowlist cannot keep up, and pointing
 * the optimizer at arbitrary URLs would make this server fetch anything an
 * editor typed. So a foreign image renders unoptimized instead: `next/image`
 * skips the loader entirely for those, which is also what skips the host check
 * that was crashing the page.
 *
 * Relative URLs are ours by definition.
 */
export function canOptimizeImage(url: string): boolean {
  if (url.startsWith("/")) return true;

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }

  return IMAGE_REMOTE_PATTERNS.some(
    (pattern) =>
      parsed.protocol === `${pattern.protocol}:` &&
      parsed.hostname === pattern.hostname &&
      // The patterns end in `/**`, which matches any path below the prefix.
      parsed.pathname.startsWith(pattern.pathname.replace(/\*\*$/, "")),
  );
}
