import Link from "next/link";

import { BurgerMenu } from "./burger-menu";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { SearchIcon } from "@/components/ui/icons";
import { TELEGRAM_URL, TelegramIcon } from "@/components/ui/social";
import { navItems } from "@/lib/categories";
import { getNewsRepository } from "@/lib/news/repository";
import { strings } from "@/lib/strings";

export async function SiteHeader() {
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
