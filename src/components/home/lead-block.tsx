import { NewsCard } from "@/components/ui/news-card";
import type { Article } from "@/lib/news/types";
import type { Locale } from "@/i18n/config";

/**
 * Top of the page: one large lead story (633px) beside a 307px column of
 * smaller cards. Figma 1852:15048 / SoMainNewsBlock 1852:13468.
 */
export function LeadBlock({
  lead,
  secondary,
  locale,
}: {
  lead: Article;
  secondary: Article[];
  locale: Locale;
}) {
  return (
    <section className="flex flex-col gap-gutter lg:flex-row">
      <div className="lg:w-[633px] lg:shrink-0">
        <NewsCard article={lead} locale={locale} size="lg" priority />
      </div>

      <div className="grid flex-1 gap-gutter sm:grid-cols-2 lg:grid-cols-1">
        {secondary.slice(0, 2).map((article) => (
          <NewsCard key={article.id} article={article} locale={locale} />
        ))}
      </div>
    </section>
  );
}
