import Link from "next/link";

import { cn } from "@/lib/cn";
import { formatArticleDate } from "@/lib/format";
import type { Article, CategorySlug } from "@/lib/news/types";
import type { Locale } from "@/i18n/config";

/**
 * The category → background tint mapping from the Figma component set
 * (variant axis `Category` on 1677:10811). The category label itself is always
 * ink-600; only the block background changes.
 */
const CATEGORY_TINT: Record<CategorySlug, string> = {
  eco: "bg-cat-eco",
  sport: "bg-cat-sport",
  finance: "bg-cat-finance",
  tech: "bg-cat-tech",
  education: "bg-cat-education",
};

export type TextBlockSize = "lg" | "md";

/**
 * Headline + meta, matching the Figma TextBlock component set.
 *
 * The tint is full-bleed with no inset - the design deliberately runs text to
 * the block edge, which reads as a colour band in the 300px sidebar column.
 */
export function TextBlock({
  article,
  locale,
  size = "md",
  tinted = false,
}: {
  article: Article;
  locale: Locale;
  size?: TextBlockSize;
  tinted?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        tinted && CATEGORY_TINT[article.category.slug],
      )}
    >
      <span className="text-caption text-ink-600">
        #{article.category.name}
      </span>

      <h3
        className={cn(
          "font-medium text-ink-900",
          size === "lg" ? "text-title-sm" : "text-body",
        )}
      >
        <Link
          href={`/${locale}/news/${article.slug}/`}
          className="transition-colors hover:text-accent"
        >
          {article.title}
        </Link>
      </h3>

      <div className="flex items-center gap-2 overflow-hidden text-caption text-ink-400">
        <time dateTime={article.publishedAt} className="whitespace-nowrap">
          {formatArticleDate(article.publishedAt, locale)}
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
