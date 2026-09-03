import { Inter } from "next/font/google";

/*
 * The design specifies Neue Haas Grotesk Display Pro (cuts "Pro 5" / Roman and
 * "Pro 6" / Medium). That is a licensed Monotype face and cannot be fetched
 * from a CDN, so until the .woff2 files land in src/fonts/ this is Inter -
 * the closest free neo-grotesque, and one with full Cyrillic coverage.
 *
 * To swap in the real font, replace the export below with:
 *
 *   import localFont from "next/font/local";
 *
 *   export const portalFont = localFont({
 *     variable: "--font-portal",
 *     display: "swap",
 *     src: [
 *       { path: "../fonts/NeueHaasDisplayRoman.woff2", weight: "400", style: "normal" },
 *       { path: "../fonts/NeueHaasDisplayMedium.woff2", weight: "500", style: "normal" },
 *     ],
 *   });
 *
 * Nothing else changes: everything downstream reads --font-portal.
 */
export const portalFont = Inter({
  variable: "--font-portal",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
});
