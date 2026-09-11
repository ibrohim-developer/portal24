import type { ArticleDetail } from "@/lib/news/types";
import { absoluteUrl } from "@/lib/site";
import { strings } from "@/lib/strings";

/**
 * `NewsArticle` structured data: the headline, publication time and cover
 * stated outright, so search engines read them instead of inferring them from
 * the markup.
 *
 * Two fields are shaped by what the CMS lacks. It exposes no byline, so a story
 * with no author is credited to the publication itself. And it keeps no
 * modification time, so `dateModified` is left out rather than guessed.
 */
export function ArticleJsonLd({ article }: { article: ArticleDetail }) {
  const publication = {
    "@type": "Organization",
    name: strings.site.name,
    url: absoluteUrl("/"),
  };

  const data = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: absoluteUrl(`/news/${article.slug}/`),
    headline: article.title.trim(),
    // `JSON.stringify` drops undefined, so an unknown value is simply absent.
    image: article.coverImage ? [article.coverImage.url] : undefined,
    datePublished: article.publishedAt || undefined,
    dateModified: article.updatedAt ?? undefined,
    author: article.author
      ? {
          "@type": "Person",
          name: article.author.name,
          url: absoluteUrl(`/authors/${article.author.slug}/`),
        }
      : publication,
    publisher: publication,
  };

  return (
    <script
      type="application/ld+json"
      // `<` escaped so a headline holding `</script>` cannot close the tag.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
