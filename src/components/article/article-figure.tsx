import Image from "next/image";

import { cn } from "@/lib/cn";
import type { ArticleImage } from "@/lib/news/types";

/**
 * Photo plus the design's caption line (Figma 1872:11889): caption, separator
 * dot, credit - all ink-600 caption type, 16px under the image.
 *
 * The frame is a fixed crop, as it is on the cards: the design draws the hero
 * at 800x540 and the inline shot at 801x1000, and a CMS photo will not arrive
 * at either ratio. Leaving the ratio to the file does not work even in
 * principle - once the image loads, its own intrinsic ratio overrides the one
 * the width/height attributes imply, so the frame has to be stated in CSS.
 */
export function ArticleFigure({
  image,
  caption,
  credit,
  aspect,
  priority = false,
  sizes,
}: {
  image: ArticleImage;
  caption: string | null;
  credit: string | null;
  /** Aspect utilities for the crop, e.g. `aspect-[358/250] lg:aspect-[800/540]`. */
  aspect: string;
  /** Set on the hero only - it is the LCP element. */
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <figure className="flex flex-col gap-4">
      <Image
        src={image.url}
        alt={image.alt}
        width={image.width}
        height={image.height}
        priority={priority}
        sizes={sizes}
        className={cn("w-full object-cover", aspect)}
      />

      {caption || credit ? (
        <figcaption className="flex flex-wrap items-center gap-2 text-caption text-ink-600">
          {caption ? <span>{caption}</span> : null}
          {caption && credit ? <span aria-hidden="true">·</span> : null}
          {credit ? <span>{credit}</span> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
