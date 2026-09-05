import { ArticleFigure } from "./article-figure";
import { AttentionText } from "./attention-text";
import { cn } from "@/lib/cn";
import type { ArticleBlock } from "@/lib/news/types";

/**
 * Vertical rhythm, read off the Figma frames rather than picked.
 *
 * The design groups blocks into nested "TextBlock" frames, but every gap it
 * produces falls out of four rules, so a flat list with a computed top margin
 * reproduces it without the nesting - and without the body needing to know
 * where one editorial group ends and the next begins.
 *
 * Desktop (1852:19332) / mobile (1981:14457):
 *  - 40px around a heading above it and around any image, both breakpoints
 *  - 28 / 20px between a heading and the text under it
 *  - 20 / 16px between everything else
 */
function gapBefore(block: ArticleBlock, previous: ArticleBlock): string {
  if (block.kind === "heading" || block.kind === "image") return "mt-10";
  if (previous.kind === "image") return "mt-10";
  if (previous.kind === "heading") return "mt-5 lg:mt-7";
  return "mt-4 lg:mt-5";
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
      return <p className="text-lead text-ink-900">{block.text}</p>;

    case "callout":
      return <AttentionText>{block.text}</AttentionText>;

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
