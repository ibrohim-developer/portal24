import { SOCIAL } from "@/components/ui/social";

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
