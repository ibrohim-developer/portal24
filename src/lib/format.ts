/**
 * The site publishes in Uzbek only, so every date is formatted for one locale.
 * `uz-UZ` is the Latin-script Uzbek ICU data - the same output as bare `uz`.
 */
const INTL_LOCALE = "uz-UZ";

/**
 * Short absolute date, e.g. "3-sen, 14:00".
 *
 * Short month rather than long: the meta line sits in a 307px column next to
 * the author name, and a long month wraps to two lines there, which the design
 * does not.
 *
 * The Figma shows relative times ("2 soat oldin") on some cards, but under
 * static export the HTML is generated at build time - a relative string would
 * be frozen at build and drift further from the truth every hour. Once we move
 * to ISR with on-demand revalidation, relative times become viable.
 */
export function formatArticleDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(INTL_LOCALE, {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Tashkent",
  }).format(date);
}

/**
 * Bare day + month, e.g. "13-iyun" - the stamp on the "Soʻnggi kunlar
 * raqamlari" cards, which carry no time and no year in the design.
 */
export function formatStatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(INTL_LOCALE, {
    day: "numeric",
    month: "long",
    timeZone: "Asia/Tashkent",
  }).format(date);
}
