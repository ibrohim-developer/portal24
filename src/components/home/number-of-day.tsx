import type { Stat } from "@/lib/news/types";

/**
 * "Цифра дня" - dark panel with a yellow badge straddling its top edge
 * (Figma 1852:13205). The number is uppercased by the design, not by the data.
 */
export function NumberOfDay({ stat, label }: { stat: Stat; label: string }) {
  return (
    <section className="relative pt-[18px]">
      <p className="absolute left-1/2 top-0 z-10 -translate-x-1/2 bg-highlight px-3 py-2 text-title-sm font-medium text-ink-900">
        {label}
      </p>

      <div className="bg-ink-900 px-6 pb-13 pt-20 text-center lg:px-13">
        <p className="text-[48px] font-medium uppercase leading-[60px] text-white lg:text-display">
          {stat.value}
        </p>
        <p className="mx-auto mt-2 max-w-2xl text-body text-ink-400 lg:text-title-sm">
          {stat.description}
        </p>
      </div>
    </section>
  );
}
