import Image from "next/image";
import Link from "next/link";

import { SOCIAL_MARKS } from "@/components/ui/social";
import { cn } from "@/lib/cn";
import { categoryTint } from "@/lib/categories";
import { strings } from "@/lib/strings";
import type { AuthorProfile } from "@/lib/news/types";

/**
 * Profile header on the author page (Figma 1981:17549).
 *
 * Built from the design screenshot the editor supplied, which replaced an
 * earlier pass inferred from the article page's AuthorBlock. What the shot
 * settles: no tinted panel behind the header - it sits on the page's white,
 * unlike the AuthorBlock's `surface/transparent/brand/8%` card; a square
 * avatar rather than the AuthorBlock's circle; the beats drawn as tinted chips
 * in their category colours instead of a plain "#Спорт / #Экология" line; and
 * two labelled sections under the name, "О себе" and "Контакты для связи".
 *
 * Still measured off pixels rather than read from the file: the 264px avatar
 * and the 24px column gap (the shot is ~818px of a 960 column, so both are
 * scaled estimates), every vertical gap in the text column, and the whole
 * mobile arrangement - the screenshot is desktop only, so mobile keeps the
 * design's usual pattern of stacking and stepping the type down one size.
 *
 * The name is the page's `h1`: unlike the AuthorBlock, whose "Материал
 * подготовил" label says why the card is there, the line above the name here
 * is the author's own role, falling back to a plain "Автор" when the CMS has
 * none.
 */
export function AuthorHero({ author }: { author: AuthorProfile }) {
  // Blank lines in the CMS field are paragraph breaks. The design runs them
  // tight against each other, with no more space than a wrapped line gets.
  const bio = author.bio?.split(/\n+/).filter(Boolean) ?? [];

  return (
    <header className="flex flex-col gap-6 lg:flex-row lg:gap-6">
      {author.avatar ? (
        <Image
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
          // Linked, unlike the AuthorBlock's plain text line: on a page about
          // the author their beats are the natural way back into the feeds.
          // Each chip carries its category's TextBlock tint, so the row reads
          // as the same colour language the cards below it use.
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

            {/*
              Same chip as the About Us "Платформы и языки" buttons - hairline
              fill, 24px mark, brand label - but sized to their content rather
              than sharing the row, because an author has one or two of them
              and not the publication's full four.
            */}
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
