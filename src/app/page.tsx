import { HighlightsRow } from "@/components/home/highlights-row";
import { NumberOfDay } from "@/components/home/number-of-day";
import { PopularSidebar } from "@/components/home/popular-sidebar";
import { StatsRow } from "@/components/home/stats-row";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AdsSlot } from "@/components/ui/ads-slot";
import { Container } from "@/components/ui/container";
import { FeedBlock, type FeedLayout } from "@/components/ui/feed-block";
import { LeadBlock } from "@/components/ui/lead-block";
import { getNewsRepository } from "@/lib/news/repository";
import { strings } from "@/lib/strings";
import type { Category } from "@/lib/news/types";

export const revalidate = 60;

/** Lead story plus the two cards beside it. */
const LEAD_LIMIT = 3;

/** Six stories, two columns of three, as the Figma tiles the block. */
const POPULAR_LIMIT = 6;

/** The "Свежие новости" rail. */
const RAIL_LIMIT = 8;

/**
 * How many category blocks run before "Цифры последних дней".
 *
 * The Figma interrupts the category run with the numbers carousel after
 * #Экология rather than closing the page with it.
 */
const STATS_ROW_AFTER = 2;

/** How many stories each arrangement has room for. */
const CARDS_PER_LAYOUT: Record<FeedLayout, number> = {
  featured: 3,
  grid: 6,
  rows: 6,
};

const BLOCK_LAYOUTS: FeedLayout[] = [
  "featured",
  "grid",
  "grid",
  "featured",
  "rows",
];

export default async function HomePage() {
  const repo = getNewsRepository("api");

  const [
    freshPool,
    popular,
    statOfDay,
    recentStats,
    highlights,
    categoryFeeds,
  ] = await Promise.all([
    repo.getTopStories(LEAD_LIMIT + POPULAR_LIMIT + RAIL_LIMIT),
    repo.getPopular(POPULAR_LIMIT),
    repo.getStatOfTheDay(),
    repo.getRecentStats(6),
    repo.getHighlights(6),
    repo.getCategories().then((categories) =>
      Promise.all(
        categories.map(async (category, index) => {
          const layout = BLOCK_LAYOUTS[index % BLOCK_LAYOUTS.length];
          return {
            category,
            layout,
            articles: await repo.getByCategory(
              category.slug,
              CARDS_PER_LAYOUT[layout],
            ),
          };
        }),
      ),
    ),
  ]);

  const [lead, ...restFresh] = freshPool;
  const secondary = restFresh.slice(0, LEAD_LIMIT - 1);

  const shownIds = new Set(
    [lead, ...secondary, ...popular].filter(Boolean).map((a) => a.id),
  );
  const fresh = restFresh
    .filter((a) => !shownIds.has(a.id))
    .slice(0, RAIL_LIMIT);

  const categoryBlock = ({
    category,
    layout,
    articles,
  }: {
    category: Category;
    layout: FeedLayout;
    articles: typeof popular;
  }) => (
    <FeedBlock
      key={category.slug}
      title={`#${category.name}`}
      href={`/${category.slug}/`}
      seeAllLabel={strings.sections.seeAll}
      articles={articles}
      layout={layout}
    />
  );

  return (
    <>
      {/* The leaderboard sits above the nav in the Figma, not under it. */}
      <Container bleed className="pb-gutter">
        <AdsSlot
          width={1280}
          height={200}
          label={strings.a11y.advertising}
          className="w-full"
        />
      </Container>

      <SiteHeader />

      <main className="flex flex-1 flex-col gap-section py-gutter">
        <Container>
          <div className="flex flex-col gap-section lg:grid lg:grid-rail lg:items-start lg:gap-gutter">
            <div className="flex min-w-0 flex-col gap-section">
              {lead ? <LeadBlock lead={lead} secondary={secondary} /> : null}

              {statOfDay ? (
                <NumberOfDay
                  stat={statOfDay}
                  label={strings.sections.numberOfDay}
                />
              ) : null}

              <FeedBlock
                articles={popular}
                title={strings.sections.popular}
                href="/popular/"
                seeAllLabel={strings.sections.seeAll}
                layout="rows"
              />

              {categoryFeeds.slice(0, STATS_ROW_AFTER).map(categoryBlock)}
            </div>

            <aside className="flex w-full min-w-0 flex-col gap-section">
              <PopularSidebar articles={fresh} title={strings.sections.fresh} />

              <div className="hidden lg:block">
                <AdsSlot
                  width={300}
                  height={450}
                  label={strings.a11y.advertising}
                  className="w-full"
                />
              </div>
            </aside>
          </div>
        </Container>

        <StatsRow
          stats={recentStats}
          title={strings.sections.recentNumbers}
          prevLabel={strings.a11y.prev}
          nextLabel={strings.a11y.next}
        />

        <Container>
          <div className="flex flex-col gap-section lg:w-column">
            {categoryFeeds.slice(STATS_ROW_AFTER).map(categoryBlock)}
          </div>
        </Container>

        <HighlightsRow
          highlights={highlights}
          title={strings.sections.minute}
          prevLabel={strings.a11y.prev}
          nextLabel={strings.a11y.next}
        />
      </main>

      <SiteFooter />
    </>
  );
}
