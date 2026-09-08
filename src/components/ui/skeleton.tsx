import { cn } from "@/lib/cn";

/**
 * One loading placeholder bar (Claude Design "News article skeleton").
 *
 * Width and height ride an inline style rather than Tailwind utilities,
 * because the design sizes most bars as a fraction of their column - "72%",
 * "41%", "38%" - and Tailwind's scanner cannot see a class name assembled at
 * runtime, so `w-[${width}]` would compile to nothing at all.
 *
 * The sweep itself is the `skeleton` utility in globals.css, which is also
 * where reduced motion turns it off.
 */
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
