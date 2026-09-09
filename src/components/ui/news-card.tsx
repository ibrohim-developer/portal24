import { Photo } from "./photo";
import { TextBlock, type TextBlockSize } from "./text-block";
import { cn } from "@/lib/cn";
import { canOptimizeImage } from "@/lib/images";
import type { Article } from "@/lib/news/types";

export type CardColumn = "main" | "article";

const COVER_ASPECT: Record<TextBlockSize, Record<CardColumn, string>> = {
  lg: { main: "aspect-[633/465]", article: "aspect-[633/465]" },
  md: {
    main: "aspect-[307/162]",
    article: "aspect-[307/162] lg:aspect-[253/162]",
  },
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
        <div
          className={cn("w-full overflow-hidden", COVER_ASPECT[size][column])}
        >
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
