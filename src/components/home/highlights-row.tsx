import { Photo } from "@/components/ui/photo";
import Link from "next/link";

import { BleedCarousel } from "@/components/ui/bleed-carousel";
import type { Highlight } from "@/lib/news/types";

/** Card width + gutter, as in the numbers row. */
const STEP = 326;

export function HighlightsRow({
  highlights,
  title,
  prevLabel,
  nextLabel,
}: {
  highlights: Highlight[];
  title: string;
  prevLabel: string;
  nextLabel: string;
}) {
  if (highlights.length === 0) return null;

  return (
    <BleedCarousel
      title={title}
      prevLabel={prevLabel}
      nextLabel={nextLabel}
      step={STEP}
    >
      {highlights.map((highlight) => (
        <li
          key={highlight.id}
          className="group aspect-[9/16] w-[306px] shrink-0 snap-start overflow-hidden bg-hairline"
        >
          <HighlightMedia highlight={highlight} />
        </li>
      ))}
    </BleedCarousel>
  );
}

/**
 * The cover, wrapped in a link only once there is somewhere for it to go.
 * Until then it stays a plain image rather than a dead <a>.
 */
function HighlightMedia({ highlight }: { highlight: Highlight }) {
  if (!highlight.coverImage) return null;

  const image = (
    <Photo
      src={highlight.coverImage.url}
      alt={highlight.href ? "" : highlight.title}
      width={highlight.coverImage.width}
      height={highlight.coverImage.height}
      sizes="306px"
      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
    />
  );

  if (!highlight.href) return image;

  return (
    <Link href={highlight.href} className="block h-full w-full">
      <span className="sr-only">{highlight.title}</span>
      {image}
    </Link>
  );
}
