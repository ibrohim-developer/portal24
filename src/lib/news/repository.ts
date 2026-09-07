import type {
  Article,
  ArticleDetail,
  AuthorProfile,
  Category,
  Highlight,
  Stat,
} from "./types";

/**
 * Everything the site needs from the content backend.
 *
 * This is the single swap point. Today it resolves to fixtures; when the admin
 * team ships their REST API, write an implementation that fetches from it and
 * change `getNewsRepository` below. No component imports anything else.
 */
export interface NewsRepository {
  /**
   * Every category the source publishes, in its own order.
   *
   * The fixtures answer with the design's five; the API answers with whatever
   * the CMS holds today, which is a different six. So a page that draws a
   * block per category asks for this rather than importing a constant.
   */
  getCategories(): Promise<Category[]>;
  /** Lead story plus the secondary stories beside it. */
  getTopStories(limit: number): Promise<Article[]>;
  /** Most-read, used by both the main column and the sidebar. */
  getPopular(limit: number): Promise<Article[]>;
  /** Takes a slug from `getCategories`, not a fixed union - see `Category`. */
  getByCategory(category: string, limit: number): Promise<Article[]>;
  /** Single highlighted figure - the "Цифра дня" block. */
  getStatOfTheDay(): Promise<Stat | null>;
  /** Carousel of recent figures. */
  getRecentStats(limit: number): Promise<Stat[]>;
  /** Carousel of short vertical videos - the "Главное за минуту" block. */
  getHighlights(limit: number): Promise<Highlight[]>;

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
  getSearchIndex(): Promise<Article[]>;

  /** One article page. Returns null - rather than throwing - on a bad slug. */
  getArticle(slug: string): Promise<ArticleDetail | null>;
  /**
   * Every article slug the site publishes.
   *
   * `output: "export"` renders each page at build time, so the route needs the
   * whole list up front - there is no server left to handle a miss at runtime.
   */
  getSlugs(): Promise<string[]>;
  /** The "read also" feed under an article, excluding the article itself. */
  getRelated(slug: string, limit: number): Promise<Article[]>;

  /** One author page. Null - rather than a throw - on a bad slug. */
  getAuthor(slug: string): Promise<AuthorProfile | null>;
  /** Every author slug, for the same build-time reason as `getSlugs`. */
  getAuthorSlugs(): Promise<string[]>;
  /** The author page's "Популярные статьи" block - their most-read stories. */
  getPopularByAuthor(slug: string, limit: number): Promise<Article[]>;
  /**
   * That author's articles, newest first.
   *
   * `limit` is what the page renders today; when the API lands this is the
   * call that grows an offset and the design's "show more" becomes real.
   */
  getByAuthor(slug: string, limit: number): Promise<Article[]>;
}

import { apiNewsRepository } from "./api-repository";
import { mockNewsRepository } from "./mock-repository";

/**
 * Where a page reads its content from.
 *
 * `"api"` is api.portal24.uz; `"fixtures"` is the seeded data this site was
 * built against. The main page is on the API and the rest of the site is not,
 * because the API has stories and categories but no bylines, no figures and
 * no article bodies this app can render yet - `api-repository` lists what
 * each gap is waiting on.
 *
 * Note that `"api"` is not purely the API: it falls back to fixtures for those
 * gaps, so a page on it can still draw a fixture author or figure.
 */
export type ContentSource = "api" | "fixtures";

/**
 * The single swap point. Flip the default to `"api"` when the remaining gaps
 * are closed, and the argument at every call site can go.
 */
export function getNewsRepository(
  source: ContentSource = "fixtures",
): NewsRepository {
  return source === "api" ? apiNewsRepository : mockNewsRepository;
}
