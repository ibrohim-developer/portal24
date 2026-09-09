import { ArticleFigure } from "./article-figure";
import { AttentionText } from "./attention-text";
import { cn } from "@/lib/cn";
import type { ArticleBlock, InlineSpan } from "@/lib/news/types";

/** `<ol>` or `<ul>`, picked by the block rather than by two near-identical cases. */
function ListTag({
  ordered,
  className,
  children,
}: {
  ordered: boolean;
  className: string;
  children: React.ReactNode;
}) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className={cn(className, ordered ? "list-decimal" : "list-disc")}>
      {children}
    </Tag>
  );
}


function gapBefore(block: ArticleBlock, previous: ArticleBlock): string {
  if (block.kind === "heading" || block.kind === "image") return "mt-10";
  if (previous.kind === "image") return "mt-10";
  if (previous.kind === "heading") return "mt-5 lg:mt-7";
  return "mt-4 lg:mt-5";
}

function Spans({ spans }: { spans: InlineSpan[] }) {
  return (
    <>
      {spans.map((span, i) => {
        if (span.kind === "link") {
          const external = span.href.startsWith("http");
          return (
            <a
              key={i}
              href={span.href}
              // Editorial links point off-site; `noreferrer` goes with the new
              // tab, and `nofollow` is what the CMS's own editor writes.
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer nofollow" }
                : {})}
              className="underline underline-offset-2 transition-colors hover:text-accent"
            >
              {span.text}
            </a>
          );
        }

        if (span.kind === "emphasis") {
          return (
            <strong key={i} className="font-medium">
              {span.text}
            </strong>
          );
        }

        return <span key={i}>{span.text}</span>;
      })}
    </>
  );
}

export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div>
      {blocks.map((block, i) => (
        <div
          key={i}
          className={cn(i > 0 && gapBefore(block, blocks[i - 1]))}
        >
          <Block block={block} />
        </div>
      ))}
    </div>
  );
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.kind) {
    case "heading":
      return (
        <h2 className="text-title-sm font-medium text-ink-900 lg:text-title-lg">
          {block.text}
        </h2>
      );

    case "paragraph":
      return (
        <p className="text-lead text-ink-900">
          <Spans spans={block.spans} />
        </p>
      );

    case "callout":
      return <AttentionText>{block.text}</AttentionText>;

    case "list":
      // `list-outside` with the padding on the element, so a wrapped second
      // line aligns with the first rather than sliding under the marker.
      return (
        <ListTag
          ordered={block.ordered}
          className="list-outside space-y-2 pl-6 text-lead text-ink-900"
        >
          {block.items.map((item, i) => (
            <li key={i}>
              <Spans spans={item} />
            </li>
          ))}
        </ListTag>
      );

    case "image":
      return (
        <ArticleFigure
          image={block.image}
          caption={block.caption}
          credit={block.credit}
          // 358x450 mobile, 801x1000 desktop - a portrait crop, unlike the hero.
          aspect="aspect-[358/450] lg:aspect-[801/1000]"
          sizes="(max-width: 1023px) 100vw, 800px"
        />
      );
  }
}
