import { Photo } from "@/components/ui/photo";
import { BleedCarousel } from "@/components/ui/bleed-carousel";
import { formatStatDate } from "@/lib/format";
import type { Stat } from "@/lib/news/types";

/** Card width + gutter. */
const STEP = 326;

export function StatsRow({
  stats,
  title,
  prevLabel,
  nextLabel,
}: {
  stats: Stat[];
  title: string;
  prevLabel: string;
  nextLabel: string;
}) {
  if (stats.length === 0) return null;

  return (
    <BleedCarousel
      title={title}
      prevLabel={prevLabel}
      nextLabel={nextLabel}
      step={STEP}
    >
      {stats.map((stat) => (
        <li
          key={stat.id}
          className="relative h-[500px] w-[306px] shrink-0 snap-start overflow-hidden bg-hairline"
        >
          {stat.coverImage ? (
            <Photo
              src={stat.coverImage.url}
              alt=""
              width={stat.coverImage.width}
              height={stat.coverImage.height}
              sizes="306px"
              className="h-full w-full object-cover"
            />
          ) : null}

          <div className="absolute inset-x-4 top-4 bg-white text-center">
            <p className="text-title-sm font-medium text-ink-900">
              {stat.value}
            </p>
            <p className="mt-3 text-body text-ink-900">{stat.description}</p>
            <time
              dateTime={stat.publishedAt}
              className="mt-3 block text-caption text-ink-600"
            >
              {formatStatDate(stat.publishedAt)}
            </time>
          </div>
        </li>
      ))}
    </BleedCarousel>
  );
}
