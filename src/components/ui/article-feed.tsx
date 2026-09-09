import { NewsCard } from "@/components/ui/news-card";
import type { Article } from "@/lib/news/types";

export function ArticleFeed({
  articles,
  initial,
  moreLabel,
}: {
  articles: Article[];
  /** Cards shown before the button is pressed. */
  initial: number;
  moreLabel: string;
}) {
  const shown = articles.slice(0, initial);
  const rest = articles.slice(initial);

  const grid = "grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className="flex flex-col gap-gutter">
      <div className={grid}>
        {shown.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>

      {rest.length > 0 ? (
        <details className="group">
          <summary className="mx-auto flex h-12 w-fit cursor-pointer list-none items-center justify-center bg-accent px-14 text-body text-white transition-opacity hover:opacity-90 group-open:hidden [&::-webkit-details-marker]:hidden">
            {moreLabel}
          </summary>

          <div className={grid}>
            {rest.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </details>
      ) : null}
    </div>
  );
}
