import { Inter } from "next/font/google";
import localFont from "next/font/local";

/*
 * The design's face: Neue Haas Grotesk Display Pro, in the two cuts it calls
 * for - "55 Roman" as 400 and "65 Medium" as 500. Both are preloaded: every
 * page is set in them.
 *
 * The weights below are what the @font-face carries, which is what matters:
 * the files' own OS/2 weight classes read 500 for Roman and 600 for Medium, a
 * step heavy each, so left to the file metadata `font-medium` would land on
 * the wrong cut.
 *
 * adjustFontFallback is off deliberately. Left on, Next slots a
 * metrics-adjusted Arial into this variable right behind the family, ahead of
 * the Inter below - and every Cyrillic headline would then come out of Arial.
 * Inter carries its own adjusted fallback, so the layout-shift guard is still
 * in the stack, one family further down.
 */
export const portalFont = localFont({
  variable: "--font-portal",
  display: "swap",
  adjustFontFallback: false,
  src: [
    {
      path: "../fonts/NeueHaasDisplayRoman.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/NeueHaasDisplayMedium.woff2",
      weight: "500",
      style: "normal",
    },
  ],
});

/*
 * "75 Bold", which only the error screen asks for.
 *
 * Its own family, not a third face on the one above, because next/font
 * preloads every file in a family: as a sibling of Roman and Medium it put a
 * 26KB <link rel=preload> on every page of the site to serve one heading a
 * reader may never see. Alone here with preload off it is declared but not
 * fetched until something is actually set in it.
 *
 * The cost of that split is that `font-bold` no longer reaches it - inside
 * --font-sans the browser matches 700 against this family's 500 and
 * synthesises the rest rather than moving on to the next family. The
 * `font-display-bold` utility in globals.css names it directly instead.
 */
export const portalBoldFont = localFont({
  variable: "--font-portal-bold",
  display: "swap",
  adjustFontFallback: false,
  preload: false,
  src: [
    {
      path: "../fonts/NeueHaasDisplayBold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
});

/*
 * The other half of the stack, for the glyphs Neue Haas does not have.
 *
 * These files are Latin only: not one character of Cyrillic, and - the part
 * that bites in Uzbek - no U+02BB/U+02BC, the turned commas that spell oʻ and
 * gʻ, and no №. The CMS still answers `lang: uz` with Cyrillic category names
 * (#Ўзбекистон), so both scripts reach the page.
 *
 * Font matching falls through per glyph, not per element: a Latin headline
 * renders in Neue Haas, a Cyrillic one in Inter, and an Uzbek word keeps Neue
 * Haas letters around an Inter apostrophe. Inter is the closest free
 * neo-grotesque, so the seam is as quiet as it gets without licensing the
 * Cyrillic cuts from Monotype.
 *
 * Not preloaded: it is fetched only when a page actually contains a glyph Neue
 * Haas is missing.
 */
export const fallbackFont = Inter({
  variable: "--font-portal-fallback",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  preload: false,
});
