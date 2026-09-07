import { NewsCard } from "@/components/ui/news-card";
import type { Article } from "@/lib/news/types";

/**
 * A three-up grid of cards with a "Показать ещё" button under it.
 *
 * Shared by the author page's "Все статьи" block and by the category pages,
 * which run the same grid under their number-of-the-day panel.
 *
 * A native <details> rather than a client component with state. Two reasons:
 * every card is then in the static HTML, so a crawler sees the author's whole
 * body of work rather than the first nine; and the reveal costs no JS, which
 * is the same trade the BleedCarousel arrows make. The summary hides itself
 * once open, so the disclosure only ever runs one way, as "показать ещё"
 * implies - there is no second click that folds the grid back up.
 *
 * The 20px gap between the two grids is the parent's, so the revealed cards
 * land exactly one gutter below the last row and the seam is invisible.
 *
 * Once the admin API can paginate, this becomes a real offset query and the
 * button becomes a link to page 2; the markup here does not survive that.
 */
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
          <summary
            className="mx-auto flex h-12 w-fit cursor-pointer list-none items-center justify-center bg-accent px-14 text-body text-white transition-opacity hover:opacity-90 group-open:hidden [&::-webkit-details-marker]:hidden"
          >
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
