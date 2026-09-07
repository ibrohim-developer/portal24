import type { CategorySlug } from "./news/types";
import type { strings } from "./strings";

/**
 * Navigation order is taken from the Figma header, left to right.
 *
 * "popular" is not a category - it is a cross-cutting feed - so it carries its
 * own path and is excluded from CategorySlug.
 */
export type NavItem = {
  key: keyof (typeof strings)["nav"];
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
 * Tints for the categories the CMS actually publishes, which are not the
 * categories the design drew.
 *
 * The Figma's palette has five tints, picked for Sport / Ekologiya / Taʼlim /
 * Moliya / Texnologiyalar. The CMS publishes six topics, so one colour has to
 * serve twice whatever the pairing - Foydali doubles up with Oʻzbekiston here
 * because they are the two least likely to sit next to each other in a feed.
 *
 * Every pairing below is provisional and none of them is a design decision:
 * only Sport carries its own colour by right. This is the table to hand the
 * designer.
 */
const CMS_CATEGORY_TINT: Record<string, string> = {
  sport: "bg-cat-sport",
  ozbekiston: "bg-cat-eco",
  siyosat: "bg-cat-finance",
  xorij: "bg-cat-tech",
  jamiyat: "bg-cat-education",
  foydali: "bg-cat-eco",
};

/** What a category neither table names is painted with. */
const FALLBACK_TINT = "bg-cat-eco";

/**
 * The background tint for any category slug, the design's or the CMS's.
 *
 * A function rather than an index into CATEGORY_TINT because `Category.slug`
 * is now a plain string: a CMS slug misses that table entirely, and indexing
 * it with one yields `undefined`, which drops the tint silently rather than
 * falling back to a colour.
 */
export function categoryTint(slug: string): string {
  if (slug in CATEGORY_TINT) return CATEGORY_TINT[slug as CategorySlug];
  return CMS_CATEGORY_TINT[slug] ?? FALLBACK_TINT;
}

/**
 * The 2x2 topic grid on the About Us page (Figma 2196:16591), in its order.
 *
 * Four topics, not five - the design leaves sport out of this grid, so this is
 * deliberately not derived from NAV_ITEMS.
 */
export const ABOUT_FOCUS_TOPICS = ["eco", "education", "tech", "finance"] as const;

export type AboutFocusTopic = (typeof ABOUT_FOCUS_TOPICS)[number];
