import { Photo } from "@/components/ui/photo";
import Link from "next/link";

import { ChevronRightIcon } from "@/components/ui/icons";
import type { AuthorProfile } from "@/lib/news/types";

/**
 * Byline card under the article (Figma 1878:12804 desktop / 1981:15620 mobile).
 *
 * Geometry is from the file: 16px panel padding, an 80px avatar, 16px to the
 * info column, then 4px between the label and the name and 12px before the
 * beats line. Desktop parks the 236x40 button at the right of the row; mobile
 * drops it to its own full-width line 16px below.
 *
 * The avatar is a circle and the beats are slash-separated - both read off the
 * design screenshot, which also settles the button: white panel, ink-900 text
 * pushed left, chevron pushed right. (An earlier pass guessed accent-blue text
 * because the Figma quota ran out before this node could be rendered.) The
 * button keeps its 236px design width as a *minimum* so the longer uz/en
 * strings grow it instead of wrapping.
 */
export function AuthorBlock({
  author,
  label,
  cta,
}: {
  author: AuthorProfile;
  label: string;
  cta: string;
}) {
  return (
    <aside className="bg-accent/8 p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex items-center gap-4">
          {author.avatar ? (
            <Photo
              src={author.avatar.url}
              alt=""
              width={80}
              height={80}
              className="h-20 w-20 shrink-0 rounded-full object-cover"
            />
          ) : null}

          <div className="flex min-w-0 flex-col">
            <span className="text-caption text-ink-600 lg:text-body">
              {label}
            </span>
            <span className="mt-1 text-lead font-medium text-ink-900 lg:text-title-sm">
              {author.name}
            </span>
            <span className="mt-3 truncate text-caption text-ink-600 lg:text-body">
              {author.categories.map((c) => `#${c.name}`).join(" / ")}
            </span>
          </div>
        </div>

        <Link
          href={`/authors/${author.slug}/`}
          className="flex h-10 items-center justify-between gap-4 bg-white px-4 text-body text-ink-900 transition-opacity hover:opacity-80 lg:ml-auto lg:min-w-59 lg:shrink-0"
        >
          {cta}
          <ChevronRightIcon />
        </Link>
      </div>
    </aside>
  );
}
