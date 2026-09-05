import { NewsCard } from "@/components/ui/news-card";
import { NewsRow } from "@/components/ui/news-row";
import { SectionHead } from "@/components/ui/section-head";
import type { Article } from "@/lib/news/types";
import type { Locale } from "@/i18n/config";

/**
 * The three arrangements the main page's titled feeds come in.
 *
 *  - `featured`  one large story with two stacked beside it
 *  - `grid`      two rows of three equal cards
 *  - `rows`      two columns of three thumbnail rows
 *
 * Which one a block gets is not derivable from its position: see
 * HOME_CATEGORY_BLOCKS.
 */
export type FeedLayout = "featured" | "grid" | "rows";

/**
 * A titled feed with a "see all" link.
 *
 * Shared by the category blocks and by "#Популярное", which is not a category
 * at all - the component only ever sees a title and a href, so a cross-cutting
 * feed fits it exactly as well as a category does.
 */
export function FeedBlock({
  title,
  href,
  seeAllLabel,
  articles,
  locale,
  layout,
}: {
  title: string;
  href: string;
  seeAllLabel: string;
  articles: Article[];
  locale: Locale;
  layout: FeedLayout;
}) {
  if (articles.length === 0) return null;

  const [first, ...rest] = articles;

  return (
    <section className="flex flex-col gap-head">
      <SectionHead title={title} href={href} linkLabel={seeAllLabel} />

      {layout === "featured" ? (
        <div className="flex flex-col gap-gutter lg:grid lg:grid-lead lg:items-start">
          <div className="min-w-0">
            <NewsCard article={first} locale={locale} size="lg" />
          </div>
          <div className="grid min-w-0 gap-gutter sm:grid-cols-2 lg:grid-cols-1">
            {rest.slice(0, 2).map((article) => (
              <NewsCard key={article.id} article={article} locale={locale} />
            ))}
          </div>
        </div>
      ) : layout === "rows" ? (
        <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2">
          {articles.map((article) => (
            <NewsRow key={article.id} article={article} locale={locale} />
          ))}
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
