import Link from "next/link";
import type { ReactNode } from "react";

import { ChevronRightIcon } from "@/components/ui/icons";

export function SectionHead({
  title,
  href,
  linkLabel,
  actions,
}: {
  title: string;
  href?: string;
  linkLabel?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
      {/*
        The Figma's `Heading/L` token reads "weight 400", but that 400 is
        the Roman number inside the Medium cut of Neue Haas Grotesk ("Pro 6"),
        which is why every head is `font-medium` against the Inter placeholder.
      */}
      <h2 className="min-w-0 text-title-sm font-medium text-ink-900 lg:text-title-lg">
        {title}
      </h2>

      {actions ? (
        // Rendered bare: the caller owns the wrapper, so a group it hides
        // on some breakpoint leaves nothing behind here to take up a line of
        // its own when the head wraps.
        actions
      ) : href && linkLabel ? (
        // Desktop only: on mobile the same destination is a full-width
        // button under the block (SeeAllButton), so the head keeps just the
        // title there.
        //
        // The hover fill's own box is the thing that lines up with the
        // container edge the cards below share, so the horizontal padding sits
        // inside it and insets the label. Only the vertical padding is pulled
        // back, to keep the chip from growing the row past the title line.
        <Link
          href={href}
          className="-my-2 hidden items-center gap-1 whitespace-nowrap px-2.5 py-2 text-body text-ink-600 transition-colors hover:bg-highlight hover:text-ink-900 lg:flex"
        >
          {linkLabel}
          <ChevronRightIcon />
        </Link>
      ) : null}
    </div>
  );
}
