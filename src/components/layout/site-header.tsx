import Link from "next/link";

import { BurgerMenu } from "./burger-menu";
import { Container } from "@/components/ui/container";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Logo } from "@/components/ui/logo";
import { SearchIcon } from "@/components/ui/icons";
import { TELEGRAM_URL, TelegramIcon } from "@/components/ui/social";
import { NAV_ITEMS } from "@/lib/categories";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

/**
 * Header from the Figma nav (2232:15466): 80px tall, 80px side padding.
 *
 * The category dots present in the Figma component are hidden in every
 * instance on the page, so they are not rendered here.
 *
 * The two breakpoints carry different controls, not a subset of one another
 * (2218:17584): desktop takes the category row, "О нас", the Telegram CTA and
 * a search button on a tinted square; mobile keeps search and the burger, both
 * as bare marks with no tint behind them.
 *
 * The language switcher is the one control both rows share - the same popover
 * on the active code, drawn with a chevron on desktop and bare on mobile. The
 * desktop design lists all three codes instead; see the switcher.
 *
 * They switch at `nav` (1320) rather than at `lg`, because the desktop row is
 * a fixed amount of text that does not fit a 1024 viewport - see the token.
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
            className="hidden items-center gap-6 nav:flex"
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
            className="hidden text-body text-ink-900 transition-colors hover:text-accent nav:block"
          >
            {dict.nav.about}
          </Link>

          <div className="hidden nav:block">
            <LanguageSwitcher
              current={locale}
              label={dict.a11y.languages}
              variant="button"
            />
          </div>

          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="hidden items-center gap-2 bg-accent px-6 py-3 text-body text-white transition-opacity hover:opacity-90 nav:flex"
          >
            <TelegramIcon />
            {dict.nav.telegram}
          </a>

          <Link
            href={`/${locale}/search/`}
            aria-label={dict.nav.search}
            className="hidden h-12 w-12 items-center justify-center bg-hairline transition-colors hover:bg-cat-education nav:flex"
          >
            <SearchIcon />
          </Link>

          {/* 44px tap targets butted together: the padding inside each one is
              what draws the gap the design shows between the bare marks. The
              last mark carries its own negative margin to pull that padding
              back onto the gutter - do not repeat it here, or the row ends up
              8px wider than the viewport and the whole page scrolls sideways. */}
          <div className="flex items-center gap-1 nav:hidden">
            <LanguageSwitcher current={locale} label={dict.a11y.languages} />

            <Link
              href={`/${locale}/search/`}
              aria-label={dict.nav.search}
              className="flex h-11 w-11 items-center justify-center text-ink-900"
            >
              <SearchIcon />
            </Link>

            <BurgerMenu locale={locale} dict={dict} />
          </div>
        </div>
        </div>
      </Container>
    </header>
  );
}
