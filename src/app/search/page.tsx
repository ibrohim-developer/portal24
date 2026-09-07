import type { Metadata } from "next";
import { Suspense } from "react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { SearchView } from "@/components/search/search-view";
import { AdsSlot } from "@/components/ui/ads-slot";
import { Container } from "@/components/ui/container";
import { LeadBlock } from "@/components/ui/lead-block";
import { NewsCard } from "@/components/ui/news-card";
import { getNewsRepository } from "@/lib/news/repository";
import { strings } from "@/lib/strings";

/**
 * The "Популярное за неделю" block: the lead arrangement (one story plus the
 * two beside it) and one row of three under it, which is where the design's
 * frame ends.
 */
const POPULAR_LIMIT = 6;

export const metadata: Metadata = {
  title: strings.search.title,
  description: strings.search.description,
  alternates: { canonical: "/search/" },
  // A results page is not a landing page: the built HTML carries no query,
  // so anything indexed here would be the empty state.
  robots: { index: false, follow: true },
};

/**
 * Search (Figma "Web" page, 1934:21889) - where the header's search button
 * and the burger menu's field both land.
 *
 * Under `output: "export"` this is one static file for the whole route, so
 * the query cannot be read on the server: the page renders the shell, hands
 * the full article index to `SearchView`, and the browser filters it. The
 * `<Suspense>` boundary is what `useSearchParams` needs on a prerendered
 * route - the build fails without it.
 *
 * The design opens on the field, not on a page title: there is no visible
 * "Поиск" heading above it, so the h1 here is for the document outline only.
 */
export default async function SearchPage() {
  const repo = getNewsRepository();

  const [index, popular] = await Promise.all([
    repo.getSearchIndex(),
    repo.getPopular(POPULAR_LIMIT),
  ]);

  const [lead, ...rest] = popular;
  const secondary = rest.slice(0, 2);
  const grid = rest.slice(2);

  return (
    <>
      {/* Leaderboard above the nav, as on every other page. */}
      <Container bleed className="pb-gutter">
        <AdsSlot
          width={1280}
          height={200}
          label={strings.a11y.advertising}
          className="w-full"
        />
      </Container>

      <SiteHeader />

      <main className="flex-1 py-gutter">
        <Container>
          <h1 className="sr-only">{strings.search.title}</h1>

          <Suspense
            fallback={<div className="h-12 w-full bg-hairline lg:h-16" />}
          >
            <SearchView
              index={index}
              popular={
                lead ? (
                  // Lead and grid are one continuous feed, so they share the
                  // 20px card gutter rather than the 82px section rhythm.
                  <div className="flex flex-col gap-gutter">
                    <LeadBlock
                      lead={lead}
                      secondary={secondary}
                    />

                    {grid.length > 0 ? (
                      <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3">
                        {grid.map((article) => (
                          <NewsCard
                            key={article.id}
                            article={article}
                          />
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : null
              }
              rail={
                <AdsSlot
                  width={300}
                  height={450}
                  label={strings.a11y.advertising}
                  className="w-full"
                />
              }
            />
          </Suspense>
        </Container>
      </main>

      <SiteFooter />
    </>
  );
}
