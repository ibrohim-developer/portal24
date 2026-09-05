import Image from "next/image";

import { BleedCarousel } from "@/components/ui/bleed-carousel";
import { formatStatDate } from "@/lib/format";
import type { Stat } from "@/lib/news/types";
import type { Locale } from "@/i18n/config";

/**
 * "Цифры последних дней" (Figma 1852:13409).
 *
 * Cards are 306x500 with the photo full-bleed - no scrim, no dark panel - and
 * a white info card inset 16px from the top corners (274x121). That panel has
 * no padding of its own: number, copy and date run edge to edge and the line
 * boxes do all the spacing, which is why the gaps below are exactly 12px.
 *
 * The SectionHead "see all" link is hidden in this block (Link node is `hidden`
 * in the Figma); the carousel's prev/next pair takes its place. Everything
 * about the row itself - the full-bleed track, the arrows, the clipping - lives
 * in BleedCarousel; this file is only the cards.
 */

/** Card width + gutter. */
const STEP = 326;

export function StatsRow({
  stats,
  title,
  locale,
  prevLabel,
  nextLabel,
}: {
  stats: Stat[];
  title: string;
  locale: Locale;
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
            <Image
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
              {formatStatDate(stat.publishedAt, locale)}
            </time>
          </div>
        </li>
      ))}
    </BleedCarousel>
  );
}
