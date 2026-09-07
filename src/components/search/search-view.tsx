"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

import { NewsCard } from "@/components/ui/news-card";
import { SearchIcon } from "@/components/ui/icons";
import { CATEGORY_TINT } from "@/lib/categories";
import { cn } from "@/lib/cn";
import { strings } from "@/lib/strings";
import { matchArticles, SEARCH_SUGGESTIONS } from "@/lib/news/search";
import type { Article } from "@/lib/news/types";

/** Search page heading, at the scale the other pages' titles use. */
const HEADING = "text-title-sm font-medium text-ink-900 lg:text-title-lg";

function href(query: string): string {
  return query ? `/search/?q=${encodeURIComponent(query)}` : "/search/";
}

/**
 * The whole search page below the header: field, suggestion chips, and
 * whichever of the three states the query puts underneath them.
 *
 * A Client Component because the query lives in `?q=` and this site is a
 * static export - one HTML file is built for `/search/`, so which stories it
 * shows can only be decided in the browser. `index` is therefore the whole
 * searchable set, embedded in that file; see `getSearchIndex`.
 *
 * `popular` and `rail` arrive as rendered elements rather than as data so the
 * cards and the ad slot stay on the server side of the boundary.
 *
 * `useSearchParams` suspends on a prerendered route, so the page keeps this
 * inside a `<Suspense>` boundary; without one the production build fails.
 */
export function SearchView({
  index,
  popular,
  rail,
}: {
  index: Article[];
  /** The "Популярное за неделю" cards - lead arrangement plus its grid. */
  popular: ReactNode;
  rail: ReactNode;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const query = (params.get("q") ?? "").trim();
  const inputRef = useRef<HTMLInputElement>(null);

  // The field is uncontrolled - typing must not re-filter the page on every
  // keystroke - so a query arriving from anywhere but this form (a chip, the
  // header button, a shared link, the back button) has to be written into it.
  useEffect(() => {
    if (inputRef.current) inputRef.current.value = query;
  }, [query]);

  const results = matchArticles(index, query);
  const found = query !== "" && results.length > 0;

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // `replace`, not `push`: refining a query should not stack a history entry
    // per attempt between the page and wherever the reader came from.
    router.replace(href(inputRef.current?.value.trim() ?? ""), {
      scroll: false,
    });
  }

  return (
    <>
      {/*
        Full-bleed across the 1280 container, above the feed grid - the field
        is wider than the 960 column the results sit in.

        Still a real GET form: with `action` set it keeps working before
        hydration, landing on this same page with `?q=` in the URL, which is
        exactly what the handler above would have produced.
      */}
      <form
        role="search"
        action="/search/"
        onSubmit={submit}
        className="relative"
      >
        <label htmlFor="search-input" className="sr-only">
          {strings.nav.search}
        </label>
        <input
          ref={inputRef}
          id="search-input"
          type="search"
          name="q"
          defaultValue={query}
          autoComplete="off"
          placeholder={strings.nav.searchPlaceholder}
          className="h-12 w-full bg-hairline pr-14 pl-4 text-body text-ink-900 outline-none placeholder:text-ink-400 focus-visible:ring-1 focus-visible:ring-accent lg:h-16 lg:pr-14 lg:pl-5 lg:text-lead"
        />
        <button
          type="submit"
          aria-label={strings.nav.search}
          className="absolute top-0 right-0 flex h-12 w-12 items-center justify-center text-ink-900 transition-colors hover:text-accent lg:h-16 lg:w-12"
        >
          <SearchIcon />
        </button>
      </form>

      {/* Links, not buttons: a chip is a query someone can open in a new tab,
          and each one carries its category's TextBlock tint. */}
      <ul className="mt-gutter flex flex-wrap gap-3">
        {SEARCH_SUGGESTIONS.map(({ key, category }) => {
          const label = strings.search.suggestions[key];
          return (
            <li key={key}>
              <Link
                href={href(label)}
                className={`${CATEGORY_TINT[category]} flex items-center px-4 py-1.5 text-caption text-ink-900 transition-opacity hover:opacity-70`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* 40px below the chips, then the section's own 28px before the cards.
          Whatever titles the feed stays above both columns, so the ad rail
          starts level with the first card rather than level with the title -
          the same reason the popular page hoists its h1. */}
      <div aria-live="polite" className="mt-10 flex flex-col">
        {found ? (
          <h2 className={HEADING}>
            {strings.search.results.replace("{query}", query)}
          </h2>
        ) : query === "" ? null : (
          <div className="flex flex-col gap-2">
            <h2 className={HEADING}>
              {strings.search.empty.replace("{query}", query)}
            </h2>
            <p className="text-body text-ink-600">{strings.search.emptyHint}</p>
          </div>
        )}

        {/* A dead end needs somewhere to go, so the popular block stays under
            a query that found nothing - a full section away from the message,
            since it answers a different question than the one that failed. */}
        {found ? null : (
          <h2 className={cn(HEADING, query !== "" && "mt-section")}>
            {strings.search.popularTitle}
          </h2>
        )}

        <div className="mt-head flex flex-col lg:grid lg:grid-rail lg:items-start lg:gap-gutter">
          <div className="flex min-w-0 flex-col gap-head">
            {found ? (
              <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3">
                {results.map((article) => (
                  <NewsCard
                    key={article.id}
                    article={article}
                    highlight={query}
                  />
                ))}
              </div>
            ) : (
              popular
            )}
          </div>

          {/* Ad rail only, hidden on mobile - as on popular and author. */}
          <aside className="hidden min-w-0 lg:block">{rail}</aside>
        </div>
      </div>
    </>
  );
}
