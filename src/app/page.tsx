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

/**
 * The arrangement each category block gets, in order.
 *
 * Not derivable from the position - the Figma's run is featured, grid, grid,
 * featured, rows, and every attempt to compute that from an index gets one of
 * them wrong. This replaces the design-keyed HOME_CATEGORY_BLOCKS now that the
 * categories themselves come from the CMS rather than from the design. The
 * CMS publishes six categories to the design's five, so the run cycles; which
 * arrangement the sixth block should get is a question for the designer.
 */
const BLOCK_LAYOUTS: FeedLayout[] = [
  "featured",
  "grid",
  "grid",
  "featured",
  "rows",
];

export default async function HomePage() {
  // The one page on the live CMS. Its categories, its stories, its ordering -
  // but still fixture figures and fixture videos, which the API has no source
  // for; `news/api-repository` lists what each gap is waiting on.
  const repo = getNewsRepository("api");

  // Fetched together rather than in sequence - under static export this only
  // affects build time, but it is the shape we want once these hit a real API.
  const [
    freshPool,
    popular,
    statOfDay,
    recentStats,
    highlights,
    categoryFeeds,
  ] = await Promise.all([
    // Over-fetched because the rail is filtered against everything above it:
    // a popular story is usually also a recent one, so asking for exactly
    // RAIL_LIMIT would leave the rail short once the overlap is removed.
    repo.getTopStories(LEAD_LIMIT + POPULAR_LIMIT + RAIL_LIMIT),
    repo.getPopular(POPULAR_LIMIT),
    repo.getStatOfTheDay(),
    repo.getRecentStats(6),
    repo.getHighlights(6),
    // A block per category the CMS publishes, in the CMS's own order, rather
    // than the design's five hardcoded topics - of which only Sport exists in
    // the CMS at all.
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

  // The rail is "Свежие новости", so it runs the fresh feed - not getPopular,
  // which now feeds the #Популярное block in the main column. Nothing appears
  // twice on the page: the rail skips whatever the blocks above it showed.
  const shownIds = new Set(
    [lead, ...secondary, ...popular].filter(Boolean).map((a) => a.id),
  );
  const fresh = restFresh
    .filter((a) => !shownIds.has(a.id))
    .slice(0, RAIL_LIMIT);

  // Rendered as two runs either side of the numbers carousel. Each block
  // carries its own arrangement, so splitting the run cannot knock the
  // featured/grid sequence out of step.
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
      // The CMS's own name for the topic. It stores those in Cyrillic even
      // when asked for `lang: uz`, so these headings read "#Ўзбекистон" while
      // the Latin nav above them reads "#Sport" - a backend spelling to fix in
      // the admin panel, not something to transliterate on the way in.
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

      {/*
        The section rhythm lives on <main> rather than inside one Container,
        because the numbers carousel is full-bleed and has to sit between two
        Containers rather than inside either of them.
      */}
      <main className="flex flex-1 flex-col gap-section py-gutter">
        <Container>
        {/*
          20px between the content column and the rail, not the 82px section
          rhythm: the design is 960 + 20 + 300 = 1280 exactly, and a section
          gap here steals 62px from the content column, shrinking every
          `md` card from its designed 307px to 245px. The section gap is
          still right on mobile, where the rail stacks underneath.

          The 960/300 split is a ratio (`grid-rail`) rather than a fixed pair,
          because the container is narrower than 1280 below a 1440 viewport.
        */}
        <div className="flex flex-col gap-section lg:grid lg:grid-rail lg:items-start lg:gap-gutter">
          <div className="flex min-w-0 flex-col gap-section">
            {lead ? (
              <LeadBlock lead={lead} secondary={secondary} />
            ) : null}

            {statOfDay ? (
              <NumberOfDay stat={statOfDay} label={strings.sections.numberOfDay} />
            ) : null}

            {/* The Figma opens the run of blocks with #Популярное, not with
                the first category. */}
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
            <PopularSidebar
              articles={fresh}
              title={strings.sections.fresh}
            />
            {/*
              Hidden on mobile, as the ad rail is on every other page - but
              here the rail also carries the fresh list, which the phone layout
              keeps, so only the ad is dropped and not the whole <aside>.
              Stacked into the single column it would otherwise put a 450px
              block mid-page, between that list and the numbers carousel.

              The wrapper does the hiding because AdsSlot is itself `flex`,
              and `cn` is a plain join with no tailwind-merge to settle which
              display utility would win on the slot itself.
            */}
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

        {/* Full-bleed, so it sits outside Container - see the component. */}
        <StatsRow
          stats={recentStats}
          title={strings.sections.recentNumbers}
          prevLabel={strings.a11y.prev}
          nextLabel={strings.a11y.next}
        />

        <Container>
          {/*
            The rail has ended by this point, but the blocks under the carousel
            keep the 960 column the ones above it have.
          */}
          <div className="flex flex-col gap-section lg:w-column">
            {categoryFeeds.slice(STATS_ROW_AFTER).map(categoryBlock)}
          </div>
        </Container>

        {/* Closes the page, under the last category block. Full-bleed too. */}
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
