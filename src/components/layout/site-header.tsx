import Link from "next/link";

import { BurgerMenu } from "./burger-menu";
import { Container } from "@/components/ui/container";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo } from "@/components/ui/logo";
import { NAV_ITEMS } from "@/lib/categories";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

const TELEGRAM_URL = "https://t.me/portal24uz";

/**
 * Header from the Figma nav (2232:15466): 80px tall, 80px side padding.
 *
 * The category dots present in the Figma component are hidden in every
 * instance on the page, so they are not rendered here.
 */
export function SiteHeader({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <header className="border-b border-hairline">
      <Container>
        <div className="flex h-20 items-center justify-between gap-6">
        <div className="flex items-center gap-10">
          <Logo locale={locale} label={dict.a11y.home} />

          <nav
            aria-label={dict.a11y.mainNav}
            className="hidden items-center gap-6 lg:flex"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={`/${locale}/${item.href}/`}
                className="text-body text-ink-900 transition-colors hover:text-accent"
              >
                #{dict.nav[item.key]}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href={`/${locale}/about/`}
            className="hidden text-body text-ink-900 transition-colors hover:text-accent lg:block"
          >
            {dict.nav.about}
          </Link>

          <div className="hidden lg:block">
            <LanguageSwitcher current={locale} label={dict.a11y.languages} />
          </div>

          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="hidden items-center gap-2 bg-accent px-6 py-3 text-body text-white transition-opacity hover:opacity-90 lg:flex"
          >
            <svg width="20" height="17" viewBox="0 0 20 17" fill="none" aria-hidden="true">
              <path
                d="M19.5 1.5 16.8 15.3c-.2 1-.8 1.2-1.6.8l-4.4-3.2-2.1 2c-.2.3-.4.5-.9.5l.3-4.5L16.3 4c.4-.3-.1-.5-.6-.2L5.6 10.2 1.2 8.8C.3 8.5.2 7.9 1.4 7.4L18.2.9c.8-.3 1.5.2 1.3 1.6Z"
                fill="currentColor"
              />
            </svg>
            {dict.nav.telegram}
          </a>

          <Link
            href={`/${locale}/search/`}
            aria-label={dict.nav.search}
            className="hidden h-12 w-12 items-center justify-center bg-hairline transition-colors hover:bg-cat-education lg:flex"
          >
            <SearchIcon />
          </Link>

            <BurgerMenu locale={locale} dict={dict} />
          </div>
        </div>
      </Container>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="6.25" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="m13.5 13.5 3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
