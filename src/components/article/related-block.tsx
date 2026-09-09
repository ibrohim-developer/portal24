import { BlockButton } from "@/components/ui/block-button";
import { NewsCard } from "@/components/ui/news-card";
import { SectionHead } from "@/components/ui/section-head";
import { TextBlock } from "@/components/ui/text-block";
import type { Article } from "@/lib/news/types";

export function RelatedBlock({
  title,
  href,
  seeAllLabel,
  articles,
  layout,
  moreLabel,
}: {
  title: string;
  href?: string;
  seeAllLabel?: string;
  articles: Article[];
  layout: "grid" | "feature" | "text";
  moreLabel?: string;
}) {
  if (articles.length === 0) return null;

  const [first, ...rest] = articles;

  return (
    <section className="flex flex-col gap-head">
      <SectionHead title={title} href={href} linkLabel={seeAllLabel} />

      {layout === "feature" ? (
        <div className="flex flex-col gap-gutter lg:grid lg:grid-cols-[minmax(0,528fr)_minmax(0,252fr)] lg:items-start">
          <div className="min-w-0">
            <NewsCard article={first} size="lg" column="article" />
          </div>
          <div className="grid min-w-0 gap-gutter sm:grid-cols-2 lg:grid-cols-1">
            {rest.slice(0, 2).map((article) => (
              <NewsCard key={article.id} article={article} column="article" />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) =>
            layout === "text" ? (
              <TextBlock key={article.id} article={article} tinted inset />
            ) : (
              <NewsCard key={article.id} article={article} column="article" />
            ),
          )}
        </div>
      )}

      {layout === "text" && moreLabel && href ? (
        <BlockButton href={href} label={moreLabel} />
      ) : href && seeAllLabel ? (
        <BlockButton href={href} label={seeAllLabel} />
      ) : null}
    </section>
  );
}
