import { BlockButton } from "@/components/ui/block-button";
import { NewsCard } from "@/components/ui/news-card";
import { SectionHead } from "@/components/ui/section-head";
import { TextBlock } from "@/components/ui/text-block";
import type { Article } from "@/lib/news/types";

/**
 * The three recommendation blocks that close the article page. All three are
 * one component in the Figma ("ReccomendationBlock" 1878:13021 / 1878:13032 /
 * 1886:17787), differing only in how the cards are arranged:
 *
 *  - `grid`    two rows of three 253px cards
 *  - `feature` one 528px card beside two 253px cards stacked
 *  - `text`    two rows of three headline-only TextBlocks, tinted and padded
 *
 * The widths are not the home page's 633/307 - this column is 800px wide, not
 * 960 - so `CategoryBlock` is not reused here despite the similar shape.
 *
 * Mobile collapses every arrangement to a single column, and the `text` block
 * grows a full-width "more" button that the desktop frame does not have
 * (Figma 1981:15809).
 */
export function RelatedBlock({
  title,
  href,
  seeAllLabel,
  articles,
  layout,
  moreLabel,
}: {
  title: string;
  href?: string;
  seeAllLabel?: string;
  articles: Article[];
  layout: "grid" | "feature" | "text";
  moreLabel?: string;
}) {
  if (articles.length === 0) return null;

  const [first, ...rest] = articles;

  return (
    <section className="flex flex-col gap-head">
      <SectionHead
        title={title}
        href={href}
        linkLabel={seeAllLabel}
      />

      {layout === "feature" ? (
        <div className="flex flex-col gap-gutter lg:grid lg:grid-cols-[minmax(0,528fr)_minmax(0,252fr)] lg:items-start">
          <div className="min-w-0">
            <NewsCard article={first} size="lg" column="article" />
          </div>
          <div className="grid min-w-0 gap-gutter sm:grid-cols-2 lg:grid-cols-1">
            {rest.slice(0, 2).map((article) => (
              <NewsCard
                key={article.id}
                article={article}
                column="article"
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) =>
            layout === "text" ? (
              <TextBlock
                key={article.id}
                article={article}
                tinted
                inset
              />
            ) : (
              <NewsCard
                key={article.id}
                article={article}
                column="article"
              />
            ),
          )}
        </div>
      )}

      {/* Mobile closes the block with a button, since the head's see-all
          link is desktop-only: the design gives the "text" layout its own
          "показать ещё", and the other two fall back to the see-all. Never
          both - a block with two full-width buttons under it reads as a
          mistake. */}
      {layout === "text" && moreLabel && href ? (
        <BlockButton href={href} label={moreLabel} />
      ) : href && seeAllLabel ? (
        <BlockButton href={href} label={seeAllLabel} />
      ) : null}
    </section>
  );
}
