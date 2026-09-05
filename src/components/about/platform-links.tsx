import { SOCIAL } from "@/components/ui/social";

/**
 * "Мы работаем на собственных цифровых площадках" - the four owned accounts as
 * buttons (Figma 2218:15363 desktop / 2218:17164 mobile).
 *
 * Same four marks as the footer, and the same desktop/mobile split: labelled
 * on desktop, icon-only once the row has to fit in 358px. The buttons share the
 * row evenly rather than sitting at the design's fixed 149px, which keeps them
 * flush with the column edge in every locale.
 *
 * The labels do not fit that 149px at the design's 24px side padding - the
 * widest of them ("Instagram") needs 156 - so the padding is 16 here, which
 * brings the floor to 140 and leaves the buttons drawn at 149 in the 635
 * column, exactly as the design has them. `auto-fit` then wraps the row to a
 * second line below roughly 1370px rather than letting it run past the column:
 * the column is a share of the viewport, not a fixed 635, at every width under
 * 1440.
 *
 * Mobile keeps the flat four-up row; `grid-cols-4` floors its tracks at 0, so
 * the icons still fit a 320px screen where four content-sized buttons would
 * not.
 */
export function PlatformLinks() {
  return (
    <ul className="grid grid-cols-4 gap-[13px] lg:grid-cols-[repeat(auto-fit,minmax(140px,1fr))]">
      {SOCIAL.map((social) => (
        <li key={social.label} className="min-w-0">
          <a
            href={social.href}
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center justify-center gap-2 overflow-hidden bg-hairline p-4 text-body text-ink-900 transition-opacity hover:opacity-70"
          >
            <social.Icon size={24} />
            <span className="hidden min-w-0 truncate lg:inline">
              {social.label}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
