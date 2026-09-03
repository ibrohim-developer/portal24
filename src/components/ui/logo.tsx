import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/i18n/config";

/** Exported from the Figma nav (I2232:15466;1934:25004) as SVG. */
export function Logo({ locale, label }: { locale: Locale; label: string }) {
  return (
    <Link href={`/${locale}/`} aria-label={label} className="shrink-0">
      <Image
        src="/icons/logo.svg"
        alt={label}
        width={100}
        height={36}
        priority
      />
    </Link>
  );
}
