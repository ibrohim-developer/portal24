"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { LanguageSwitcher } from "@/components/language-switcher";
import { NAV_ITEMS } from "@/lib/categories";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

/**
 * Mobile navigation, from the Figma BurgerMenu (2218:17398).
 *
 * The only client component on the main page. Everything else renders on the
 * server, so with JS disabled the page still reads fine - only this toggle is
 * inert, which is why the links it contains are duplicated in the footer.
 */
export function BurgerMenu({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
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
        aria-label={dict.nav.menu}
        aria-expanded={open}
        className="flex h-12 w-12 items-center justify-center bg-hairline lg:hidden"
      >
        <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden="true">
          <path
            d="M0 1h20M0 7h20M0 13h20"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-white lg:hidden">
          <div className="flex h-20 items-center justify-between px-4">
            <span className="text-body font-medium">{dict.nav.menu}</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={dict.nav.close}
              className="flex h-12 w-12 items-center justify-center bg-hairline"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M2 2l12 12M14 2L2 14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <nav
            aria-label={dict.a11y.mainNav}
            className="flex flex-col gap-7 overflow-y-auto px-4 py-6"
          >
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={`/${locale}/${item.href}/`}
                onClick={() => setOpen(false)}
                className="text-title-sm text-ink-900"
              >
                #{dict.nav[item.key]}
              </Link>
            ))}

            <Link
              href={`/${locale}/about/`}
              onClick={() => setOpen(false)}
              className="text-title-sm text-ink-900"
            >
              {dict.nav.about}
            </Link>

            <div className="pt-4">
              <LanguageSwitcher current={locale} label={dict.a11y.languages} />
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );
}
