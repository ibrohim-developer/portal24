import { NewsCard } from "@/components/ui/news-card";
import type { Article } from "@/lib/news/types";

export function LeadBlock({
  lead,
  secondary,
  secondaryCategory = true,
}: {
  lead: Article;
  secondary: Article[];
  /** See the note above - false only on the author page. */
  secondaryCategory?: boolean;
}) {
  return (
    <section className="flex flex-col gap-gutter lg:grid lg:grid-lead lg:items-start">
      <div className="min-w-0">
        <NewsCard article={lead} size="lg" priority />
      </div>

      <div className="grid min-w-0 gap-gutter sm:grid-cols-2 lg:grid-cols-1">
        {secondary.slice(0, 2).map((article) => (
          <NewsCard
            key={article.id}
            article={article}
            showCategory={secondaryCategory}
          />
        ))}
      </div>
    </section>
  );
}
