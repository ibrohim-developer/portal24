export const locales = ["uz", "ru", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "uz";

/** Shown in the language switcher, in each language's own name. */
export const localeNames: Record<Locale, string> = {
  uz: "O'zbekcha",
  ru: "Русский",
  en: "English",
};

/** `hreflang` values for <link rel="alternate">, which wants BCP 47 tags. */
export const localeHrefLang: Record<Locale, string> = {
  uz: "uz-UZ",
  ru: "ru-RU",
  en: "en",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
