import { cn } from "@/lib/cn";

export function BadgePanel({
  label,
  offset,
  labelClassName,
  className,
  children,
}: {
  label: string;
  offset: string;
  labelClassName?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("relative", offset)}>
      <p
        className={cn(
          "absolute left-1/2 top-0 z-10 -translate-x-1/2 bg-highlight px-3 py-2 font-medium text-ink-900",
          labelClassName,
        )}
      >
        {label}
      </p>

      <div className={cn("bg-ink-900 text-center", className)}>{children}</div>
    </section>
  );
}
