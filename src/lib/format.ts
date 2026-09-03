import type { Locale } from "@/i18n/config";

const INTL_LOCALE: Record<Locale, string> = {
  uz: "uz-UZ",
  ru: "ru-RU",
  en: "en-GB",
};

/**
 * Short absolute date, e.g. "3 сент., 14:00".
 *
 * Short month rather than long: the meta line sits in a 307px column next to
 * the author name, and "3 сентября в 14:00 · Нигора Азизова" wraps to two
 * lines there, which the design does not.
 *
 * The Figma shows relative times ("2 часа назад") on some cards, but under
 * static export the HTML is generated at build time - a relative string would
 * be frozen at build and drift further from the truth every hour. Once we move
 * to ISR with on-demand revalidation, relative times become viable.
 */
export function formatArticleDate(iso: string, locale: Locale): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(INTL_LOCALE[locale], {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Tashkent",
  }).format(date);
}
