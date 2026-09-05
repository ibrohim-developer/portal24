import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AuthorHero } from "@/components/author/author-hero";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AdsSlot } from "@/components/ui/ads-slot";
import { ArticleFeed } from "@/components/ui/article-feed";
import { Container } from "@/components/ui/container";
import { LeadBlock } from "@/components/ui/lead-block";
import { SectionHead } from "@/components/ui/section-head";
import { isLocale, locales, localeHrefLang } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getNewsRepository } from "@/lib/news/repository";

/** Every author is built ahead of time, so an unknown slug is a 404. */
export const dynamicParams = false;

/**
 * How many stories each of the two blocks renders.
 *
 * "Популярные статьи" is a lead card plus two, so it is always exactly three.
 * "Все статьи" builds three rows of three, then puts the rest behind the
 * "Показать ещё" button - see `ArticleFeed` for why they are all in the HTML
 * either way. FEED_LIMIT is the ceiling on one author's page; when the admin
 * API can paginate it becomes the first page of a real `offset` query.
 */
const POPULAR_LIMIT = 3;
const FEED_INITIAL = 9;
const FEED_LIMIT = 24;

/**
 * The parent `[locale]` layout generates the three locales; this fills in the
 * author slugs for each one. `params` here is a plain object - only page props
 * are promises.
 */
export async function generateStaticParams({
  params: { locale },
}: {
  params: { locale: string };
}) {
  if (!isLocale(locale)) return [];

  const slugs = await getNewsRepository().getAuthorSlugs(locale);
  return slugs.map((slug) => ({ slug }));
}

type AuthorParams = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({
  params,
}: AuthorParams): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const author = await getNewsRepository().getAuthor(locale, slug);
  if (!author) notFound();

  const description = author.bio ?? author.role ?? author.name;
  const path = `/${locale}/authors/${slug}/`;

  return {
    title: author.name,
    description,
    alternates: {
      canonical: path,
      // Author slugs are transliterated from the name, so they are the same in
      // every locale. If the CMS ever localises them this has to resolve each
      // locale's slug rather than reusing `slug`.
      languages: Object.fromEntries(
        locales.map((l) => [localeHrefLang[l], `/${l}/authors/${slug}/`]),
      ),
    },
    openGraph: {
      type: "profile",
      title: author.name,
      description,
      images: author.avatar ? [author.avatar.url] : undefined,
    },
  };
}

/**
 * Author page (Figma "Web" page, 1981:17549) - the destination of the
 * "Все материалы автора" button on every article.
 *
 * Laid out on the index-page grid (960 content + 300 rail inside the 1280
 * container), not the article page's narrower 800 + 300.
 *
 * Below the profile header the design runs two blocks: "Популярные статьи" as
 * the main page's 633 + 307 lead layout, then "Все статьи" as a plain three-up
 * grid of 307px cards. Both keep the card's "date, time · author" byline.
 *
 * The hero above them follows the design screenshot rather than the Figma node
 * itself - see the note on `AuthorHero` for what that leaves estimated.
 */
export default async function AuthorPage({ params }: AuthorParams) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const repo = getNewsRepository();

  const author = await repo.getAuthor(locale, slug);
  if (!author) notFound();

  const [popular, articles] = await Promise.all([
    repo.getPopularByAuthor(locale, slug, POPULAR_LIMIT),
    repo.getByAuthor(locale, slug, FEED_LIMIT),
  ]);

  const [popularLead, ...popularRest] = popular;

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
            20px between the content column and the rail, not the 82px section
            rhythm: the design is 960 + 20 + 300 = 1280 exactly, and a section
            gap here steals 62px from the content column, shrinking every
            `md` card from its designed 307px to 245px. The section gap is
            still right on mobile, where the rail stacks underneath.
          */}
          <div className="flex flex-col gap-section lg:grid lg:grid-rail lg:items-start lg:gap-gutter">
            <div className="flex min-w-0 flex-col gap-section">
              <AuthorHero author={author} locale={locale} dict={dict.author} />

              {/*
                Needs the full lead + two shape to be itself; with fewer than
                three stories the author only gets "Все статьи".
              */}
              {popularLead && popularRest.length === 2 ? (
                <section className="flex flex-col gap-head">
                  <SectionHead title={dict.author.popularTitle} />
                  <LeadBlock
                    lead={popularLead}
                    secondary={popularRest}
                    locale={locale}
                    secondaryCategory={false}
                  />
                </section>
              ) : null}

              <section className="flex flex-col gap-head">
                <SectionHead title={dict.author.allTitle} />

                {articles.length > 0 ? (
                  <ArticleFeed
                    articles={articles}
                    locale={locale}
                    initial={FEED_INITIAL}
                    moreLabel={dict.sections.showMore}
                  />
                ) : (
                  <p className="text-body text-ink-600 lg:text-lead">
                    {dict.author.empty}
                  </p>
                )}
              </section>
            </div>

            {/* Mobile has no side rail in this design, only the leaderboard. */}
            <aside className="hidden min-w-0 lg:block">
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
