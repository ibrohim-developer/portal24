import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { NAV_ITEMS } from "@/lib/categories";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

const SOCIAL = [
  { label: "Instagram", href: "https://instagram.com/portal24uz" },
  { label: "YouTube", href: "https://youtube.com/@portal24uz" },
  { label: "Facebook", href: "https://facebook.com/portal24uz" },
  { label: "LinkedIn", href: "https://linkedin.com/company/portal24uz" },
];

export function SiteFooter({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <footer className="mt-section border-t border-hairline">
      <Container className="py-16">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          <Logo locale={locale} label={dict.a11y.home} />

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-3 lg:gap-20">
            <FooterColumn title={dict.footer.sectionsTitle}>
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.key}
                  href={`/${locale}/${item.href}/`}
                  className="text-body text-ink-600 transition-colors hover:text-accent"
                >
                  #{dict.nav[item.key]}
                </Link>
              ))}
            </FooterColumn>

            <FooterColumn title={dict.footer.editorialTitle}>
              <Link
                href={`/${locale}/about/`}
                className="text-body text-ink-600 transition-colors hover:text-accent"
              >
                {dict.footer.aboutPublication}
              </Link>
              <Link
                href={`/${locale}/about/`}
                className="text-body text-ink-600 transition-colors hover:text-accent"
              >
                {dict.footer.mediaKit}
              </Link>
            </FooterColumn>

            <FooterColumn title={dict.footer.socialTitle}>
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-body text-ink-600 transition-colors hover:text-accent"
                >
                  {s.label}
                </a>
              ))}
            </FooterColumn>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-hairline pt-8 text-caption text-ink-400">
          <p className="max-w-3xl">{dict.footer.legal}</p>
          <p>{dict.footer.founder}</p>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-body font-medium text-ink-900">{title}</h2>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}
