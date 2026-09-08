"use client";

import Link from "next/link";

import { Container } from "@/components/ui/container";
import { TELEGRAM_URL } from "@/components/ui/social";
import { strings } from "@/lib/strings";

/**
 * What a reader sees when a render throws - shared by the route boundary
 * (app/error.tsx) and the root one (app/global-error.tsx) so the two cannot
 * drift apart.
 *
 * It deliberately does NOT draw SiteHeader or SiteFooter. Both are async
 * server components that ask the CMS for the category list, and a client
 * boundary cannot render either of them - but the more useful reason is that
 * the error being handled here is usually the CMS itself being unreachable,
 * so a header fetching from it would throw again inside the fallback, and a
 * fallback that throws escalates past this boundary to Next's own bare error
 * page. So the page carries no chrome at all - nothing here needs the API.
 *
 * The design is a single left-aligned column - warning mark, heading,
 * explanation, the two buttons, then a rule with the Telegram link under it -
 * centred on both axes as one block.
 *
 * Everything on it is set a step larger than the rest of the site: this is one
 * short column alone on the page rather than a block competing with a feed
 * beside it, and at the site's normal sizes it read as lost on a wide screen.
 * Sizes below that have no token are measured, not read from a Figma node.
 *
 * Nothing here identifies the error. `error.digest` - the hash that would let
 * a reader's report be matched against the server's own log line - was drawn
 * under the rule at one point and taken back out: this page is for the reader,
 * and the server has already logged the real error either way. If support ever
 * needs it back, it is one `<p>` and one prop.
 */
export function ErrorScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-1 flex-col justify-center py-section">
      <Container>
        {/*
          The measure the heading and paragraph wrap against, and the reason
          it is 600 rather than the 480 it started at: the heading grew, and
          this is the width that still breaks it after "nimadir" the way the
          design does. It matches the About page's prose column.

          Centred in the 1280 grid rather than run flush to its left edge, so
          the empty half of a wide screen sits on both sides of the block
          instead of all of it to the right. The text inside stays left
          aligned, as the design draws it - it is the block that moves, not
          the alignment.
        */}
        <div className="mx-auto max-w-[600px]">
          {/*
            The warning mark: a hairline-thin yellow square with the glyph
            knocked out of it, not a filled badge. `--color-highlight` is the
            same yellow the "Kun raqami" block and the see-all hover chip use,
            and this is the only place it carries a border rather than a fill.

            The border stays 2px as the box grows - thickening it with the box
            turns an outline into a frame.
          */}
          <div
            aria-hidden="true"
            className="flex h-22 w-22 items-center justify-center border-2 border-highlight text-[68px] leading-none font-display-bold text-ink-900"
          >
            !
          </div>

          {/*
            Larger and heavier than SectionHead's `title-lg`, which is the
            biggest heading token the design system has. Mobile keeps title-lg
            - 36px is already most of a 390 screen - and only the desktop step
            is set by hand.
          */}
          <h1 className="mt-6 text-title-lg leading-tight font-display-bold text-ink-900 lg:text-[60px] lg:leading-[70px]">
            {strings.error.title}
          </h1>

          <p className="mt-10 text-lead text-ink-600">{strings.error.text}</p>

          {/*
            The site's two button styles, one size up: accent fill for the
            primary (as the header Telegram CTA and BlockButton use) and the
            hairline grey for the secondary (as the About platform links use).
            Full width stacked on a phone, as every other button here is; the
            mockup only covers desktop.
          */}
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => onRetry()}
              className="flex h-14 items-center justify-center bg-accent px-8 text-body font-medium text-white transition-opacity hover:opacity-90"
            >
              {strings.error.retry}
            </button>

            <Link
              href="/"
              className="flex h-14 items-center justify-center bg-hairline px-8 text-body text-ink-900 transition-opacity hover:opacity-70"
            >
              {strings.error.home}
            </Link>
          </div>

          {/*
            `w-fit`, so the rule runs exactly as wide as the row under it
            rather than across the whole measure - which is what the design
            draws, and it keeps tracking if the copy changes.
          */}
          <div className="mt-12 w-fit border-t border-hairline pt-6">
            <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 text-body">
              <span className="text-ink-400">{strings.error.contactLead}</span>

              <a
                href={TELEGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-accent transition-opacity hover:opacity-70"
              >
                {strings.error.contactTelegram}
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
