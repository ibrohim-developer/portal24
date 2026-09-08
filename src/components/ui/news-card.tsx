import Image from "next/image";

import { TextBlock, type TextBlockSize } from "./text-block";
import { cn } from "@/lib/cn";
import { canOptimizeImage } from "@/lib/images";
import type { Article } from "@/lib/news/types";

/**
 * Cover image + TextBlock, matching the Figma News component set (1852:14464).
 *
 * Image aspect differs by size: the lead card is 633x465, the smaller cards
 * beside it are 307x162 - a noticeably wider crop, not the same ratio scaled.
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
const IMAGE_ASPECT: Record<TextBlockSize, string> = {
  lg: "aspect-[633/465]",
  md: "aspect-[307/162]",
};

export function NewsCard({
  article,
  size = "md",
  priority = false,
  showCategory = true,
  highlight,
}: {
  article: Article;
  size?: TextBlockSize;
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
        <div className={cn("w-full overflow-hidden", IMAGE_ASPECT[size])}>
          <Image
            src={article.coverImage.url}
            alt=""
            width={article.coverImage.width}
            height={article.coverImage.height}
            priority={priority}
            sizes={size === "lg" ? "(max-width: 1023px) 100vw, 633px" : "(max-width: 1023px) 100vw, 307px"}
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
