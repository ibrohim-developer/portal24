import { cn } from "@/lib/cn";

/**
 * Page gutter.
 *
 * The Figma page is 1440 wide with a 1280 content frame centred inside it, so
 * the 80px is an outer margin, not padding taken out of 1280. Applying it as
 * padding on a max-w-1280 box narrows the content to 1120 and breaks every
 * column width downstream.
 */
export function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("px-4 lg:px-20", className)}>
      <div className="mx-auto w-full max-w-page">{children}</div>
    </div>
  );
}
