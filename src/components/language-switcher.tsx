"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";
import { locales, type Locale } from "@/i18n/config";

/** Compact codes, as in the Figma header ("UZ"). */
const CODE: Record<Locale, string> = { uz: "UZ", ru: "RU", en: "EN" };

/**
 * Swaps the locale segment while keeping the reader on the same page, so
 * /ru/sport/ -> /en/sport/ rather than dumping them back on the home page.
 *
 * This is the reason the component is client-side: a server component cannot
 * read the current pathname, and the alternative - threading the path down
 * from every page - couples each route to the switcher.
 */
export function LanguageSwitcher({
  current,
  label,
}: {
  current: Locale;
  label: string;
}) {
  const pathname = usePathname();
  const rest = pathname.replace(/^\/[^/]+/, "");

  return (
    <nav aria-label={label} className="flex items-center gap-1">
      {locales.map((locale) => {
        const isCurrent = locale === current;
        return (
          <Link
            key={locale}
            href={`/${locale}${rest}`}
            hrefLang={locale}
            aria-current={isCurrent ? "true" : undefined}
            className={cn(
              "px-1 text-body transition-colors",
              isCurrent
                ? "font-medium text-ink-900"
                : "text-ink-400 hover:text-accent",
            )}
          >
            {CODE[locale]}
          </Link>
        );
      })}
    </nav>
  );
}
