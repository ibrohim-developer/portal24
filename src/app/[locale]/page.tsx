import { notFound } from "next/navigation";

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
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { HOME_CATEGORY_BLOCKS } from "@/lib/categories";
import { getNewsRepository } from "@/lib/news/repository";

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

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const repo = getNewsRepository();

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
    repo.getTopStories(locale, LEAD_LIMIT + POPULAR_LIMIT + RAIL_LIMIT),
    repo.getPopular(locale, POPULAR_LIMIT),
    repo.getStatOfTheDay(locale),
    repo.getRecentStats(locale, 6),
    repo.getHighlights(locale, 6),
    Promise.all(
      HOME_CATEGORY_BLOCKS.map(async ({ slug, layout }) => ({
        slug,
        layout,
        articles: await repo.getByCategory(
          locale,
          slug,
          CARDS_PER_LAYOUT[layout],
        ),
      })),
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
    slug,
    layout,
    articles,
  }: (typeof categoryFeeds)[number]) => (
    <FeedBlock
      key={slug}
      title={`#${dict.nav[slug]}`}
      href={`/${locale}/${slug}/`}
      seeAllLabel={dict.sections.seeAll}
      articles={articles}
      locale={locale}
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
          label={dict.a11y.advertising}
          className="w-full"
        />
      </Container>

      <SiteHeader locale={locale} dict={dict} />

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
              <LeadBlock lead={lead} secondary={secondary} locale={locale} />
            ) : null}

            {statOfDay ? (
              <NumberOfDay stat={statOfDay} label={dict.sections.numberOfDay} />
            ) : null}

            {/* The Figma opens the run of blocks with #Популярное, not with
                the first category. */}
            <FeedBlock
              articles={popular}
              title={dict.sections.popular}
              href={`/${locale}/popular/`}
              seeAllLabel={dict.sections.seeAll}
              locale={locale}
              layout="rows"
            />

            {categoryFeeds.slice(0, STATS_ROW_AFTER).map(categoryBlock)}
          </div>

          <aside className="flex w-full min-w-0 flex-col gap-section">
            <PopularSidebar
              articles={fresh}
              locale={locale}
              title={dict.sections.fresh}
            />
            <AdsSlot
              width={300}
              height={450}
              label={dict.a11y.advertising}
              className="w-full"
            />
          </aside>
          </div>
        </Container>

        {/* Full-bleed, so it sits outside Container - see the component. */}
        <StatsRow
          stats={recentStats}
          title={dict.sections.recentNumbers}
          locale={locale}
          prevLabel={dict.a11y.prev}
          nextLabel={dict.a11y.next}
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
          title={dict.sections.minute}
          prevLabel={dict.a11y.prev}
          nextLabel={dict.a11y.next}
        />
      </main>

      <SiteFooter locale={locale} dict={dict} />
    </>
  );
}
