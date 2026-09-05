import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { SOCIAL, TELEGRAM_URL, TelegramIcon } from "@/components/ui/social";
import { FOOTER_NAV_ITEMS } from "@/lib/categories";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/get-dictionary";

/**
 * Footer from the Figma "Футер" page (111:247).
 *
 * The design draws two frames of one component: "Десктоп версия" and
 * "Мобильная версия". They differ in three ways, all handled here by
 * breakpoint rather than by shipping two trees:
 *
 *  - the Telegram call-out is mobile-only (desktop carries that CTA in the
 *    header instead, so this one switches on `nav` with the header rather
 *    than on `lg` with the columns),
 *  - social links are icon + label chips on desktop, icon-only tiles on mobile,
 *  - the columns stack.
 *
 * Where the two frames disagree on copy the desktop frame wins: its legal block
 * carries the real registration details, while the mobile frame still has
 * "[ООО Название] | [ФИО]" placeholders in the same slot.
 *
 * The panel is ink-700 (#394e63) straight from the file; every surface on top
 * of it - call-out box, social chips, the divider - is plain white at low
 * opacity, which is how the design builds them.
 */
export function SiteFooter({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <footer className="mt-section bg-ink-700 text-white">
      <Container className="py-5 lg:py-10">
        <TelegramCallout
          pitch={dict.footer.telegramPitch}
          cta={dict.footer.telegramCta}
        />

        <Logo
          locale={locale}
          label={dict.a11y.home}
          tone="light"
          className="h-9 lg:h-[50px]"
        />

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-4 lg:gap-8">
          <FooterColumn title={dict.footer.sectionsTitle}>
            {FOOTER_NAV_ITEMS.map((item) => (
              <Link
                key={item.key}
                href={`/${locale}/${item.href}/`}
                className="text-body text-white transition-opacity hover:opacity-70"
              >
                #{dict.nav[item.key]}
              </Link>
            ))}
          </FooterColumn>

          <FooterColumn title={dict.footer.editorialTitle}>
            <Link
              href={`/${locale}/about/`}
              className="text-body text-white transition-opacity hover:opacity-70"
            >
              {dict.footer.aboutPublication}
            </Link>
            <Link
              href={`/${locale}/media-kit/`}
              className="text-body text-white transition-opacity hover:opacity-70"
            >
              {dict.footer.mediaKit}
            </Link>
          </FooterColumn>

          <div className="lg:col-span-2">
            <FooterColumn title={dict.footer.socialTitle}>
              {/* The labelled chips need ~604px and the two columns they sit
                  in only give them that from 1440 up, so they wrap below it
                  rather than run off the page. Icon-only on mobile, where
                  `flex-1` splits the row four ways and they always fit. */}
              <ul className="flex gap-3 lg:flex-wrap lg:gap-4">
                {SOCIAL.map((social) => (
                  <li key={social.label} className="flex-1 lg:flex-none">
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="flex h-12 items-center justify-center gap-2 bg-white/5 text-body text-white transition-colors hover:bg-white/10 lg:justify-start lg:px-5"
                    >
                      <social.Icon />
                      <span className="hidden lg:inline">{social.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </FooterColumn>
          </div>
        </div>

        <div className="mt-8 space-y-5 border-t border-white/10 pt-10 text-caption leading-6 text-ink-400">
          <p className="max-w-xl">{dict.footer.legal}</p>
          <p>
            {dict.footer.founder}
            <br />
            {dict.footer.editor}
          </p>
        </div>
      </Container>
    </footer>
  );
}

/**
 * Mobile-only in the design: on desktop the same CTA sits in the header, so
 * rendering it here too would put two Telegram buttons on one screen.
 */
function TelegramCallout({ pitch, cta }: { pitch: string; cta: string }) {
  return (
    <div className="mb-8 bg-white/5 p-5 nav:hidden">
      <p className="text-body text-white">{pitch}</p>
      <a
        href={TELEGRAM_URL}
        target="_blank"
        rel="noreferrer noopener"
        className="mt-5 flex h-11 items-center justify-center gap-2 bg-highlight text-body text-ink-900 transition-opacity hover:opacity-90"
      >
        <TelegramIcon />
        {cta}
      </a>
    </div>
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
    <div>
      <h2 className="text-body text-ink-400">{title}</h2>
      <div className="mt-6 flex flex-col gap-5">{children}</div>
    </div>
  );
}

