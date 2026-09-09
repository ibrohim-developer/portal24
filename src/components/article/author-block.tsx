import { Photo } from "@/components/ui/photo";
import Link from "next/link";

import { ChevronRightIcon } from "@/components/ui/icons";
import type { AuthorProfile } from "@/lib/news/types";

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
