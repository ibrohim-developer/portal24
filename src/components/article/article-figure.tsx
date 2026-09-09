import { Photo } from "@/components/ui/photo";
import { cn } from "@/lib/cn";
import { canOptimizeImage } from "@/lib/images";
import type { ArticleImage } from "@/lib/news/types";

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
      <Photo
        src={image.url}
        alt={image.alt}
        width={image.width}
        height={image.height}
        priority={priority}
        sizes={sizes}
        unoptimized={!canOptimizeImage(image.url)}
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
