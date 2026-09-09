"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Logo } from "@/components/ui/logo";
import { SearchIcon } from "@/components/ui/icons";
import { SOCIAL, TELEGRAM_URL, TelegramIcon } from "@/components/ui/social";
import type { NavItem } from "@/lib/categories";
import { strings } from "@/lib/strings";

export function BurgerMenu({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);

  // A drawer that stays open while the page scrolls underneath reads as a bug.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={strings.nav.menu}
        aria-expanded={open}
        className="-mr-3 flex h-11 w-11 items-center justify-center text-ink-900 nav:hidden"
      >
        <BurgerIcon />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-white nav:hidden">
          <div className="flex h-20 shrink-0 items-center justify-between gap-4 px-4">
            <Logo label={strings.a11y.home} />

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label={strings.nav.close}
                className="-mr-3 flex h-11 w-11 items-center justify-center text-ink-900"
              >
                <CloseIcon />
              </button>
            </div>
          </div>

          <div className="flex flex-col px-4 pb-10">
            {/* Same destination as the header's search button. A plain GET:
                it lands on /search/?q= and the page filters from there. */}
            <form role="search" action="/search/" className="relative">
              <label htmlFor="menu-search" className="sr-only">
                {strings.nav.search}
              </label>
              <input
                id="menu-search"
                type="search"
                name="q"
                placeholder={strings.nav.searchPlaceholder}
                className="h-12 w-full bg-hairline pr-12 pl-4 text-body text-ink-900 outline-none placeholder:text-ink-400 focus-visible:ring-1 focus-visible:ring-accent"
              />
              <button
                type="submit"
                aria-label={strings.nav.search}
                className="absolute top-0 right-0 flex h-12 w-12 items-center justify-center text-ink-900"
              >
                <SearchIcon />
              </button>
            </form>

            <nav
              aria-label={strings.a11y.mainNav}
              className="flex flex-col items-center gap-9 py-8 text-center"
            >
              {items.map((item) => (
                <Link
                  key={item.key}
                  href={`/${item.href}/`}
                  onClick={() => setOpen(false)}
                  className="text-body text-ink-900"
                >
                  #{item.label}
                </Link>
              ))}

              <Link
                href="/about/"
                onClick={() => setOpen(false)}
                className="text-body text-ink-900"
              >
                {strings.nav.about}
              </Link>
            </nav>

            <ul className="flex gap-2">
              {SOCIAL.map((social) => (
                <li key={social.label} className="flex-1">
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={social.label}
                    className="flex h-12 items-center justify-center bg-hairline text-ink-900 transition-colors hover:text-accent"
                  >
                    <social.Icon />
                  </a>
                </li>
              ))}
            </ul>

            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-4 flex h-12 items-center justify-center gap-2 bg-accent text-body text-white transition-opacity hover:opacity-90"
            >
              <TelegramIcon />
              {strings.nav.telegram}
            </a>
          </div>
        </div>
      ) : null}
    </>
  );
}

function BurgerIcon() {
  return (
    <svg
      width="20"
      height="14"
      viewBox="0 0 20 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M0 1h20M0 7h20M0 13h20"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M2 2l12 12M14 2L2 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
