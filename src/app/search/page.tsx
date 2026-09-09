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

const POPULAR_LIMIT = 6;

export const metadata: Metadata = {
  title: strings.search.title,
  description: strings.search.description,
  alternates: { canonical: "/search/" },
  robots: { index: false, follow: true },
};

export default async function SearchPage() {
  const repo = getNewsRepository("api");

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
                  <div className="flex flex-col gap-gutter">
                    <LeadBlock lead={lead} secondary={secondary} />

                    {grid.length > 0 ? (
                      <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3">
                        {grid.map((article) => (
                          <NewsCard key={article.id} article={article} />
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
