import { Photo } from "./photo";
import { TextBlock, type TextBlockSize } from "./text-block";
import { cn } from "@/lib/cn";
import { canOptimizeImage } from "@/lib/images";
import type { Article } from "@/lib/news/types";

/**
 * Cover image + TextBlock, matching the Figma News component set (1852:14464).
 *
 * Image aspect differs by size and by the column the card sits in - see
 * `COVER_ASPECT` below.
 *
 * The Figma's Hover variants are handled here as CSS `:hover` rather than as
 * separate components; they only change colour and image scale.
 *
 * The group is named `card` so the two halves hover together: the cover scales
 * and the headline turns accent from either one. Named because a plain `group`
 * would also match the ArticleFeed <details> that wraps a whole grid of these,
 * where hovering the "показать ещё" button would light up every card in it.
 *
 * The whole card is one hit area: `relative` here is what the headline link's
 * stretched overlay covers (see TextBlock's `stretch`), so every pixel of the
 * card - cover, gaps, date line - shows the pointer and opens the story. That
 * leaves a single link in the a11y tree per card, which is why the cover is a
 * plain <div> rather than the duplicate aria-hidden link it used to be.
 */
export type CardColumn = "main" | "article";

/*
 * The cover crop depends on the column the card sits in, not just its size:
 * the design fixes the cover's HEIGHT, so a narrower column crops squarer
 * rather than scaling the same ratio down. An md cover is 162px tall in both,
 * over 307px in the 960 content column and 253px in the article page's 800px
 * one (Figma "ReccomendationBlock").
 *
 * Only from `lg`: below it the article page is one column wide and its cards
 * are as wide as the home page's, so they share that crop.
 *
 * The lg pair is one ratio in both columns: the article page's 528px lead card
 * has no crop of its own in hand, so it scales 633x465 down until the design
 * says otherwise.
 */
const COVER_ASPECT: Record<TextBlockSize, Record<CardColumn, string>> = {
  lg: { main: "aspect-[633/465]", article: "aspect-[633/465]" },
  md: { main: "aspect-[307/162]", article: "aspect-[307/162] lg:aspect-[253/162]" },
};

/** Desktop width of the cover, for the `sizes` hint. */
const COVER_WIDTH: Record<TextBlockSize, Record<CardColumn, number>> = {
  lg: { main: 633, article: 528 },
  md: { main: 307, article: 253 },
};

export function NewsCard({
  article,
  size = "md",
  column = "main",
  priority = false,
  showCategory = true,
  highlight,
}: {
  article: Article;
  size?: TextBlockSize;
  /**
   * Which column the card is laid out in - see `COVER_ASPECT`. Set to
   * "article" by the article page's recommendation blocks; every other grid
   * sits in the 960 content column and keeps the default.
   */
  column?: CardColumn;
  /** Set on the lead story only - it is the LCP element. */
  priority?: boolean;
  /** Passed through to the TextBlock; see its note. */
  showCategory?: boolean;
  /** Passed through to the TextBlock; set by the search results grid. */
  highlight?: string;
}) {
  return (
    <article className="group/card relative flex flex-col gap-gutter">
      {article.coverImage ? (
        <div className={cn("w-full overflow-hidden", COVER_ASPECT[size][column])}>
          <Photo
            src={article.coverImage.url}
            alt=""
            width={article.coverImage.width}
            height={article.coverImage.height}
            priority={priority}
            sizes={`(max-width: 1023px) 100vw, ${COVER_WIDTH[size][column]}px`}
            // Covers are all on the CMS host today, but one pasted from
            // elsewhere would throw rather than degrade - and on a feed that
            // takes the whole page with it. See `canOptimizeImage`.
            unoptimized={!canOptimizeImage(article.coverImage.url)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover/card:scale-[1.03]"
          />
        </div>
      ) : null}

      <TextBlock
        article={article}
        size={size}
        showCategory={showCategory}
        highlight={highlight}
        stretch
      />
    </article>
  );
}
