import { TextBlock } from "@/components/ui/text-block";
import type { Article } from "@/lib/news/types";

export function PopularSidebar({
  articles,
  title,
}: {
  articles: Article[];
  title: string;
}) {
  return (
    <section className="flex flex-col gap-head">
      <h2 className="text-title-sm font-medium text-ink-900 lg:text-title-lg">
        {title}
      </h2>

      <div className="flex flex-col gap-gutter">
        {articles.map((article) => (
          <TextBlock
            key={article.id}
            article={article}
            size="md"
            tinted
            inset
          />
        ))}
      </div>
    </section>
  );
}
