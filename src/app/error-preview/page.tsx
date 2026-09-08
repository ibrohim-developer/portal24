/*
 * TEMPORARY - delete this folder when you are done looking at the error page.
 *
 * A route that always throws, so the boundary in app/error.tsx can be opened
 * in a browser on purpose. Nothing links to it.
 */
export const dynamic = "force-dynamic";

export default async function ErrorPreview() {
  throw new Error("error boundary preview");
}
