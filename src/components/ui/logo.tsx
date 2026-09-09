import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/cn";

export function Logo({
  label,
  tone = "brand",
  className,
}: {
  label: string;
  tone?: "brand" | "light";
  className?: string;
}) {
  return (
    <Link href="/" aria-label={label} className="shrink-0">
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
