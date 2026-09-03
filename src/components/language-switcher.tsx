"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { locales, localeNames, type Locale } from "@/i18n/config";

/**
 * Swaps the locale segment while keeping the reader on the same page, so
 * /ru/sport/ -> /en/sport/ rather than dumping them back on the home page.
 */
export function LanguageSwitcher({ current }: { current: Locale }) {
  const pathname = usePathname();
  const rest = pathname.replace(/^\/[^/]+/, "");

  return (
    <nav aria-label={localeNames[current]} className="flex items-center gap-1">
      {locales.map((locale) => {
        const isCurrent = locale === current;
        return (
          <Link
            key={locale}
            href={`/${locale}${rest}`}
            hrefLang={locale}
            aria-current={isCurrent ? "true" : undefined}
            className={
              isCurrent
                ? "rounded px-2 py-1 text-sm font-semibold text-foreground"
                : "rounded px-2 py-1 text-sm text-foreground/60 hover:text-foreground"
            }
          >
            {localeNames[locale]}
          </Link>
        );
      })}
    </nav>
  );
}
