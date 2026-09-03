import { notFound } from "next/navigation";

import { CategoryBlock } from "@/components/home/category-block";
import { LeadBlock } from "@/components/home/lead-block";
import { NumberOfDay } from "@/components/home/number-of-day";
import { PopularSidebar } from "@/components/home/popular-sidebar";
import { StatsRow } from "@/components/home/stats-row";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AdsSlot } from "@/components/ui/ads-slot";
import { Container } from "@/components/ui/container";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { HOME_CATEGORY_BLOCKS } from "@/lib/categories";
import { getNewsRepository } from "@/lib/news/repository";

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
  const [topStories, popular, statOfDay, recentStats, categoryFeeds] =
    await Promise.all([
      repo.getTopStories(locale, 5),
      repo.getPopular(locale, 8),
      repo.getStatOfTheDay(locale),
      repo.getRecentStats(locale, 6),
      Promise.all(
        HOME_CATEGORY_BLOCKS.map(async (slug) => ({
          slug,
          articles: await repo.getByCategory(locale, slug, 4),
        })),
      ),
    ]);

  const [lead, ...secondary] = topStories;

  return (
    <>
      <SiteHeader locale={locale} dict={dict} />

      <main className="flex-1 py-gutter">
        <Container>
        <AdsSlot
          width={1280}
          height={200}
          label={dict.a11y.advertising}
          className="mb-section w-full"
        />

        <div className="flex flex-col gap-section lg:flex-row lg:items-start">
          <div className="flex min-w-0 flex-1 flex-col gap-section">
            {lead ? (
              <LeadBlock lead={lead} secondary={secondary} locale={locale} />
            ) : null}

            {statOfDay ? (
              <NumberOfDay stat={statOfDay} label={dict.sections.numberOfDay} />
            ) : null}

            {categoryFeeds.map(({ slug, articles }, i) => (
              <CategoryBlock
                key={slug}
                title={`#${dict.nav[slug]}`}
                href={`/${locale}/${slug}/`}
                seeAllLabel={dict.sections.seeAll}
                articles={articles}
                locale={locale}
                // The Figma alternates a featured layout with plain grids.
                feature={i % 2 === 0}
              />
            ))}

            <StatsRow
              stats={recentStats}
              title={dict.sections.recentNumbers}
              href={`/${locale}/numbers/`}
              seeAllLabel={dict.sections.seeAll}
            />
          </div>

          <aside className="flex w-full flex-col gap-section lg:w-side lg:shrink-0">
            <PopularSidebar
              articles={popular}
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
      </main>

      <SiteFooter locale={locale} dict={dict} />
    </>
  );
}
