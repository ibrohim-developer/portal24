"use client";

import Link from "next/link";

import { Container } from "@/components/ui/container";
import { TELEGRAM_URL } from "@/components/ui/social";
import { strings } from "@/lib/strings";

export function ErrorScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-1 flex-col justify-center py-section">
      <Container>
        <div className="mx-auto max-w-[600px]">
          <div
            aria-hidden="true"
            className="flex h-22 w-22 items-center justify-center border-2 border-highlight text-[68px] leading-none font-display-bold text-ink-900"
          >
            !
          </div>

          <h1 className="mt-6 text-title-lg leading-tight font-display-bold text-ink-900 lg:text-[60px] lg:leading-[70px]">
            {strings.error.title}
          </h1>

          <p className="mt-10 text-lead text-ink-600">{strings.error.text}</p>

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
