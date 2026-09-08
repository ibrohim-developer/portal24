import Link from "next/link";

import { BurgerMenu } from "./burger-menu";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { SearchIcon } from "@/components/ui/icons";
import { TELEGRAM_URL, TelegramIcon } from "@/components/ui/social";
import { navItems } from "@/lib/categories";
import { getNewsRepository } from "@/lib/news/repository";
import { strings } from "@/lib/strings";

/**
 * Header from the Figma nav (2232:15466): 80px tall, 80px side padding.
 *
 * The category dots present in the Figma component are hidden in every
 * instance on the page, so they are not rendered here.
 *
 * The two breakpoints carry different controls, not a subset of one another
 * (2218:17584): desktop takes the category row, "Biz haqimizda", the Telegram
 * CTA and a search button on a tinted square; mobile keeps search and the
 * burger, both as bare marks with no tint behind them.
 *
 * The design also draws a language switcher on both rows. The site publishes
 * in Uzbek only, so there is nothing for it to switch between and it is not
 * rendered - a deliberate departure from the file.
 *
 * They switch at `nav` (1320) rather than at `lg`, because the desktop row is
 * a fixed amount of text that does not fit a 1024 viewport - see the token.
 */
export async function SiteHeader() {
  // Fetched here rather than threaded down from each page: the header is on
  // every route, and fetch memoisation collapses this into the category lookup
  // the page itself already makes.
  //
  // The row was drawn for six links and the CMS yields seven, in longer
  // Cyrillic names - so it is closer to overflowing its 1320 breakpoint than
  // the design intended. Worth measuring against the real category list.
  const items = navItems(await getNewsRepository("api").getCategories());

  return (
    <header className="border-b border-hairline">
      <Container>
        <div className="flex h-20 items-center justify-between gap-6">
        <div className="flex items-center gap-10">
          <Logo label={strings.a11y.home} />

          <nav
            aria-label={strings.a11y.mainNav}
            className="hidden items-center gap-6 nav:flex"
          >
            {items.map((item) => (
              <Link
                key={item.key}
                href={`/${item.href}/`}
                className="text-body text-ink-900 transition-colors hover:text-accent"
              >
                #{item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/about/"
            className="hidden text-body text-ink-900 transition-colors hover:text-accent nav:block"
          >
            {strings.nav.about}
          </Link>

          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="hidden items-center gap-2 bg-accent px-6 py-3 text-body text-white transition-opacity hover:opacity-90 nav:flex"
          >
            <TelegramIcon />
            {strings.nav.telegram}
          </a>

          <Link
            href="/search/"
            aria-label={strings.nav.search}
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
            <Link
              href="/search/"
              aria-label={strings.nav.search}
              className="flex h-11 w-11 items-center justify-center text-ink-900"
            >
              <SearchIcon />
            </Link>

            <BurgerMenu items={items} />
          </div>
        </div>
        </div>
      </Container>
    </header>
  );
}
