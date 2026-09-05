import Link from "next/link";

import { formatArticleDate } from "@/lib/format";
import type { ArticleDetail } from "@/lib/news/types";
import type { Locale } from "@/i18n/config";

/**
 * Category, headline, byline (Figma HeadNewsText 1852:19335). 20px between
 * all three; the headline drops from 36/45 to 24/32 on mobile.
 *
 * The byline is ink-600 here, not the ink-400 that the card TextBlock uses -
 * sampled from the file, not carried over from the card.
 *
 * The design's stamp reads "Обновлено 30 минут назад". We keep the "Обновлено"
 * but print an absolute time, for the reason `formatArticleDate` documents:
 * under static export a relative string is frozen at build and drifts further
 * from the truth every hour.
 */
export function ArticleHead({
  article,
  locale,
  updatedLabel,
}: {
  article: ArticleDetail;
  locale: Locale;
  updatedLabel: string;
}) {
  const stamp = article.updatedAt ?? article.publishedAt;

  return (
    <header className="flex flex-col gap-gutter">
      <Link
        href={`/${locale}/${article.category.slug}/`}
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
          {formatArticleDate(stamp, locale)}
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
