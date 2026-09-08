import type { ApiArticle, ApiCategory } from "./client";
import { htmlToBlocks } from "./html";
import type {
  Article,
  ArticleDetail,
  ArticleImage,
  Category,
} from "../types";

/**
 * Uzbek Cyrillic -> Latin, enough to build a URL slug from a category name.
 *
 * The CMS stores category names in Cyrillic ("Ўзбекистон") while the site
 * publishes in Latin, so the slug cannot be the name lowercased. Digraphs are
 * listed before the single letters they start with, because the replacement
 * runs longest-first.
 *
 * The apostrophe letters (oʻ, gʻ) are written here without their modifier
 * mark: this table feeds slugs, not display copy, and `ozbekiston` is the
 * form the CMS itself uses in article slugs.
 */
const CYRILLIC_TO_LATIN: Record<string, string> = {
  ё: "yo", ж: "j", ч: "ch", ш: "sh", щ: "sh", ю: "yu", я: "ya",
  ў: "o", қ: "q", ғ: "g", ҳ: "h", х: "x", ц: "s", ъ: "", ь: "",
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", з: "z", и: "i",
  й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", э: "e", ы: "i",
};

/**
 * A URL segment for a category the CMS names in Cyrillic.
 *
 * Derived rather than hand-mapped so a category added in the admin panel gets
 * a slug without a deploy. The id is appended only when transliteration
 * leaves nothing usable - a name written in an alphabet this table does not
 * cover still needs a routable segment.
 */
export function categorySlugFor(category: ApiCategory): string {
  const slug = [...category.name.toLowerCase()]
    .map((char) => CYRILLIC_TO_LATIN[char] ?? char)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || `category-${category.id}`;
}

export function mapCategory(category: ApiCategory): Category {
  return { slug: categorySlugFor(category), name: category.name };
}

/** Uzbek Latin month names, in the spelling `created_at` uses. */
const UZ_MONTHS = [
  "yanvar", "fevral", "mart", "aprel", "may", "iyun",
  "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr",
];

/** The API stamps its dates in Tashkent local time and says so nowhere. */
const TASHKENT_OFFSET = "+05:00";

const DATE_PATTERN = /^(\d{1,2})-(\p{L}+),\s*(\d{4}),\s*(\d{1,2}):(\d{2})$/u;

/**
 * "7-sentabr, 2026, 15:46" -> "2026-09-07T15:46:00+05:00".
 *
 * The API has no ISO field: it formats `created_at` for the requested `lang`
 * before sending it. Everything downstream - `formatArticleDate`, the article
 * page's `<time datetime>`, any future sort by date - needs a real timestamp,
 * so the display string is parsed back here rather than passed through.
 *
 * Returns "" when the string does not match, which is what the formatters
 * already render as an empty stamp. A card with no date beats a build that
 * dies because the CMS shipped a month spelling this list has not seen.
 */
export function parseApiDate(value: string): string {
  const match = DATE_PATTERN.exec(value.trim());
  if (!match) return "";

  const [, day, monthName, year, hour, minute] = match;
  const month = UZ_MONTHS.indexOf(monthName.toLowerCase());
  if (month < 0) return "";

  const pad = (n: string) => n.padStart(2, "0");
  return `${year}-${pad(String(month + 1))}-${pad(day)}T${pad(hour)}:${minute}:00${TASHKENT_OFFSET}`;
}

/**
 * Nominal intrinsic size for a cover.
 *
 * The API sends a bare `image_url` with no dimensions. `next/image` needs a
 * width and height to reserve space, and with `images.unoptimized` they are
 * only ever used as a ratio hint - every card paints its cover with
 * `object-cover` inside its own aspect box, so the real pixels do not have to
 * match. 16:9 is the crop the CMS's own uploader produces.
 */
const COVER_WIDTH = 1280;
const COVER_HEIGHT = 720;

function mapCover(article: ApiArticle): ArticleImage | null {
  if (!article.image_url) return null;

  return {
    url: article.image_url,
    // Covers are decorative here: every card wraps the image in a link that is
    // `aria-hidden` next to the headline that names the story, so an alt would
    // be read out twice. `article-figure` is the one place alt text matters,
    // and that draws body images, which this endpoint does not carry.
    alt: "",
    width: COVER_WIDTH,
    height: COVER_HEIGHT,
  };
}

/** Stand-in for a story the CMS filed without a category. */
const UNCATEGORISED: Category = { slug: "news", name: "Yangiliklar" };

/**
 * One list item, mapped onto the shape a card renders.
 *
 * `author` is always null: the public endpoints carry no byline at all -
 * neither the list nor `/news/{slug}` - though the CMS clearly stores one
 * (`author_id` and `staffId` are both sortable columns in the OpenAPI spec).
 * Every card and meta line already treats a missing author as normal.
 */
export function mapArticle(article: ApiArticle): Article {
  return {
    id: String(article.id),
    slug: article.slug,
    title: article.title,
    category: article.category ? mapCategory(article.category) : UNCATEGORISED,
    coverImage: mapCover(article),
    publishedAt: parseApiDate(article.created_at),
    author: null,
  };
}

/**
 * One article page.
 *
 * The three nulls are fields the CMS has no column for, not omissions here:
 * `/news/{slug}` carries no byline, no photo credit and no modification
 * timestamp. Each has a `? :` guard at its render site already, so the page
 * simply draws without them.
 */
export function mapArticleDetail(article: ApiArticle): ArticleDetail {
  return {
    ...mapArticle(article),
    author: null,
    coverCaption: null,
    coverCredit: null,
    updatedAt: null,
    body: htmlToBlocks(article.content),
  };
}
