import { cn } from "@/lib/cn";

/**
 * Page gutter.
 *
 * The Figma page is 1440 wide with a 1280 content frame centred inside it, so
 * the 80px is an outer margin, not padding taken out of 1280. Applying it as
 * padding on a max-w-1280 box narrows the content to 1120 and breaks every
 * column width downstream.
 *
 * `bleed` drops the 16px mobile gutter so the child runs edge to edge on a
 * phone while keeping the 80px desktop margin. The advertising leaderboard is
 * the only thing that does this - the mobile frames run the creative to both
 * screen edges and inset everything else.
 */
export function Container({
  children,
  className,
  bleed = false,
}: {
  children: React.ReactNode;
  className?: string;
  /** See the note above - advertising only. */
  bleed?: boolean;
}) {
  return (
    <div className={cn(bleed ? "lg:px-20" : "px-4 lg:px-20", className)}>
      <div className="mx-auto w-full max-w-page">{children}</div>
    </div>
  );
}
