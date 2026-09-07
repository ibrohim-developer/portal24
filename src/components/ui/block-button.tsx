import Link from "next/link";

/**
 * The full-width accent button that closes a block on mobile.
 *
 * Two labels use it: "Смотреть все", which is the phone's form of the head's
 * see-all link (the two never show at once - the link starts at `lg` and this
 * stops there), and the recommendation block's "Показать ещё". They are the
 * same button, so they share one, and neither can drift from the other.
 *
 * Figma 1981:15809 fills the "Показать ещё" one with hairline grey, not the
 * accent; the blue is a later call from the designer, applied to both.
 *
 * Sized like the header's Telegram CTA and the author/category "показать ещё"
 * (48px, 16/24, white on accent), the only other filled buttons in the design.
 */
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
