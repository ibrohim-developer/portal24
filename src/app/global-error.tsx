"use client";

import { ErrorScreen } from "@/components/layout/error-screen";
import { portalFont } from "@/lib/fonts";
import { strings } from "@/lib/strings";
import "./globals.css";

export default function GlobalError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <html lang="uz" className={`${portalFont.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <title>{`${strings.error.title} | ${strings.site.name}`}</title>
        <ErrorScreen onRetry={retry} />
      </body>
    </html>
  );
}
