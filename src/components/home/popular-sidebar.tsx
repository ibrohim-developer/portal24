import { TextBlock } from "@/components/ui/text-block";
import type { Article } from "@/lib/news/types";

/**
 * Sidebar feed where every card carries its category's background tint
 * (Figma 1852:13456). The Figma runs the text flush to the tint edge; `inset`
 * overrides that here because it reads as cramped in the 300px column.
 */
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
