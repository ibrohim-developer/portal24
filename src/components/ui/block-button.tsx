import Link from "next/link";

export function BlockButton({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex h-12 items-center justify-center bg-accent text-body text-white transition-opacity hover:opacity-90 lg:hidden"
    >
      {label}
    </Link>
  );
}
