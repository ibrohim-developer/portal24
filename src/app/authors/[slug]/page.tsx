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
import { getNewsRepository } from "@/lib/news/repository";
import { strings } from "@/lib/strings";

export const dynamicParams = false;

const POPULAR_LIMIT = 3;
const FEED_INITIAL = 9;
const FEED_LIMIT = 24;

export async function generateStaticParams() {
  const slugs = await getNewsRepository().getAuthorSlugs();
  return slugs.map((slug) => ({ slug }));
}

type AuthorParams = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: AuthorParams): Promise<Metadata> {
  const { slug } = await params;

  const author = await getNewsRepository().getAuthor(slug);
  if (!author) notFound();

  const description = author.bio ?? author.role ?? author.name;

  return {
    title: author.name,
    description,
    alternates: { canonical: `/authors/${slug}/` },
    openGraph: {
      type: "profile",
      title: author.name,
      description,
      images: author.avatar ? [author.avatar.url] : undefined,
    },
  };
}

export default async function AuthorPage({ params }: AuthorParams) {
  const { slug } = await params;

  const repo = getNewsRepository();

  const author = await repo.getAuthor(slug);
  if (!author) notFound();

  const [popular, articles] = await Promise.all([
    repo.getPopularByAuthor(slug, POPULAR_LIMIT),
    repo.getByAuthor(slug, FEED_LIMIT),
  ]);

  const [popularLead, ...popularRest] = popular;

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
          <div className="flex flex-col gap-section lg:grid lg:grid-rail lg:items-start lg:gap-gutter">
            <div className="flex min-w-0 flex-col gap-section">
              <AuthorHero author={author} />

              {popularLead && popularRest.length === 2 ? (
                <section className="flex flex-col gap-head">
                  <SectionHead title={strings.author.popularTitle} />
                  <LeadBlock
                    lead={popularLead}
                    secondary={popularRest}
                    secondaryCategory={false}
                  />
                </section>
              ) : null}

              <section className="flex flex-col gap-head">
                <SectionHead title={strings.author.allTitle} />

                {articles.length > 0 ? (
                  <ArticleFeed
                    articles={articles}
                    initial={FEED_INITIAL}
                    moreLabel={strings.sections.showMore}
                  />
                ) : (
                  <p className="text-body text-ink-600 lg:text-lead">
                    {strings.author.empty}
                  </p>
                )}
              </section>
            </div>

            {/* Mobile has no side rail in this design, only the leaderboard. */}
            <aside className="hidden min-w-0 lg:block">
              <AdsSlot
                width={300}
                height={450}
                label={strings.a11y.advertising}
                className="w-full"
              />
            </aside>
          </div>
        </Container>
      </main>

      <SiteFooter />
    </>
  );
}
