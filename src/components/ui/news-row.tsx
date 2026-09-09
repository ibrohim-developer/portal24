import { Photo } from "./photo";
import { TextBlock } from "./text-block";
import { canOptimizeImage } from "@/lib/images";
import type { Article } from "@/lib/news/types";

export function NewsRow({ article }: { article: Article }) {
  return (
    <article className="group/card relative flex gap-3 border-b border-hairline pb-gutter">
      {article.coverImage ? (
        <div className="size-[150px] shrink-0 overflow-hidden">
          <Photo
            src={article.coverImage.url}
            alt=""
            width={article.coverImage.width}
            height={article.coverImage.height}
            sizes="150px"
            // Covers are all on the CMS host today, but one pasted from
            // elsewhere would throw rather than degrade - and on a feed that
            // takes the whole page with it. See `canOptimizeImage`.
            unoptimized={!canOptimizeImage(article.coverImage.url)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover/card:scale-[1.03]"
          />
        </div>
      ) : null}

      {/* min-w-0 so the meta line's `truncate` has something to truncate to. */}
      <div className="min-w-0 flex-1">
        <TextBlock article={article} size="md" titleWeight="normal" stretch />
      </div>
    </article>
  );
}
