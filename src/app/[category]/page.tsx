import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NumberOfDay } from "@/components/home/number-of-day";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AdsSlot } from "@/components/ui/ads-slot";
import { ArticleFeed } from "@/components/ui/article-feed";
import { Container } from "@/components/ui/container";
import { LeadBlock } from "@/components/ui/lead-block";
import { getNewsRepository, type ContentSource } from "@/lib/news/repository";
import { strings } from "@/lib/strings";
import { categorySlugs, isCategorySlug } from "@/lib/news/types";

/**
 * How many stories the feed holds, and how many of them are in the grid
 * before "Показать ещё" reveals the rest.
 *
 * Three go into the lead arrangement, so the grid opens with nine - three
 * rows - and the ceiling leaves room for seven more. The same numbers the
 * author page uses, for the same reason: under `output: "export"` the button
 * can only reveal cards already in the HTML, so the ceiling is what one page
 * is worth shipping. When the admin API can paginate, FEED_LIMIT becomes the
 * first page of a real `offset` query.
 */
const FEED_LIMIT = 24;
const GRID_INITIAL = 9;

/**
 * Slower than the front page: a category feed is somewhere a reader arrives
 * having already seen the headline, so it can lag the newsroom by minutes.
 */
export const revalidate = 300;

/**
 * A category the CMS gains after a deploy is rendered on first request rather
 * than 404ing until someone rebuilds - the reason `getCategories` is no longer
 * memoised for the life of the process. `resolveCategory` still returns null
 * for a segment neither taxonomy claims, so a junk URL is a 404 as before.
 */
export const dynamicParams = true;

/**
 * A category can come from either taxonomy, so the page has to know which.
 *
 * The design's five are fixtures and are named by `strings.nav`; the CMS's own
 * six come from the API and are named by the API. Both are built: the main
 * page links to the CMS ones, while article and author pages - still on
 * fixtures - link to the design ones, and neither set may 404.
 */
async function resolveCategory(
  slug: string,
): Promise<{ source: ContentSource; name: string } | null> {
  // The CMS is asked first, because the two taxonomies overlap on `sport`:
  // Спорт transliterates to the same segment the design already used. Real
  // stories win that collision - the main page's #Спорт block links here, and
  // it would be odd for it to open a page of fixtures.
  const match = (await getNewsRepository("api").getCategories()).find(
    (candidate) => candidate.slug === slug,
  );
  if (match) return { source: "api", name: match.name };

  if (isCategorySlug(slug)) {
    return { source: "fixtures", name: strings.nav[slug] };
  }

  return null;
}

/**
 * The paths this segment claims. `about`, `authors`, `news`, `popular` and
 * `search` are static siblings, and a static segment wins over a dynamic one,
 * so none of them can be shadowed from here.
 */
export async function generateStaticParams() {
  const cmsCategories = await getNewsRepository("api").getCategories();

  return [...categorySlugs, ...cmsCategories.map((c) => c.slug)]
    .filter((category, index, all) => all.indexOf(category) === index)
    .map((category) => ({ category }));
}

type CategoryParams = { params: Promise<{ category: string }> };

export async function generateMetadata({
  params,
}: CategoryParams): Promise<Metadata> {
  const { category } = await params;
  const resolved = await resolveCategory(category);
  if (!resolved) notFound();

  // The heading carries the design's hash prefix; the browser tab should not.
  const name = resolved.name;
  const description = strings.category.description.replace("{category}", name);

  return {
    title: name,
    description,
    alternates: { canonical: `/${category}/` },
    openGraph: { type: "website", title: name, description },
  };
}

/**
 * One category's feed - the destination of every "#Спорт"-style link: the
 * header nav, the footer, the "Смотреть все" on each main-page block, and the
 * beats an author lists on their page.
 *
 * Built from the design crop the user supplied for #Спорт rather than from a
 * Figma node: the file's MCP tool-call quota is still refusing the first call
 * of a session. What the crop settles is the order - the hashed heading with
 * no "see all" beside it, the 633 + 307 lead arrangement, the 300px ad rail,
 * and "Цифра дня" directly under the lead block - which is what makes this a
 * page of its own rather than a re-run of the main page's block, where #Спорт
 * is followed by #Экология and carries a "Смотреть все" link.
 *
 * The crop stops at the number-of-the-day panel. The grid under it continues
 * the feed on the author page's three-up grid, on the same reasoning the
 * popular page uses - one category, one feed, and a rail that holds the ad
 * and nothing that would compete with it.
 */
export default async function CategoryPage({ params }: CategoryParams) {
  const { category } = await params;
  const resolved = await resolveCategory(category);
  if (!resolved) notFound();

  const repo = getNewsRepository(resolved.source);

  const [articles, statOfDay] = await Promise.all([
    repo.getByCategory(category, FEED_LIMIT),
    repo.getStatOfTheDay(),
  ]);

  const [lead, ...rest] = articles;
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
            the title - the same arrangement the popular page uses.
          */}
          <div className="flex flex-col gap-head">
            {/*
              SectionHead is an h2 with a "see all" link, and this page is the
              "all" - so the title is written out here as the page's h1 at the
              same type scale, hash prefix and all.
            */}
            <h1 className="text-title-sm font-medium text-ink-900 lg:text-title-lg">
              #{resolved.name}
            </h1>

            {/*
              20px between the feed and the rail, not the 82px section rhythm:
              the design is 960 + 20 + 300 = 1280 exactly, and a section gap
              here steals 62px from the feed, shrinking every `md` card from
              its designed 307px to 245px.
            */}
            <div className="flex flex-col lg:grid lg:grid-rail lg:items-start lg:gap-gutter">
              <div className="flex min-w-0 flex-col gap-section">
                {lead ? (
                  <>
                    <LeadBlock lead={lead} secondary={secondary} />

                    {statOfDay ? (
                      <NumberOfDay
                        stat={statOfDay}
                        label={strings.sections.numberOfDay}
                      />
                    ) : null}

                    {grid.length > 0 ? (
                      <ArticleFeed
                        articles={grid}
                        initial={GRID_INITIAL}
                        moreLabel={strings.sections.showMore}
                      />
                    ) : null}
                  </>
                ) : (
                  <p className="text-body text-ink-600 lg:text-lead">
                    {strings.category.empty}
                  </p>
                )}
              </div>

              {/*
                Nothing but the ad slot in the rail, so it is hidden on mobile
                as on the article, author and popular pages - the leaderboard
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
