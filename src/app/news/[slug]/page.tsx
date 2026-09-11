import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleBody } from "@/components/article/article-body";
import { ArticleFigure } from "@/components/article/article-figure";
import { ArticleHead } from "@/components/article/article-head";
import { ArticleJsonLd } from "@/components/article/article-json-ld";
import { AuthorBlock } from "@/components/article/author-block";
import { RelatedBlock } from "@/components/article/related-block";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AdsSlot } from "@/components/ui/ads-slot";
import { Container } from "@/components/ui/container";
import { getNewsRepository } from "@/lib/news/repository";
import { spansToText, type ArticleDetail } from "@/lib/news/types";
import { strings } from "@/lib/strings";

export const revalidate = 900;

export const dynamicParams = true;

/** The newest stories, so the common case is served without a render. */
export async function generateStaticParams() {
  const slugs = await getNewsRepository("api").getSlugs();
  return slugs.map((slug) => ({ slug }));
}

type ArticleParams = { params: Promise<{ slug: string }> };

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
      <ArticleJsonLd article={article} />

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
          <div className="mx-auto w-full max-w-280">
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
