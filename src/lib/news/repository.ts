import type { Article, CategorySlug, Stat } from "./types";
import type { Locale } from "@/i18n/config";

/**
 * Everything the site needs from the content backend.
 *
 * This is the single swap point. Today it resolves to fixtures; when the admin
 * team ships their REST API, write an implementation that fetches from it and
 * change `getNewsRepository` below. No component imports anything else.
 */
export interface NewsRepository {
  /** Lead story plus the secondary stories beside it. */
  getTopStories(locale: Locale, limit: number): Promise<Article[]>;
  /** Most-read, used by both the main column and the sidebar. */
  getPopular(locale: Locale, limit: number): Promise<Article[]>;
  getByCategory(
    locale: Locale,
    category: CategorySlug,
    limit: number,
  ): Promise<Article[]>;
  /** Single highlighted figure - the "Цифра дня" block. */
  getStatOfTheDay(locale: Locale): Promise<Stat | null>;
  /** Carousel of recent figures. */
  getRecentStats(locale: Locale, limit: number): Promise<Stat[]>;
}

import { mockNewsRepository } from "./mock-repository";

export function getNewsRepository(): NewsRepository {
  return mockNewsRepository;
}
