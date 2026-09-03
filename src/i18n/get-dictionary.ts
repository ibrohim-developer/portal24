import type { Locale } from "./config";

// Dictionaries are imported lazily so a page only ships the one locale it renders.
const dictionaries = {
  uz: () => import("./dictionaries/uz.json").then((m) => m.default),
  ru: () => import("./dictionaries/ru.json").then((m) => m.default),
  en: () => import("./dictionaries/en.json").then((m) => m.default),
};

/**
 * Shape of every dictionary. uz is the source of truth - if ru.json or en.json
 * drift from it, `next build` fails on the type error rather than rendering
 * an undefined string in production.
 */
export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["uz"]>>;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
