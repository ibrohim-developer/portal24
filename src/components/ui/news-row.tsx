import Image from "next/image";
import Link from "next/link";

import { TextBlock } from "./text-block";
import type { Article } from "@/lib/news/types";

/**
 * Thumbnail beside the headline rather than above it - the arrangement the main
 * page's "#Популярное" block uses, where six stories tile two columns of three.
 *
 * The thumbnail is a 150 square and the headline is 16/400 - both given
 * directly, so they are not guesses. The rule under each row still is: it was
 * read off the design export, because the Figma MCP tool-call quota was spent
 * before this block was built.
 */
export function NewsRow({
  article,
}: {
  article: Article;
}) {
  const href = `/news/${article.slug}/`;

  return (
    <article className="group/card flex gap-3 border-b border-hairline pb-gutter">
      {article.coverImage ? (
        <Link
          href={href}
          tabIndex={-1}
          aria-hidden="true"
          className="block size-[150px] shrink-0 overflow-hidden"
        >
          <Image
            src={article.coverImage.url}
            alt=""
            width={article.coverImage.width}
            height={article.coverImage.height}
            sizes="150px"
            className="h-full w-full object-cover transition-transform duration-300 group-hover/card:scale-[1.03]"
          />
        </Link>
      ) : null}

      {/* min-w-0 so the meta line's `truncate` has something to truncate to. */}
      <div className="min-w-0 flex-1">
        <TextBlock
          article={article}
          size="md"
          titleWeight="normal"
        />
      </div>
    </article>
  );
}
