import Link from "next/link";

import { cn } from "@/lib/cn";
import { categoryTint } from "@/lib/categories";
import { formatArticleDate } from "@/lib/format";
import { highlightParts } from "@/lib/news/search";
import type { Article } from "@/lib/news/types";

export type TextBlockSize = "lg" | "md";

/**
 * Headline + meta, matching the Figma TextBlock component set.
 *
 * The Figma runs text flush to the tint edge on every instance. `inset` opts a
 * caller out of that - see its note.
 */
export function TextBlock({
  article,
  size = "md",
  titleWeight = "medium",
  tinted = false,
  inset = false,
  showCategory = true,
  stretch = false,
  highlight,
}: {
  article: Article;
  size?: TextBlockSize;
  /**
   * The thumbnail-row cards set their headline in regular weight; every card
   * that stacks its headline under a cover image uses medium.
   */
  titleWeight?: "medium" | "normal";
  tinted?: boolean;
  /**
   * Pads the tint away from the text. A deliberate departure from the Figma,
   * which runs text flush to the edge everywhere - at both the 300px sidebar
   * width and the 253px article-page column that reads as cramped. Set by the
   * home sidebar and by the article page's headline-only block.
   */
  inset?: boolean;
  /**
   * Off for the two small cards in the author page's "Популярные статьи"
   * block, which run image straight into headline. Everywhere else the label
   * is the first line of the block.
   */
  showCategory?: boolean;
  /**
   * Blows the headline's hit area up to fill the nearest positioned ancestor,
   * so a whole card is clickable rather than just its cover and headline. Set
   * by NewsCard and NewsRow, which mark themselves `relative` for it; leave it
   * off wherever the block is not the only link in its box.
   */
  stretch?: boolean;
  /**
   * A search query whose words are painted with the highlight yellow inside
   * the headline. Set by the search results grid; unset everywhere else.
   */
  highlight?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        tinted && categoryTint(article.category.slug),
        inset && "p-4",
      )}
    >
      {showCategory ? (
        <span className="text-caption text-ink-600">
          #{article.category.name}
        </span>
      ) : null}

      {/* `break-words` because a headline is arbitrary text: the narrowest
          card this block draws is ~118px wide on a 320px screen, and Russian
          has plenty of single words longer than that. Without it one of them
          reaches past the card instead of breaking. */}
      <h3
        className={cn(
          "text-ink-900 break-words",
          titleWeight === "normal" ? "font-normal" : "font-medium",
          size === "lg" ? "text-title-sm" : "text-body",
        )}
      >
        {/* `group-hover/card` so the headline reacts to the cover image being
            hovered too - see NewsCard. It is inert wherever this block is not
            inside one, which is every caller that passes `inset` or `tinted`.

            The `after` overlay is the whole-card hit area: an empty pseudo-
            element stretched over the card, which carries the link's own
            pointer cursor and click target to every pixel of it - the gaps and
            the date line included. It paints last within the card, so it stays
            above the cover even while the cover is mid-`scale` (a transform
            makes its own stacking context). */}
        <Link
          href={`/news/${article.slug}/`}
          className={cn(
            "transition-colors group-hover/card:text-accent hover:text-accent",
            stretch && "after:absolute after:inset-0 after:content-['']",
          )}
        >
          {highlight
            ? highlightParts(article.title, highlight).map((part, i) =>
                part.hit ? (
                  <mark key={i} className="bg-highlight text-ink-900">
                    {part.text}
                  </mark>
                ) : (
                  part.text
                ),
              )
            : article.title}
        </Link>
      </h3>

      <div className="flex items-center gap-2 overflow-hidden text-caption text-ink-400">
        <time dateTime={article.publishedAt} className="whitespace-nowrap">
          {formatArticleDate(article.publishedAt)}
        </time>
        {article.author ? (
          <>
            <span aria-hidden="true">·</span>
            <span className="truncate">{article.author.name}</span>
          </>
        ) : null}
      </div>
    </div>
  );
}
