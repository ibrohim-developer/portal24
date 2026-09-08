/**
 * Thin HTTP client for the admin team's REST API.
 *
 * Nothing above this file knows the API exists: `api-repository` maps these
 * raw shapes onto the domain types and is the only importer.
 *
 * Two things about this API are worth knowing before reading the calls:
 *
 *  - `lang` is a **header**, not a query parameter. Sending it as `?lang=uz`
 *    returns 400 with "lang must be one of the following values".
 *  - `sort` and `filters` are documented in the OpenAPI spec and accepted by
 *    the public endpoints, but silently ignored - `/news` always answers
 *    newest-first. Anything that needs another order sorts it here.
 */

/** Overridable so a branch can point at a staging host without a code change. */
const API_BASE = process.env.PORTAL24_API_URL ?? "https://api.portal24.uz";

/** The site publishes in Uzbek only - see `lib/strings`. */
const LANG = "uz";

/** How many times a throttled request waits and tries again before giving up. */
const RATE_LIMIT_RETRIES = 3;

/** Growing pause between those attempts, when the API sends no `Retry-After`. */
const RETRY_BACKOFF_MS = 1500;

/** Ceiling on a `Retry-After` we will actually sit through. */
const MAX_RETRY_WAIT_SECONDS = 10;

/** The envelope every list endpoint answers with. */
export interface ApiPage<T> {
  data: T[];
  totalPage: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  totalItems: number;
}

export interface ApiCategory {
  id: number;
  name: string;
  news_count: number;
  /** Present on `/news/category`, absent on the category embedded in a story. */
  title?: string;
  seo_title?: string;
  seo_description?: string;
}

export interface ApiArticle {
  id: number;
  title: string;
  summary: string;
  /** An HTML string, not blocks - see the note in `api-repository`. */
  content: string;
  slug: string;
  status: "ACTIVE" | "INACTIVE";
  image_url: string;
  category: ApiCategory | null;
  likes: number;
  reading_time: number;
  views: number;
  comments: number;
  content_type: string;
  youtube_id: string;
  comment_available: boolean;
  /**
   * Already formatted for `lang`, e.g. "7-sentabr, 2026, 15:46" - there is no
   * ISO timestamp anywhere in the payload. `parseApiDate` puts it back.
   */
  created_at: string;
  tags?: string[];
}

class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly path: string,
    body: string,
  ) {
    super(`portal24 API ${status} on ${path}: ${body.slice(0, 200)}`);
    this.name = "ApiError";
  }
}

/**
 * One GET against the API.
 *
 * Throws on anything but a 2xx. A build that cannot reach the CMS should stop
 * with the status in the log rather than quietly export a page of empty
 * blocks, which is what every caller's `articles.length === 0` guard would
 * otherwise turn a failure into.
 */
async function apiGet<T>(
  path: string,
  params: Record<string, string | number | undefined> = {},
): Promise<T> {
  const url = new URL(path, API_BASE);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  // Deliberately uncached. Each page sets its own `revalidate`, and a fetch
  // that cached for longer than the page would let a regeneration redraw the
  // same stale stories - the page would tick over without the news changing.
  // Identical requests are still memoised within one render pass, so the six
  // category feeds share the one category lookup between them.
  let response = await fetch(url, {
    headers: { lang: LANG, accept: "application/json" },
  });

  // The API throttles at 120 requests a minute and answers 429 past that,
  // which a build renders straight into a failure and an on-demand page
  // renders into a 500 for whoever asked for it. Both are worth one wait:
  // the limit is per-minute, so the window is always seconds away from
  // reopening. `Retry-After` is honoured when sent.
  for (let attempt = 0; attempt < RATE_LIMIT_RETRIES && response.status === 429; attempt++) {
    const retryAfter = Number(response.headers.get("retry-after"));
    const waitMs = Number.isFinite(retryAfter) && retryAfter > 0
      ? Math.min(retryAfter, MAX_RETRY_WAIT_SECONDS) * 1000
      : RETRY_BACKOFF_MS * (attempt + 1);

    await new Promise((resolve) => setTimeout(resolve, waitMs));
    response = await fetch(url, {
      headers: { lang: LANG, accept: "application/json" },
    });
  }

  if (!response.ok) {
    throw new ApiError(response.status, url.pathname, await response.text());
  }

  return (await response.json()) as T;
}

/** `null` when the API answers 404, which is a miss rather than a failure. */
async function apiGetOrNull<T>(path: string): Promise<T | null> {
  try {
    return await apiGet<T>(path);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

/**
 * Our own ceiling on `size`, not the server's - the API happily answers 100.
 * Kept here so one careless caller cannot ask for all 1,373 stories at once.
 */
const MAX_PAGE_SIZE = 100;

export function fetchCategories(): Promise<ApiCategory[]> {
  return apiGet<ApiCategory[]>("/news/category");
}

/**
 * One page of stories, newest first.
 *
 * `categoryId` and `search` are the only server-side narrowing that works; see
 * the note at the top of the file.
 */
export function fetchNewsPage(options: {
  page?: number;
  size?: number;
  categoryId?: number;
  search?: string;
}): Promise<ApiPage<ApiArticle>> {
  return apiGet<ApiPage<ApiArticle>>("/news", {
    page: options.page ?? 1,
    size: Math.min(options.size ?? 10, MAX_PAGE_SIZE),
    category_id: options.categoryId,
    search: options.search,
  });
}

/**
 * As many stories as `count` asks for, walking pages until the API runs out.
 *
 * Sequential rather than parallel: the API rate-limits at 120 requests a
 * minute (`X-RateLimit-Limit`), and a build renders several pages at once.
 */
export async function fetchNewsUpTo(
  count: number,
  options: { categoryId?: number; search?: string } = {},
): Promise<ApiArticle[]> {
  const collected: ApiArticle[] = [];

  for (let page = 1; collected.length < count; page += 1) {
    const result = await fetchNewsPage({
      ...options,
      page,
      size: Math.min(count - collected.length, MAX_PAGE_SIZE),
    });

    collected.push(...result.data);
    if (!result.hasNextPage || result.data.length === 0) break;
  }

  return collected.slice(0, count);
}

export function fetchArticle(slug: string): Promise<ApiArticle | null> {
  return apiGetOrNull<ApiArticle>(`/news/${encodeURIComponent(slug)}`);
}
