"use client";

import { ErrorScreen } from "@/components/layout/error-screen";
import { portalFont } from "@/lib/fonts";
import { strings } from "@/lib/strings";
import "./globals.css";

/**
 * The last boundary: it catches what app/error.tsx cannot, which is an error
 * thrown by the root layout itself, and it replaces that layout while it
 * shows. So it has to bring the whole document - <html>, <body>, the font
 * variable and the stylesheet - rather than inherit any of it.
 *
 * Root layout errors are rare here (it renders no data), so in practice this
 * is a backstop rather than a page readers will meet.
 *
 * The <title> is a React element rather than a `metadata` export: error
 * boundaries are client components, and metadata exports are not supported in
 * one.
 */
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
