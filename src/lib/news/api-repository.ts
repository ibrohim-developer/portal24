import {
  fetchArticle,
  fetchCategories,
  fetchNewsPage,
  fetchNewsUpTo,
  type ApiCategory,
} from "./api/client";
import {
  categorySlugFor,
  mapArticle,
  mapArticleDetail,
  mapCategory,
} from "./api/map";
import { mockNewsRepository } from "./mock-repository";
import type { NewsRepository } from "./repository";

/**
 * The admin team's REST API, behind the same interface the fixtures answer.
 *
 * Only the parts of the site the API can actually serve are implemented here;
 * the rest delegate to `mockNewsRepository` and say why. The API today is a
 * feed of stories and their categories - it has no bylines, no "Kun raqami"
 * figures and no short videos, so those blocks are still fixtures and are
 * marked as such below.
 */

/**
 * The category list, which `getByCategory` needs because it takes a slug while
 * the API filters by numeric id.
 *
 * Not memoised in a module-level variable, tempting as that is: under ISR this
 * module lives as long as the Node process, so a promise held here would pin
 * the category list until the next deploy and a category added in the admin
 * panel would never appear. `fetch` already collapses the repeat requests
 * within a single render pass, which is the only place the saving was real.
 */
function loadCategories(): Promise<ApiCategory[]> {
  return fetchCategories();
}

/** How deep to look when a block needs an order the API will not sort by. */
const POPULARITY_POOL = 100;

/** How many of the newest stories get their page built ahead of a request. */
const PREBUILT_ARTICLES = 100;

export const apiNewsRepository: NewsRepository = {
  async getCategories() {
    return (await loadCategories()).map(mapCategory);
  },

  async getTopStories(limit) {
    // `/news` answers newest-first and nothing in the payload marks a lead
    // story - `is_hot` exists as a sortable column in the spec but is not in
    // the response - so the newest story leads the page.
    const page = await fetchNewsPage({ size: limit });
    return page.data.map(mapArticle);
  },

  async getPopular(limit) {
    // Sorted here, not by the API: `sort` is accepted on `/news` and ignored.
    // So the most-read block is the most-viewed story of the last hundred
    // rather than of all 1,373 - a full ranking would cost fourteen requests
    // at build for a block that shows six cards.
    const pool = await fetchNewsUpTo(POPULARITY_POOL);

    return pool
      .slice()
      .sort((a, b) => b.views - a.views)
      .slice(0, limit)
      .map(mapArticle);
  },

  async getByCategory(category, limit) {
    const match = (await loadCategories()).find(
      (candidate) => categorySlugFor(candidate) === category,
    );
    if (!match) return [];

    const page = await fetchNewsPage({ size: limit, categoryId: match.id });
    return page.data.map(mapArticle);
  },

  async getArticle(slug) {
    const article = await fetchArticle(slug);
    return article ? mapArticleDetail(article) : null;
  },

  async getSlugs() {
    // Only the recent run is prebuilt. The CMS holds 1,373 stories and grows
    // daily; rendering all of them would cost fourteen API round-trips and
    // 1,373 pages at every build, to prebuild an archive nobody is reading.
    // `/news/[slug]` takes `dynamicParams`, so an older story renders on its
    // first request and is cached from then on.
    const recent = await fetchNewsUpTo(PREBUILT_ARTICLES);
    return recent.map((article) => article.slug);
  },

  async getRelated(slug, limit) {
    // The API has no "related" endpoint and no tag query, so this is the rest
    // of the story's own category. Costs a second request because the list
    // endpoint cannot filter by slug - the category id has to come from the
    // article itself.
    const article = await fetchArticle(slug);
    if (!article?.category) return [];

    const page = await fetchNewsPage({
      size: limit + 1,
      categoryId: article.category.id,
    });

    return page.data
      .filter((candidate) => candidate.slug !== slug)
      .slice(0, limit)
      .map(mapArticle);
  },

  /*
   * Below here the API has nothing to answer with, so the fixtures do.
   *
   * - Stats and highlights: the CMS models neither. Every story is
   *   `content_type: "DEFAULT"` and no `youtube_id` is filled in, so there is
   *   not even an empty shape to map "Kun raqami" or "Bir daqiqada asosiysi"
   *   onto yet.
   * - Authors: no byline is exposed on either endpoint, so `mapArticle` sets
   *   `author: null`, the article page draws without its byline card, and
   *   there is nothing for an author page to render. The author pages below
   *   therefore still serve the three fixture writers.
   * - The search index: the API has a real `?search=` now, so the right move
   *   is for the search page to query it rather than for this to ship 1,373
   *   cards to the browser. That is a change to the page, not to this call.
   */
  getStatOfTheDay: mockNewsRepository.getStatOfTheDay,
  getRecentStats: mockNewsRepository.getRecentStats,
  getHighlights: mockNewsRepository.getHighlights,
  getSearchIndex: mockNewsRepository.getSearchIndex,
  getAuthor: mockNewsRepository.getAuthor,
  getAuthorSlugs: mockNewsRepository.getAuthorSlugs,
  getPopularByAuthor: mockNewsRepository.getPopularByAuthor,
  getByAuthor: mockNewsRepository.getByAuthor,
};
