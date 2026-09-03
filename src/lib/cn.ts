/**
 * Joins class names, dropping falsy values.
 *
 * Deliberately not tailwind-merge: components here own their classes outright
 * rather than accepting arbitrary overrides, so there is nothing to de-conflict.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
