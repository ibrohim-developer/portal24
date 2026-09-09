import { cn } from "@/lib/cn";

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
