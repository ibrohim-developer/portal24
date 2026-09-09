import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AdsSlot } from "@/components/ui/ads-slot";
import { Container } from "@/components/ui/container";
import { LeadBlock } from "@/components/ui/lead-block";
import { NewsCard } from "@/components/ui/news-card";
import { getNewsRepository } from "@/lib/news/repository";
import { strings } from "@/lib/strings";

const FEED_LIMIT = 15;

export const metadata: Metadata = {
  // The heading carries the design's hash prefix; the browser tab should not.
  title: strings.nav.popular,
  description: strings.popular.description,
  alternates: { canonical: "/popular/" },
  openGraph: {
    type: "website",
    title: strings.nav.popular,
    description: strings.popular.description,
  },
};

export default async function PopularPage() {
  const repo = getNewsRepository("api");

  const popular = await repo.getPopular(FEED_LIMIT);

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
          <div className="flex flex-col gap-head">
            <h1 className="text-title-sm font-medium text-ink-900 lg:text-title-lg">
              {strings.sections.popular}
            </h1>

            <div className="flex flex-col lg:grid lg:grid-rail lg:items-start lg:gap-gutter">
              <div className="flex min-w-0 flex-col gap-gutter">
                {lead ? (
                  <>
                    <LeadBlock lead={lead} secondary={secondary} />

                    {grid.length > 0 ? (
                      <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3">
                        {grid.map((article) => (
                          <NewsCard key={article.id} article={article} />
                        ))}
                      </div>
                    ) : null}
                  </>
                ) : (
                  <p className="text-body text-ink-600 lg:text-lead">
                    {strings.popular.empty}
                  </p>
                )}
              </div>

              <aside className="hidden min-w-0 lg:block">
                <AdsSlot
                  width={300}
                  height={450}
                  label={strings.a11y.advertising}
                  className="w-full"
                />
              </aside>
            </div>
          </div>
        </Container>
      </main>

      <SiteFooter />
    </>
  );
}
