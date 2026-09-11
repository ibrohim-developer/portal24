import type { Metadata } from "next";
import { notFound } from "next/navigation";

// import { NumberOfDay } from "@/components/home/number-of-day";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AdsSlot } from "@/components/ui/ads-slot";
import { ArticleFeed } from "@/components/ui/article-feed";
import { Container } from "@/components/ui/container";
import { LeadBlock } from "@/components/ui/lead-block";
import { getNewsRepository, type ContentSource } from "@/lib/news/repository";
import { strings } from "@/lib/strings";

const FEED_LIMIT = 24;
const GRID_INITIAL = 9;

export const revalidate = 300;

export const dynamicParams = true;

async function resolveCategory(
  slug: string,
): Promise<{ source: ContentSource; name: string } | null> {
  const match = (await getNewsRepository("api").getCategories()).find(
    (candidate) => candidate.slug === slug,
  );

  return match ? { source: "api", name: match.name } : null;
}

export async function generateStaticParams() {
  const categories = await getNewsRepository("api").getCategories();
  return categories.map(({ slug }) => ({ category: slug }));
}

type CategoryParams = { params: Promise<{ category: string }> };

export async function generateMetadata({
  params,
}: CategoryParams): Promise<Metadata> {
  const { category } = await params;
  const resolved = await resolveCategory(category);
  if (!resolved) notFound();

  const name = resolved.name;
  const description = strings.category.description.replace("{category}", name);

  return {
    title: name,
    description,
    alternates: { canonical: `/${category}/` },
    openGraph: { type: "website", title: name, description },
  };
}

export default async function CategoryPage({ params }: CategoryParams) {
  const { category } = await params;
  const resolved = await resolveCategory(category);
  if (!resolved) notFound();

  const repo = getNewsRepository(resolved.source);

  const [
    articles,
    // Hidden until the backend serves it - see "Kun raqami" below.
    // statOfDay,
  ] = await Promise.all([
    repo.getByCategory(category, FEED_LIMIT),
    // repo.getStatOfTheDay(),
  ]);

  const [lead, ...rest] = articles;
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
          <div className="flex flex-col gap-head">
            <h1 className="text-title-sm font-medium text-ink-900 lg:text-title-lg">
              #{resolved.name}
            </h1>
            <div className="flex flex-col lg:grid lg:grid-rail lg:items-start lg:gap-gutter">
              <div className="flex min-w-0 flex-col gap-section">
                {lead ? (
                  <>
                    <LeadBlock lead={lead} secondary={secondary} />

                    {/*
                      "Kun raqami" is hidden until the backend has an endpoint
                      for it; the API repository still serves fixtures here.
                    {statOfDay ? (
                      <NumberOfDay
                        stat={statOfDay}
                        label={strings.sections.numberOfDay}
                      />
                    ) : null}
                    */}

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
