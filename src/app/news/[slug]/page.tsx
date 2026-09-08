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
import { getNewsRepository } from "@/lib/news/repository";
import { spansToText, type ArticleDetail } from "@/lib/news/types";
import { strings } from "@/lib/strings";

/**
 * A published story changes rarely once filed - a correction, mostly - so this
 * lags the feeds deliberately.
 */
export const revalidate = 900;

/**
 * The archive is 1,373 stories and grows daily, so only the recent run is
 * prebuilt (see `getSlugs`) and anything older renders on its first request.
 * `getArticle` returns null for a slug the CMS does not have, which is still
 * a 404 - this opens the archive, not the door.
 */
export const dynamicParams = true;

/** The newest stories, so the common case is served without a render. */
export async function generateStaticParams() {
  const slugs = await getNewsRepository("api").getSlugs();
  return slugs.map((slug) => ({ slug }));
}

type ArticleParams = { params: Promise<{ slug: string }> };

/**
 * The 800 + 20 + 300 column pair, shared by the article and the feeds below it
 * so both stay on the same grid between 1024px and the 1120px cap.
 *
 * The ratio, and why it is a ratio rather than a fixed pair, live in
 * `grid-article`. The skeleton in loading.tsx is drawn on the same pair, so
 * the two cannot drift apart.
 */
const COLUMNS = "lg:grid lg:grid-article lg:gap-x-gutter";

/** First paragraph, trimmed to a length that search results will not cut. */
function summarise(article: ArticleDetail): string {
  const lede = article.body.find((b) => b.kind === "paragraph");
  if (!lede) return article.title;

  // Marks dropped: this is a meta description, which is plain text.
  const text = spansToText(lede.spans);
  return text.length > 160 ? `${text.slice(0, 157)}…` : text;
}

export async function generateMetadata({
  params,
}: ArticleParams): Promise<Metadata> {
  const { slug } = await params;

  const article = await getNewsRepository("api").getArticle(slug);
  if (!article) notFound();

  const description = summarise(article);

  return {
    title: article.title,
    description,
    alternates: { canonical: `/news/${slug}/` },
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
  const { slug } = await params;

  // The CMS for the story itself. The byline card and the figures around it
  // fall back to fixtures inside the repository, because the API carries
  // neither - see api-repository.
  const repo = getNewsRepository("api");

  const article = await repo.getArticle(slug);
  if (!article) notFound();

  const [related, sameCategory, popular] = await Promise.all([
    repo.getRelated(slug, 6),
    repo.getByCategory(article.category.slug, 3),
    repo.getPopular(6),
  ]);

  return (
    <>
      {/* Leaderboard above the nav, as on the main page (Figma 1852:18394). */}
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
                  updatedLabel={strings.article.updated}
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
                  label={strings.a11y.advertising}
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
                  label={strings.article.authorLabel}
                  cta={strings.article.authorCta}
                />
              ) : null}

              <RelatedBlock
                title={strings.article.readAlso}
                articles={related}
                layout="grid"
              />

              {/* Titled for the editor's daily pick rather than the article's category. */}
              <RelatedBlock
                title={strings.article.dailyPick}
                articles={sameCategory}
                layout="feature"
              />

              <RelatedBlock
                title={strings.sections.fresh}
                href="/popular/"
                seeAllLabel={strings.sections.seeAll}
                articles={popular}
                layout="text"
                moreLabel={strings.sections.showMore}
              />
              </div>
            </div>
          </div>
        </Container>
      </main>

      <SiteFooter />
    </>
  );
}
