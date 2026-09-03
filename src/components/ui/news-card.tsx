import Image from "next/image";
import Link from "next/link";

import { TextBlock, type TextBlockSize } from "./text-block";
import { cn } from "@/lib/cn";
import type { Article } from "@/lib/news/types";
import type { Locale } from "@/i18n/config";

/**
 * Cover image + TextBlock, matching the Figma News component set (1852:14464).
 *
 * Image aspect differs by size: the lead card is 633x465, the smaller cards
 * beside it are 307x162 - a noticeably wider crop, not the same ratio scaled.
 *
 * The Figma's Hover variants are handled here as CSS `:hover` rather than as
 * separate components; they only change colour and image scale.
 */
const IMAGE_ASPECT: Record<TextBlockSize, string> = {
  lg: "aspect-[633/465]",
  md: "aspect-[307/162]",
};

export function NewsCard({
  article,
  locale,
  size = "md",
  priority = false,
}: {
  article: Article;
  locale: Locale;
  size?: TextBlockSize;
  /** Set on the lead story only - it is the LCP element. */
  priority?: boolean;
}) {
  const href = `/${locale}/news/${article.slug}/`;

  return (
    <article className="group flex flex-col gap-gutter">
      {article.coverImage ? (
        <Link
          href={href}
          tabIndex={-1}
          aria-hidden="true"
          className={cn("block w-full overflow-hidden", IMAGE_ASPECT[size])}
        >
          <Image
            src={article.coverImage.url}
            alt=""
            width={article.coverImage.width}
            height={article.coverImage.height}
            priority={priority}
            sizes={size === "lg" ? "(max-width: 1023px) 100vw, 633px" : "(max-width: 1023px) 100vw, 307px"}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        </Link>
      ) : null}

      <TextBlock article={article} locale={locale} size={size} />
    </article>
  );
}
