import { cn } from "@/lib/cn";

/**
 * Reserved advertising space.
 *
 * Rendered as a fixed-size empty block so the slot occupies its final height
 * from first paint - ad scripts that inject into a zero-height container are
 * the classic cause of a bad CLS score on news sites.
 *
 * `height` is reserved literally at every viewport width; only the width
 * collapses on a narrow screen. Deriving the height from a width/height ratio
 * instead would shrink the 1280x200 leaderboard to 61px on a phone, which is
 * not what the mobile frame shows and not a box any 200px creative fits.
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
      style={{ height, maxWidth: width }}
      role="complementary"
      aria-label={label}
    >
      {label}
    </div>
  );
}
