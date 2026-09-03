import Image from "next/image";

import { SectionHead } from "@/components/ui/section-head";
import type { Stat } from "@/lib/news/types";

/**
 * "Цифры последних дней" (Figma 1852:13409).
 *
 * The design shows prev/next buttons; this is a native horizontal scroller
 * instead, so it works without JavaScript and keeps keyboard and touch
 * scrolling for free. Arrow buttons can be layered on later if the newsroom
 * wants them.
 */
export function StatsRow({
  stats,
  title,
  href,
  seeAllLabel,
}: {
  stats: Stat[];
  title: string;
  href: string;
  seeAllLabel: string;
}) {
  if (stats.length === 0) return null;

  return (
    <section className="flex flex-col gap-head">
      <SectionHead title={title} href={href} linkLabel={seeAllLabel} />

      <ul className="-mx-4 flex snap-x snap-mandatory gap-gutter overflow-x-auto px-4 pb-2 lg:mx-0 lg:px-0">
        {stats.map((stat) => (
          <li
            key={stat.id}
            className="relative w-[306px] shrink-0 snap-start overflow-hidden bg-ink-900"
          >
            {stat.coverImage ? (
              <Image
                src={stat.coverImage.url}
                alt=""
                width={stat.coverImage.width}
                height={stat.coverImage.height}
                className="h-[500px] w-full object-cover opacity-60"
              />
            ) : (
              <div className="h-[500px] w-full" />
            )}

            <div className="absolute inset-x-0 bottom-0 bg-scrim p-5">
              <p className="text-title-lg font-medium text-white">
                {stat.value}
              </p>
              <p className="mt-2 text-caption text-white/80">
                {stat.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
