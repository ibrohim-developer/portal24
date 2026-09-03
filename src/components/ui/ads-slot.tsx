import { cn } from "@/lib/cn";

/**
 * Reserved advertising space.
 *
 * Rendered as a fixed-size empty block so the slot occupies its final height
 * from first paint - ad scripts that inject into a zero-height container are
 * the classic cause of a bad CLS score on news sites.
 */
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
      style={{ aspectRatio: `${width} / ${height}`, maxWidth: width }}
      role="complementary"
      aria-label={label}
    >
      {label}
    </div>
  );
}
