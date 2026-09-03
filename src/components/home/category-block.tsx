import { NewsCard } from "@/components/ui/news-card";
import { SectionHead } from "@/components/ui/section-head";
import type { Article } from "@/lib/news/types";
import type { Locale } from "@/i18n/config";

/**
 * A titled row of stories for one category (Figma 1852:13284 and siblings).
 *
 * `feature` renders the first story large with the rest beside it, matching the
 * Figma "BigNews" arrangement; without it every card is equal weight.
 */
export function CategoryBlock({
  title,
  href,
  seeAllLabel,
  articles,
  locale,
  feature = false,
}: {
  title: string;
  href: string;
  seeAllLabel: string;
  articles: Article[];
  locale: Locale;
  feature?: boolean;
}) {
  if (articles.length === 0) return null;

  const [first, ...rest] = articles;

  return (
    <section className="flex flex-col gap-head">
      <SectionHead title={title} href={href} linkLabel={seeAllLabel} />

      {feature ? (
        <div className="flex flex-col gap-gutter lg:flex-row">
          <div className="lg:w-[633px] lg:shrink-0">
            <NewsCard article={first} locale={locale} size="lg" />
          </div>
          <div className="grid flex-1 gap-gutter sm:grid-cols-2 lg:grid-cols-1">
            {rest.slice(0, 2).map((article) => (
              <NewsCard key={article.id} article={article} locale={locale} />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} locale={locale} />
          ))}
        </div>
      )}
    </section>
  );
}
