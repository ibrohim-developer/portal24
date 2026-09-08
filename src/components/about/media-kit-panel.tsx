import { cn } from "@/lib/cn";

/**
 * The dark "Медиакит" panel (Figma 2196:16353 desktop / 2218:17325 mobile).
 *
 * Desktop hangs it beside the intro column at 305px and mobile drops it to the
 * bottom of the page at full width; both draw the same three bands - title,
 * the list of what the kit contains, and the download button - pushed apart by
 * `justify-between`, so the panel fills whatever height its column has.
 *
 * The design fixes the desktop panel at 675px, matching the intro column next
 * to it; stretching to the row instead keeps the two aligned once the copy is
 * translated into uz and en, which the fixed height would clip.
 *
 * The download button is inert on purpose: there is no media kit file to serve
 * yet, so it keeps the design's affordance without navigating anywhere.
 */
export function MediaKitPanel({
  title,
  items,
  downloadLabel,
  className,
}: {
  title: string;
  items: readonly { title: string; text: string }[];
  downloadLabel: string;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "flex flex-col justify-between gap-7 bg-ink-900 p-4 lg:gap-10",
        className,
      )}
    >
      <h2 className="text-title-lg font-medium text-white">{title}</h2>

      <dl className="flex flex-col gap-5">
        {items.map((item) => (
          <div key={item.title} className="flex flex-col gap-1">
            <dt className="text-body font-medium text-white">{item.title}</dt>
            <dd className="text-caption text-ink-400">{item.text}</dd>
          </div>
        ))}
      </dl>

      <button
        type="button"
        className="flex cursor-pointer items-center justify-center gap-2 bg-highlight px-6 py-3 text-body text-ink-900 transition-opacity hover:opacity-90"
      >
        <DownloadIcon />
        {downloadLabel}
      </button>
    </section>
  );
}

/** Icon=Download, 24px, from the Figma icon set (2218:17359). */
function DownloadIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M19 20V22H5V20H19ZM11 2H13V14.5859L17 10.5859L18.4141 12L12.707 17.707C12.3165 18.0976 11.6835 18.0976 11.293 17.707L5.58594 12L7 10.5859L11 14.5859V2Z"
        fill="currentColor"
      />
    </svg>
  );
}
