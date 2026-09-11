import type { Category, CategorySlug } from "./news/types";
import { strings } from "./strings";

/**
 * One link in the header, burger panel or footer.
 *
 * Carries its own label rather than a key into `strings.nav`, because the
 * categories come from the CMS now and their names come with them - only
 * "Ommabop" is the site's own word.
 */
export type NavItem = {
  key: string;
  href: string;
  label: string;
};

/**
 * The nav row: the cross-cutting "Ommabop" feed, then one link per category
 * the CMS publishes, in the CMS's order.
 *
 * Built from the fetched list rather than from a constant, so a category added
 * in the admin panel appears in the nav the same way it appears on the main
 * page. The Figma's order (sport, eco, taʼlim, moliya, texnologiyalar) cannot
 * be honoured: none of those five except Sport exists in the CMS.
 *
 * Note the row was designed for six items and the CMS currently yields seven,
 * with longer Cyrillic names - see the width note on `SiteHeader`.
 */
export function navItems(categories: Category[]): NavItem[] {
  return [
    { key: "popular", href: "popular", label: strings.nav.popular },
    ...categories.map((category) => ({
      key: category.slug,
      href: category.slug,
      label: category.name,
    })),
  ];
}

/**
 * The footer's own list.
 *
 * The Figma gives the footer a different order from the header (111:247:
 * popular, sport, education, finance, eco, tech), and the two were kept apart
 * so neither could silently reorder the other. That distinction cannot
 * survive the CMS taxonomy - the categories it orders no longer exist - so
 * both rows now read the same list. The function is kept separate anyway, as
 * the place to put the footer's order back if the designer wants one.
 */
export function footerNavItems(categories: Category[]): NavItem[] {
  return navItems(categories);
}

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
