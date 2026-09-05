import { NewsCard } from "@/components/ui/news-card";
import type { Article } from "@/lib/news/types";
import type { Locale } from "@/i18n/config";

/**
 * One large lead story beside a column of two smaller cards, 633 to 307 -
 * see `grid-lead`, which holds that ratio rather than the two pixel widths.
 * Figma 1852:15048 / SoMainNewsBlock 1852:13468.
 *
 * Shared: it opens the main page, and it is the "Популярные статьи" block on
 * the author page. The author page drops the category label from the two small
 * cards, which is the only difference between the two instances.
 */
export function LeadBlock({
  lead,
  secondary,
  locale,
  secondaryCategory = true,
}: {
  lead: Article;
  secondary: Article[];
  locale: Locale;
  /** See the note above - false only on the author page. */
  secondaryCategory?: boolean;
}) {
  return (
    <section className="flex flex-col gap-gutter lg:grid lg:grid-lead lg:items-start">
      <div className="min-w-0">
        <NewsCard article={lead} locale={locale} size="lg" priority />
      </div>

      <div className="grid min-w-0 gap-gutter sm:grid-cols-2 lg:grid-cols-1">
        {secondary.slice(0, 2).map((article) => (
          <NewsCard
            key={article.id}
            article={article}
            locale={locale}
            showCategory={secondaryCategory}
          />
        ))}
      </div>
    </section>
  );
}
