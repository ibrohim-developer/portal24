import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/cn";

import type { Locale } from "@/i18n/config";

/**
 * Exported from the Figma nav (I2232:15466;1934:25004) as SVG.
 *
 * The mark is single-colour, so the footer's dark panel gets its own file with
 * the fill swapped to white rather than a CSS filter - `next/image` with
 * `unoptimized` serves the SVG as an <img>, which cannot be recoloured.
 */
export function Logo({
  locale,
  label,
  tone = "brand",
  className,
}: {
  locale: Locale;
  label: string;
  tone?: "brand" | "light";
  className?: string;
}) {
  return (
    <Link href={`/${locale}/`} aria-label={label} className="shrink-0">
      <Image
        src={tone === "light" ? "/icons/logo-white.svg" : "/icons/logo.svg"}
        alt={label}
        width={100}
        height={36}
        priority={tone === "brand"}
        className={cn("w-auto", className)}
      />
    </Link>
  );
}
