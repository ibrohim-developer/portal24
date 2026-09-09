import { cn } from "@/lib/cn";

export function AdsSlot({
  width,
  height,
  className,
  label,
}: {
  width: number;
  height: number;
  className?: string;
  label: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-hairline text-caption text-ink-400",
        className,
      )}
      style={{ height, maxWidth: width }}
      role="complementary"
      aria-label={label}
    >
      {label}
    </div>
  );
}
