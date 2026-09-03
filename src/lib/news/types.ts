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

export interface Category {
  slug: CategorySlug;
  /** Display name, already in the current locale. */
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
}
