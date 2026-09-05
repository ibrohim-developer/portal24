import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleBody } from "@/components/article/article-body";
import { ArticleFigure } from "@/components/article/article-figure";
import { ArticleHead } from "@/components/article/article-head";
import { AuthorBlock } from "@/components/article/author-block";
import { RelatedBlock } from "@/components/article/related-block";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AdsSlot } from "@/components/ui/ads-slot";
import { Container } from "@/components/ui/container";
import { isLocale, locales, localeHrefLang } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { getNewsRepository } from "@/lib/news/repository";
import type { ArticleDetail } from "@/lib/news/types";

/** Every article is built ahead of time, so an unknown slug is a 404, not a render. */
export const dynamicParams = false;

/**
 * The parent `[locale]` layout generates the three locales; this fills in the
 * slugs for each one, so it is called once per locale with that locale's
 * params. `params` here is a plain object - only page props are promises.
 */
export async function generateStaticParams({
  params: { locale },
}: {
  params: { locale: string };
}) {
  if (!isLocale(locale)) return [];

  const slugs = await getNewsRepository().getSlugs(locale);
  return slugs.map((slug) => ({ slug }));
}

type ArticleParams = { params: Promise<{ locale: string; slug: string }> };

/**
 * The 800 + 20 + 300 column pair, shared by the article and the feeds below it
 * so both stay on the same grid between 1024px and the 1120px cap.
 *
 * Ratios rather than a fixed rail, for the reason `grid-rail` gives about the
 * 960 + 20 + 300 the rest of the site is built on: neither column is at its
 * design width until the viewport reaches 1440, so the two have to give ground
 * together. This page is the narrower 1121 "Content" frame, hence its own pair.
 */
const COLUMNS =
  "lg:grid lg:grid-cols-[minmax(0,800fr)_minmax(0,300fr)] lg:gap-x-gutter";

/** First paragraph, trimmed to a length that search results will not cut. */
function summarise(article: ArticleDetail): string {
  const lede = article.body.find((b) => b.kind === "paragraph");
  if (!lede) return article.title;
  return lede.text.length > 160 ? `${lede.text.slice(0, 157)}…` : lede.text;
}

export async function generateMetadata({
  params,
}: ArticleParams): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const article = await getNewsRepository().getArticle(locale, slug);
  if (!article) notFound();

  const description = summarise(article);
  const path = `/${locale}/news/${slug}/`;

  return {
    title: article.title,
    description,
    alternates: {
      canonical: path,
      // The slug is locale-independent today because the fixtures share one
      // set of stories. Once the CMS gives each translation its own slug, this
      // has to resolve them per locale rather than reusing `slug`.
      languages: Object.fromEntries(
        locales.map((l) => [localeHrefLang[l], `/${l}/news/${slug}/`]),
      ),
    },
    openGraph: {
      type: "article",
      title: article.title,
      description,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt ?? undefined,
      authors: article.author ? [article.author.name] : undefined,
      images: article.coverImage ? [article.coverImage.url] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: ArticleParams) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);
  const repo = getNewsRepository();

  const article = await repo.getArticle(locale, slug);
  if (!article) notFound();

  const [related, sameCategory, popular] = await Promise.all([
    repo.getRelated(locale, slug, 6),
    repo.getByCategory(locale, article.category.slug, 3),
    repo.getPopular(locale, 6),
  ]);

  return (
    <>
      {/* Leaderboard above the nav, as on the main page (Figma 1852:18394). */}
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
            The article page is narrower than the main page: 800 + 20 + 300
            centred, which is the 1121px "Content" frame at x=159.5 in the
            1440 desktop frame, not the 1280 the header and footer use.
          */}
          <div className="mx-auto w-full max-w-280">
            {/*
              Two rows rather than two columns, because the design starts the ad
              level with the top of the hero image rather than the top of the
              page. Headline in row 1, hero and ad both in row 2, each opening
              with the same 28px the design puts under the headline - so the two
              line up off the headline's real height. The Figma's flat 192px
              offset only holds while the headline runs to exactly two lines.
            */}
            <article className={COLUMNS}>
              <div className="lg:col-start-1 lg:row-start-1">
                <ArticleHead
                  article={article}
                  locale={locale}
                  updatedLabel={dict.article.updated}
                />
              </div>

              <div className="mt-head flex min-w-0 flex-col gap-head lg:col-start-1 lg:row-start-2">
                {article.coverImage ? (
                  <ArticleFigure
                    image={article.coverImage}
                    caption={article.coverCaption}
                    credit={article.coverCredit}
                    // 358x250 mobile, 800x540 desktop.
                    aspect="aspect-[358/250] lg:aspect-[800/540]"
                    priority
                    sizes="(max-width: 1023px) 100vw, 800px"
                  />
                ) : null}

                <ArticleBody blocks={article.body} />
              </div>

              {/*
                Inside the article on purpose: an `aside` nested in an `article`
                is content tangential to that article, which is what an ad
                beside the story is. Mobile has no in-content ad.
              */}
              <aside className="mt-head hidden lg:col-start-2 lg:row-start-2 lg:block">
                <AdsSlot
                  width={300}
                  height={450}
                  label={dict.a11y.advertising}
                  className="w-full"
                />
              </aside>
            </article>

            {/* Outside the article - the byline card and the feeds are not part of it. */}
            <div className={`mt-10 ${COLUMNS}`}>
              <div className="flex min-w-0 flex-col gap-10 lg:col-start-1">
              {article.author ? (
                <AuthorBlock
                  author={article.author}
                  locale={locale}
                  label={dict.article.authorLabel}
                  cta={dict.article.authorCta}
                />
              ) : null}

              <RelatedBlock
                title={dict.article.readAlso}
                articles={related}
                locale={locale}
                layout="grid"
              />

              {/*
                Titled "Подборка дня" rather than the article's category: the
                block is an editor's daily pick, and the design sets this one
                head in regular weight where every other head is medium.
              */}
              <RelatedBlock
                title={dict.article.dailyPick}
                href={`/${locale}/${article.category.slug}/`}
                seeAllLabel={dict.sections.seeAll}
                articles={sameCategory}
                locale={locale}
                layout="feature"
                titleWeight="normal"
              />

              <RelatedBlock
                title={dict.sections.fresh}
                href={`/${locale}/popular/`}
                seeAllLabel={dict.sections.seeAll}
                articles={popular}
                locale={locale}
                layout="text"
                moreLabel={dict.sections.showMore}
              />
              </div>
            </div>
          </div>
        </Container>
      </main>

      <SiteFooter locale={locale} dict={dict} />
    </>
  );
}
