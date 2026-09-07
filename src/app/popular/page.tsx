import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AdsSlot } from "@/components/ui/ads-slot";
import { Container } from "@/components/ui/container";
import { LeadBlock } from "@/components/ui/lead-block";
import { NewsCard } from "@/components/ui/news-card";
import { getNewsRepository } from "@/lib/news/repository";
import { strings } from "@/lib/strings";

/**
 * How many popular stories the page renders.
 *
 * Three go into the lead arrangement and the remaining twelve tile four rows
 * of three, so nothing dangles at the bottom of the grid. As on the author
 * page there is no "show more" control: under `output: "export"` it could only
 * reveal cards already present in the HTML. When the admin API lands this
 * becomes the first page of a real `offset` query.
 */
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

/**
 * Popular News (Figma "Web" page, 1981:16650) - the destination of every
 * "#Популярное" link: the header nav, the footer, and the "Смотреть все" on
 * the article page's popular block.
 *
 * Laid out on the feed grid (960 content + 300 rail inside the 1280
 * container), the same one the author page uses, rather than the article
 * page's narrower 800 + 300. The rail carries the ad slot only - this page is
 * one feed, so a second column of headlines beside it would compete with it.
 *
 * The frame itself has not been read: the Figma MCP tool-call quota was spent
 * before this page was built, so every measurement here is carried over from
 * the main and author pages rather than taken from 1981:16650.
 */
export default async function PopularPage() {
  const repo = getNewsRepository();

  const popular = await repo.getPopular(FEED_LIMIT);

  const [lead, ...rest] = popular;
  // The lead arrangement takes the first story plus the two beside it; the
  // grid picks up from the fourth.
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
          {/*
            The heading sits above both columns rather than inside the feed, so
            the ad rail starts level with the first card instead of level with
            the title.

            The row gap is the 20px gutter, not the 82px section rhythm: the
            design is 960 + 20 + 300 across the 1280 container, and an 82px gap
            here silently narrows the feed to 898 - which shrinks the small
            card from its 307 to 245 and every grid card with it.
          */}
          <div className="flex flex-col gap-head">
            {/*
              SectionHead is an h2 with a "see all" link, and this page is the
              "all" - so the title is written out here as the page's h1 at
              the same type scale.
            */}
            <h1 className="text-title-sm font-medium text-ink-900 lg:text-title-lg">
              {strings.sections.popular}
            </h1>

            <div className="flex flex-col lg:grid lg:grid-rail lg:items-start lg:gap-gutter">
              {/* Lead and grid are one continuous feed, so they share the 20px
                  card gutter rather than the 82px between-block rhythm. */}
              <div className="flex min-w-0 flex-col gap-gutter">
                {lead ? (
                  <>
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
                  </>
                ) : (
                  <p className="text-body text-ink-600 lg:text-lead">
                    {strings.popular.empty}
                  </p>
                )}
              </div>

              {/*
                Nothing but the ad slot left in the rail, so it is hidden on
                mobile as on the article and author pages - the leaderboard
                above the nav is the only ad a phone gets.
              */}
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
