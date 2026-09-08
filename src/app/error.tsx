"use client";

import { ErrorScreen } from "@/components/layout/error-screen";

/**
 * The route error boundary: everything under the root layout renders inside
 * it, so any page that throws lands here instead of on Next's default error
 * screen.
 *
 * One boundary at the root, not one per segment, because of how the pages are
 * built: each page draws its own SiteHeader and SiteFooter rather than
 * inheriting them from a layout, so a boundary nested at, say, news/[slug]
 * would replace the whole page anyway - the chrome sits inside the segment it
 * would be catching for. Splitting this up only becomes worth doing if the
 * chrome moves into a layout.
 *
 * What it does and does not catch:
 *
 *  - Caught: a render that throws at request time. On this site that is the
 *    CMS being unreachable or answering 500 (`api/client` throws on any
 *    non-2xx) while an uncached page renders - an older article reached
 *    through `dynamicParams`, or any page after a deploy but before its first
 *    hit. `retry()` re-runs that render, so a blip resolves in place.
 *  - Not caught: `next build`. A page prerendered at build time fails the
 *    build instead, which is what api/client intends.
 *  - Not caught: a failed ISR revalidation. Next keeps serving the last good
 *    page and logs the error, so readers never see this screen for one.
 *  - Not caught: an error thrown by app/layout.tsx itself - that is what
 *    global-error.tsx is for - or one thrown in an event handler.
 *
 * One thing to know before relying on this. When the throw happens during the
 * first server render of a request, React aborts the shell: the 500 response
 * carries an empty document, and this fallback is drawn by the browser once it
 * hydrates - checked against `next start`, not assumed. Every other page here
 * reads fine with JavaScript off; this one does not, and cannot, because the
 * markup never reaches the response. A reader who arrives with JS disabled on
 * a failing page gets a blank screen rather than this one.
 *
 * Errors are not reported anywhere from here: the server has already logged
 * the real one (this component only ever receives a redacted copy in
 * production), and there is no Sentry or equivalent wired up. If one lands,
 * report it in a `useEffect` on `error`, keyed by digest.
 */
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
