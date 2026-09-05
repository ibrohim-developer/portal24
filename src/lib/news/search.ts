import type { Article, CategorySlug } from "./types";

/**
 * Folds a string down to what a reader means rather than what they typed:
 * case, the Cyrillic ё/е pair, and the four apostrophes Uzbek gets written
 * with (ʼ ʻ ' `) all stop mattering, and any run of punctuation or space
 * becomes a single separator.
 */
function fold(value: string): string {
  return value
    .toLowerCase()
    .replace(/ё/g, "е")
    .replace(/[\u02bc\u02bb'`\u2019]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
}

/** Title, category and byline - everything the card itself shows. */
function haystack(article: Article): string {
  return fold(
    [article.title, article.category.name, article.author?.name ?? ""].join(" "),
  );
}

/**
 * Articles matching every word of `query`, in the order they were given.
 *
 * Substring matching per word, not whole-word: Russian and Uzbek both inflect
 * heavily, so "матч" has to find "матча" and "matchni". That also means the
 * fixtures need no stemmer - when the admin API lands this whole function is
 * replaced by whatever its search endpoint returns, and only the empty-query
 * contract below has to survive.
 *
 * An empty or blank query matches nothing: the page shows its prompt state
 * instead, so returning "everything" would be the wrong default.
 */
export function matchArticles(articles: Article[], query: string): Article[] {
  const words = fold(query).split(" ").filter(Boolean);
  if (words.length === 0) return [];

  return articles.filter((article) => {
    const text = haystack(article);
    return words.every((word) => text.includes(word));
  });
}

/**
 * The chips under the search field - editorial shortcuts into a query, not
 * category links: the design labels them with phrases ("Воздух в Ташкенте"),
 * and each carries a category only so it can borrow that category's tint.
 *
 * The label itself is the query, so it lives in the dictionary; this keeps the
 * order and the tint, which are the same in every language. When the CMS can
 * hold editorial picks, this is what it replaces.
 */
export const SEARCH_SUGGESTIONS = [
  { key: "worldCup", category: "sport" },
  { key: "ai", category: "tech" },
  { key: "airTashkent", category: "eco" },
  { key: "inflation", category: "finance" },
] as const satisfies ReadonlyArray<{ key: string; category: CategorySlug }>;

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Splits `text` into runs, marking the ones that matched the query so the
 * results grid can paint them with the design's highlight yellow.
 *
 * Matches on the raw query words rather than the folded ones `matchArticles`
 * compares: folding drops the apostrophes that Uzbek words are written with,
 * and a highlight that lands one character off is worse than none. The cost
 * is that a story matched only through folding highlights nothing - it still
 * appears in the results, which is what the reader asked for.
 */
export function highlightParts(
  text: string,
  query: string,
): Array<{ text: string; hit: boolean }> {
  const words = query.trim().split(/\s+/).filter(Boolean).map(escapeRegExp);
  if (words.length === 0) return [{ text, hit: false }];

  // One capture group, so `split` alternates: even index misses, odd hits.
  return text
    .split(new RegExp(`(${words.join("|")})`, "gi"))
    .map((piece, i) => ({ text: piece, hit: i % 2 === 1 }))
    .filter((part) => part.text !== "");
}
