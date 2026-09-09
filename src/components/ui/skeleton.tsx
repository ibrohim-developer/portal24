import { cn } from "@/lib/cn";

export function Bar({
  width,
  height,
  tone = "base",
  className,
}: {
  /** Any CSS length. The design mixes px (92, 168) with percentages. */
  width?: string | number;
  height?: string | number;
  /** `accent` is the blue-grey sweep, for a bar on the AttentionText tint. */
  tone?: "base" | "accent";
  className?: string;
}) {
  return (
    <div
      className={cn(
        tone === "accent" ? "skeleton-accent" : "skeleton",
        className,
      )}
      style={{ width, height }}
    />
  );
}

/**
 * A run of body lines, one bar each.
 *
 * The design expresses a paragraph as a list of line widths (`sc-for` over
 * `para1`..`para4`), the last one short so the block reads as prose rather
 * than as a slab - so this takes the same list.
 */
export function Lines({
  widths,
  className,
}: {
  widths: string[];
  className?: string;
}) {
  return (
    <div className={cn("flex w-full flex-col gap-[11px]", className)}>
      {widths.map((width, i) => (
        <Bar key={i} width={width} height={14} />
      ))}
    </div>
  );
}
