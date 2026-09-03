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

/** Categories that get their own block on the main page, in Figma order. */
export const HOME_CATEGORY_BLOCKS: CategorySlug[] = [
  "education",
  "finance",
  "eco",
  "sport",
  "tech",
];
