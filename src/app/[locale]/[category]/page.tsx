import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NumberOfDay } from "@/components/home/number-of-day";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AdsSlot } from "@/components/ui/ads-slot";
import { ArticleFeed } from "@/components/ui/article-feed";
import { Container } from "@/components/ui/container";
import { LeadBlock } from "@/components/ui/lead-block";
import { isLocale, locales, localeHrefLang } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getNewsRepository } from "@/lib/news/repository";
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

/** The five categories are built ahead of time; anything else is a 404. */
export const dynamicParams = false;

/**
 * The parent `[locale]` layout generates the three locales and this runs once
 * for each of them. The slugs are the same every time - they are URL segments,
 * not display names - so the locale it is called with is not read.
 *
 * These five are the only paths this segment claims. `about`, `authors`,
 * `news`, `popular` and `search` are static siblings, and a static segment
 * wins over a dynamic one, so none of them can be shadowed from here.
 */
export function generateStaticParams() {
  return categorySlugs.map((category) => ({ category }));
}

type CategoryParams = {
  params: Promise<{ locale: string; category: string }>;
};

export async function generateMetadata({
  params,
}: CategoryParams): Promise<Metadata> {
  const { locale, category } = await params;
  if (!isLocale(locale) || !isCategorySlug(category)) notFound();

  const dict = await getDictionary(locale);
  // The heading carries the design's hash prefix; the browser tab should not.
  const name = dict.nav[category];
  const description = dict.category.description.replace("{category}", name);

  return {
    title: name,
    description,
    alternates: {
      canonical: `/${locale}/${category}/`,
      // Category slugs are URL segments rather than translated words, so the
      // same path serves every locale.
      languages: Object.fromEntries(
        locales.map((l) => [localeHrefLang[l], `/${l}/${category}/`]),
      ),
    },
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
  const { locale, category } = await params;
  if (!isLocale(locale) || !isCategorySlug(category)) notFound();

  const dict = await getDictionary(locale);
  const repo = getNewsRepository();

  const [articles, statOfDay] = await Promise.all([
    repo.getByCategory(locale, category, FEED_LIMIT),
    repo.getStatOfTheDay(locale),
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
          label={dict.a11y.advertising}
          className="w-full"
        />
      </Container>

      <SiteHeader locale={locale} dict={dict} />

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
              #{dict.nav[category]}
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
                    <LeadBlock
                      lead={lead}
                      secondary={secondary}
                      locale={locale}
                    />

                    {statOfDay ? (
                      <NumberOfDay
                        stat={statOfDay}
                        label={dict.sections.numberOfDay}
                      />
                    ) : null}

                    {grid.length > 0 ? (
                      <ArticleFeed
                        articles={grid}
                        locale={locale}
                        initial={GRID_INITIAL}
                        moreLabel={dict.sections.showMore}
                      />
                    ) : null}
                  </>
                ) : (
                  <p className="text-body text-ink-600 lg:text-lead">
                    {dict.category.empty}
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
                  label={dict.a11y.advertising}
                  className="w-full"
                />
              </aside>
            </div>
          </div>
        </Container>
      </main>

      <SiteFooter locale={locale} dict={dict} />
    </>
  );
}
