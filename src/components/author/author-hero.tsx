import { Photo } from "@/components/ui/photo";
import Link from "next/link";

import { SOCIAL_MARKS } from "@/components/ui/social";
import { cn } from "@/lib/cn";
import { categoryTint } from "@/lib/categories";
import { strings } from "@/lib/strings";
import type { AuthorProfile } from "@/lib/news/types";

export function AuthorHero({ author }: { author: AuthorProfile }) {
  const bio = author.bio?.split(/\n+/).filter(Boolean) ?? [];

  return (
    <header className="flex flex-col gap-6 lg:flex-row lg:gap-6">
      {author.avatar ? (
        <Photo
          src={author.avatar.url}
          alt=""
          width={author.avatar.width}
          height={author.avatar.height}
          sizes="(max-width: 1023px) 160px, 264px"
          className="h-40 w-40 shrink-0 object-cover lg:h-66 lg:w-66"
        />
      ) : null}

      <div className="flex min-w-0 flex-col">
        <p className="text-caption text-ink-600">
          {author.role ?? strings.author.label}
        </p>

        <h1 className="mt-2 text-title-sm font-medium text-ink-900 lg:text-title-lg">
          {author.name}
        </h1>

        {author.categories.length > 0 ? (
          <nav className="mt-4 flex flex-wrap gap-2">
            {author.categories.map((category) => (
              <Link
                key={category.slug}
                href={`/${category.slug}/`}
                className={cn(
                  "px-2 py-1 text-caption text-ink-600 transition-opacity hover:opacity-70",
                  categoryTint(category.slug),
                )}
              >
                #{category.name}
              </Link>
            ))}
          </nav>
        ) : null}

        {bio.length > 0 ? (
          <section className="mt-6">
            <h2 className="text-body font-medium text-ink-900 lg:text-lead">
              {strings.author.bioTitle}
            </h2>

            <div className="mt-2 text-body text-ink-900">
              {bio.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </div>
          </section>
        ) : null}

        {author.contacts.length > 0 ? (
          <section className="mt-7">
            <h2 className="text-body font-medium text-ink-900 lg:text-lead">
              {strings.author.contactsTitle}
            </h2>

            <ul className="mt-4 flex flex-wrap gap-4">
              {author.contacts.map((contact) => {
                const social = SOCIAL_MARKS[contact.network];

                return (
                  <li key={contact.network}>
                    <a
                      href={contact.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex items-center gap-2 bg-hairline px-4 py-3 text-body text-ink-900 transition-opacity hover:opacity-70"
                    >
                      <social.Icon size={24} />
                      {social.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>
        ) : null}
      </div>
    </header>
  );
}
