import Link from "next/link";

/**
 * Section heading with an optional "see all" link, from the Figma SectionHead
 * component (title 36/45, link 16/24, 8px gap).
 */
export function SectionHead({
  title,
  href,
  linkLabel,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
      <h2 className="min-w-0 text-title-sm font-medium text-ink-900 lg:text-title-lg">
        {title}
      </h2>

      {href && linkLabel ? (
        <Link
          href={href}
          className="flex items-center gap-1 whitespace-nowrap rounded-full py-1 text-body text-ink-600 transition-colors hover:text-accent"
        >
          {linkLabel}
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className="shrink-0"
          >
            <path
              d="M6 3.5 10.5 8 6 12.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      ) : null}
    </div>
  );
}
