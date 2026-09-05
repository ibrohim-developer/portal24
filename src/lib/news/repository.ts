import type {
  Article,
  ArticleDetail,
  AuthorProfile,
  CategorySlug,
  Highlight,
  Stat,
} from "./types";
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
  /** Carousel of short vertical videos - the "Главное за минуту" block. */
  getHighlights(locale: Locale, limit: number): Promise<Highlight[]>;

  /**
   * Every article the search page may match, newest first.
   *
   * The search page is a static export: there is no server to run a query
   * against, so the whole index ships to the browser and `matchArticles`
   * filters it there. Keep this to what a card renders - a body would blow up
   * the payload for a gain no card would show.
   *
   * When the admin API lands this is the one call that becomes a real `?q=`
   * endpoint, and the page stops embedding anything.
   */
  getSearchIndex(locale: Locale): Promise<Article[]>;

  /** One article page. Returns null - rather than throwing - on a bad slug. */
  getArticle(locale: Locale, slug: string): Promise<ArticleDetail | null>;
  /**
   * Every article slug in this locale.
   *
   * `output: "export"` renders each page at build time, so the route needs the
   * whole list up front - there is no server left to handle a miss at runtime.
   */
  getSlugs(locale: Locale): Promise<string[]>;
  /** The "read also" feed under an article, excluding the article itself. */
  getRelated(locale: Locale, slug: string, limit: number): Promise<Article[]>;

  /** One author page. Null - rather than a throw - on a bad slug. */
  getAuthor(locale: Locale, slug: string): Promise<AuthorProfile | null>;
  /** Every author slug, for the same build-time reason as `getSlugs`. */
  getAuthorSlugs(locale: Locale): Promise<string[]>;
  /** The author page's "Популярные статьи" block - their most-read stories. */
  getPopularByAuthor(
    locale: Locale,
    slug: string,
    limit: number,
  ): Promise<Article[]>;
  /**
   * That author's articles, newest first.
   *
   * `limit` is what the page renders today; when the API lands this is the
   * call that grows an offset and the design's "show more" becomes real.
   */
  getByAuthor(locale: Locale, slug: string, limit: number): Promise<Article[]>;
}

import { mockNewsRepository } from "./mock-repository";

export function getNewsRepository(): NewsRepository {
  return mockNewsRepository;
}
