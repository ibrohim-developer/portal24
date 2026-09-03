import { TextBlock } from "@/components/ui/text-block";
import type { Article } from "@/lib/news/types";
import type { Locale } from "@/i18n/config";

/**
 * Sidebar feed where every card carries its category's background tint
 * (Figma 1852:13456). Tints are full-bleed with no inset - that is the design.
 */
export function PopularSidebar({
  articles,
  locale,
  title,
}: {
  articles: Article[];
  locale: Locale;
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
            locale={locale}
            size="md"
            tinted
          />
        ))}
      </div>
    </section>
  );
}
