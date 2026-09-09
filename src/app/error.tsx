"use client";

import { ErrorScreen } from "@/components/layout/error-screen";

export default function RouteError({
  retry,
}: {
  /** Next still passes this; nothing on the page draws it - see ErrorScreen. */
  error: Error & { digest?: string };
  /**
   * Next 16.3 renamed this from `reset`, which now means something narrower -
   * clear the error without re-fetching. `retry` is the one that can recover a
   * server render.
   */
  retry: () => void;
}) {
  return <ErrorScreen onRetry={retry} />;
}
