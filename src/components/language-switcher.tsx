"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
 *
 * One shape on every surface: the active code, with the other two behind it.
 * That is what the design draws for the mobile nav (2218:17584); the desktop
 * header (2232:15466) lists all three codes side by side, and showing only
 * the active one there is a deliberate departure from it. What the open state
 * looks like is this component's invention either way - the design does not
 * draw it.
 *
 * The two variants differ only in affordance. "bare" is the mobile mark, a
 * glyph with no tint behind it, matching the search and burger beside it.
 * "button" adds a chevron and a hover colour, because on desktop the control
 * sits among tinted buttons and a lone "UZ" reads as a label, not a menu.
 */
export function LanguageSwitcher({
  current,
  label,
  variant = "bare",
}: {
  current: Locale;
  label: string;
  variant?: "bare" | "button";
}) {
  const pathname = usePathname();
  const rest = pathname.replace(/^\/[^/]+/, "");
  const [open, setOpen] = useState(false);
  const others = locales.filter((locale) => locale !== current);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="relative">
      {/* Sits under the list and over everything else, so a click anywhere
          outside closes the menu without a document-level listener. */}
      {open ? (
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-10 cursor-default"
        />
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={label}
        aria-expanded={open}
        aria-haspopup="true"
        className={cn(
          "relative z-20 flex h-11 items-center px-1 text-body font-medium text-ink-900",
          variant === "button" && "gap-1 transition-colors hover:text-accent",
        )}
      >
        {CODE[current]}
        {variant === "button" ? <ChevronDownIcon open={open} /> : null}
      </button>

      {open ? (
        <ul className="absolute right-0 top-full z-20 min-w-16 bg-white py-1 shadow-lg ring-1 ring-hairline">
          {others.map((locale) => (
            <li key={locale}>
              <Link
                href={`/${locale}${rest}`}
                hrefLang={locale}
                onClick={() => setOpen(false)}
                className="block px-3 py-2 text-body text-ink-600 transition-colors hover:text-accent"
              >
                {CODE[locale]}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/** Only the "button" variant draws it, so it stays with the switcher. */
function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className={cn("shrink-0 transition-transform", open && "rotate-180")}
    >
      <path
        d="m3 4.5 3 3 3-3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
