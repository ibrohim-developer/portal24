import { BadgePanel } from "@/components/ui/badge-panel";
import type { Stat } from "@/lib/news/types";

export function NumberOfDay({ stat, label }: { stat: Stat; label: string }) {
  return (
    <BadgePanel
      label={label}
      offset="pt-[18px]"
      labelClassName="text-title-sm"
      className="px-6 pb-13 pt-20 lg:px-13"
    >
      <p className="text-[48px] font-medium uppercase leading-[60px] text-white lg:text-display">
        {stat.value}
      </p>
      <p className="mx-auto mt-2 max-w-2xl text-body text-ink-400 lg:text-title-sm">
        {stat.description}
      </p>
    </BadgePanel>
  );
}
