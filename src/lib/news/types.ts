/**
 * Domain types for editorial content.
 *
 * Field names follow the Figma card design rather than any particular backend.
 * When the admin team's REST API arrives, map its response into these shapes
 * inside the repository - do not leak API field names into components.
 */

/** Category slugs match the variant axis on the Figma News component set. */
export const categorySlugs = [
  "sport",
  "education",
  "finance",
  "eco",
  "tech",
] as const;

export type CategorySlug = (typeof categorySlugs)[number];

/** Narrows a route segment onto the union before a page trusts it. */
export function isCategorySlug(value: string): value is CategorySlug {
  return (categorySlugs as readonly string[]).includes(value);
}

export interface Category {
  /**
   * URL segment for the category's feed.
   *
   * A plain string rather than `CategorySlug`: the union above is the design's
   * taxonomy, and the CMS publishes its own set, named in Cyrillic and slugged
   * by transliteration (`news/api/map`). Both have to fit here, so nothing
   * indexes a fixed table with this - see `categoryTint`.
   */
  slug: string;
  /** Display name, ready to draw. */
  name: string;
}

export interface Author {
  slug: string;
  name: string;
}

export interface ArticleImage {
  url: string;
  alt: string;
  width: number;
  height: number;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: Category;
  coverImage: ArticleImage | null;
  /** ISO 8601. Formatting is the component's job, not the API's. */
  publishedAt: string;
  author: Author | null;
}

/** The "Цифра дня" / "Цифры последних дней" blocks. */
export interface Stat {
  id: string;
  /** Rendered large, e.g. "7 из 10". A string because it is rarely a plain number. */
  value: string;
  description: string;
  coverImage: ArticleImage | null;
  href: string | null;
  /** ISO 8601. The card stamps it as a bare day + month. */
  publishedAt: string;
}

/**
 * A "Главное за минуту" card - a short vertical video, shown as its cover.
 *
 * The covers in the design carry their own headline and badge as part of the
 * artwork, so the card renders nothing but the image. `title` is still required:
 * it is the accessible name of the link, which the picture cannot supply.
 */
export interface Highlight {
  id: string;
  title: string;
  coverImage: ArticleImage | null;
  /** Null until there is somewhere for a short video to open, as with Stat. */
  href: string | null;
}

/**
 * Networks an author can be reached on, in the order the design draws them.
 *
 * A domain union rather than a component concern: the CMS stores which network
 * a contact belongs to, and `SOCIAL_MARKS` in `components/ui/social` is what
 * turns that into a glyph and a brand label.
 */
export const socialNetworks = [
  "instagram",
  "telegram",
  "youtube",
  "facebook",
  "linkedin",
] as const;

export type SocialNetwork = (typeof socialNetworks)[number];

export interface AuthorContact {
  network: SocialNetwork;
  href: string;
}

/**
 * An author as shown in the article's AuthorBlock (Figma 1878:12804) and on
 * the author page (Figma 1981:17549), both of which need more than the byline
 * on a card does. Kept separate from `Author` so a card feed does not have to
 * carry an avatar it will never render.
 */
export interface AuthorProfile extends Author {
  avatar: ArticleImage | null;
  /**
   * The author's beats, rendered as one "#Спорт / #Экология" line.
   *
   * Carries the slug as well as the name because the author page links each
   * beat to its category feed; the article's AuthorBlock only prints names.
   */
  categories: Category[];
  /** Job title, shown under the name on the author page. Null when unknown. */
  role: string | null;
  /**
   * Short biography. Author page only - the AuthorBlock has no room for it.
   *
   * Blank lines separate paragraphs; the hero renders each as its own `<p>`.
   */
  bio: string | null;
  /**
   * The author's own accounts, rendered as the "Контакты для связи" buttons.
   * Empty when they publish no way to reach them, which drops the block.
   */
  contacts: AuthorContact[];
}

/**
 * One element of an article body.
 *
 * A discriminated list rather than an HTML string: the design gives `callout`
 * and `image` their own treatment, and a CMS that hands us HTML would smuggle
 * markup past every style here. When the admin API lands, map its block format
 * onto this union in the repository.
 */
export type ArticleBlock =
  | { kind: "heading"; text: string }
  | { kind: "paragraph"; spans: InlineSpan[] }
  /** The "AttentionText" pull-quote - accent rule, accent text, 8% accent panel. */
  | { kind: "callout"; text: string }
  | { kind: "list"; ordered: boolean; items: InlineSpan[][] }
  | {
      kind: "image";
      image: ArticleImage;
      caption: string | null;
      /** Photo credit, stamped after the caption's separator dot. */
      credit: string | null;
    };

/**
 * A run of text inside a paragraph or a list item.
 *
 * Paragraphs carry these rather than a plain string because the newsroom cites
 * its sources: 42 of 50 CMS articles sampled contain at least one link, and
 * flattening those to text would strip the attribution out of the reporting.
 *
 * Deliberately a short list. The CMS's editor can emit far more than this, but
 * a body block is not a document model - anything not represented here is
 * reduced to its text by `htmlToBlocks`, which is the point of parsing the
 * CMS's HTML instead of rendering it.
 */
export type InlineSpan =
  | { kind: "text"; text: string }
  | { kind: "emphasis"; text: string }
  | { kind: "link"; text: string; href: string };

/** The common case: one unstyled run, for fixtures and for plain paragraphs. */
export function plainSpans(text: string): InlineSpan[] {
  return [{ kind: "text", text }];
}

/** The text of a run of spans, with the marks dropped - for excerpts and alt. */
export function spansToText(spans: InlineSpan[]): string {
  return spans.map((span) => span.text).join("");
}

/** A single article page: everything `Article` has, plus the body. */
export interface ArticleDetail extends Article {
  author: AuthorProfile | null;
  coverCaption: string | null;
  coverCredit: string | null;
  /** Null when the story has not been edited since publication. */
  updatedAt: string | null;
  body: ArticleBlock[];
}
