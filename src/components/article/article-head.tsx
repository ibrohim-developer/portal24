import Link from "next/link";

import { formatArticleDate } from "@/lib/format";
import type { ArticleDetail } from "@/lib/news/types";

export function ArticleHead({
  article,
  updatedLabel,
}: {
  article: ArticleDetail;
  updatedLabel: string;
}) {
  const stamp = article.updatedAt ?? article.publishedAt;

  return (
    <header className="flex flex-col gap-gutter">
      <Link
        href={`/${article.category.slug}/`}
        className="w-fit text-caption text-ink-600 transition-colors hover:text-accent"
      >
        #{article.category.name}
      </Link>

      <h1 className="text-title-sm font-medium text-ink-900 lg:text-title-lg">
        {article.title}
      </h1>

      <div className="flex flex-wrap items-center gap-2 text-caption text-ink-600">
        <time dateTime={stamp}>
          {article.updatedAt ? `${updatedLabel} ` : ""}
          {formatArticleDate(stamp)}
        </time>
        {article.author ? (
          <>
            <span aria-hidden="true">·</span>
            <span>{article.author.name}</span>
          </>
        ) : null}
      </div>
    </header>
  );
}
