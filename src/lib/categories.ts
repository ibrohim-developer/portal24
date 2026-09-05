import type { FeedLayout } from "@/components/ui/feed-block";
import type { CategorySlug } from "./news/types";
import type { Dictionary } from "@/i18n/get-dictionary";

/**
 * Navigation order is taken from the Figma header, left to right.
 *
 * "popular" is not a category - it is a cross-cutting feed - so it carries its
 * own path and is excluded from CategorySlug.
 */
export type NavItem = {
  key: keyof Dictionary["nav"];
  href: string;
  category: CategorySlug | null;
};

export const NAV_ITEMS: NavItem[] = [
  { key: "popular", href: "popular", category: null },
  { key: "sport", href: "sport", category: "sport" },
  { key: "eco", href: "eco", category: "eco" },
  { key: "education", href: "education", category: "education" },
  { key: "finance", href: "finance", category: "finance" },
  { key: "tech", href: "tech", category: "tech" },
];

/**
 * Categories that get their own block on the main page, in Figma order, each
 * with the arrangement the design gives it.
 *
 * The layout is listed per block rather than derived from the index, because
 * the design is not a pattern: featured, grid, then - across the numbers
 * carousel - grid, featured, and finally the thumbnail rows that "#Популярное"
 * opens the page with. Every attempt to compute this from the position gets
 * one of the five wrong.
 */
export const HOME_CATEGORY_BLOCKS: {
  slug: CategorySlug;
  layout: FeedLayout;
}[] = [
  { slug: "sport", layout: "featured" },
  { slug: "eco", layout: "grid" },
  { slug: "education", layout: "grid" },
  { slug: "finance", layout: "featured" },
  { slug: "tech", layout: "rows" },
];

/**
 * The footer lists the same links as the header but in its own order
 * (Figma 111:247, desktop frame): popular, sport, education, finance, eco,
 * tech. Reusing NAV_ITEMS here would silently reorder the footer whenever the
 * header changes, so the two orders are kept apart.
 */
export const FOOTER_NAV_ITEMS: NavItem[] = [
  { key: "popular", href: "popular", category: null },
  { key: "sport", href: "sport", category: "sport" },
  { key: "education", href: "education", category: "education" },
  { key: "finance", href: "finance", category: "finance" },
  { key: "eco", href: "eco", category: "eco" },
  { key: "tech", href: "tech", category: "tech" },
];

/**
 * Category -> background tint, from the Figma TextBlock component set (variant
 * axis `Category` on 1677:10811). Only the block background changes with the
 * category; the label on top of it is always ink-600.
 *
 * Shared because the About Us page paints the same tints on plain topic cells
 * (2196:16591) rather than on article cards.
 */
export const CATEGORY_TINT: Record<CategorySlug, string> = {
  eco: "bg-cat-eco",
  sport: "bg-cat-sport",
  finance: "bg-cat-finance",
  tech: "bg-cat-tech",
  education: "bg-cat-education",
};

/**
 * The 2x2 topic grid on the About Us page (Figma 2196:16591), in its order.
 *
 * Four topics, not five - the design leaves sport out of this grid, so this is
 * deliberately not derived from NAV_ITEMS.
 */
export const ABOUT_FOCUS_TOPICS = ["eco", "education", "tech", "finance"] as const;

export type AboutFocusTopic = (typeof ABOUT_FOCUS_TOPICS)[number];
