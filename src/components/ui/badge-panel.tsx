import { cn } from "@/lib/cn";

/**
 * Dark panel with a yellow label straddling its top edge.
 *
 * The design uses this shape twice with different type and different amounts
 * of overlap: "Цифра дня" on the main page (1852:13205) and "Наша цель" on the
 * About Us page (2196:16388). Only the geometry lives here - the callers own
 * their own type scale, padding and how far the label bites into the panel.
 *
 * `offset` is the gap between the top of the box and the top of the panel, so
 * the label overhang is `label height - offset`.
 */
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
