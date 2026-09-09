import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { SOCIAL, TELEGRAM_URL, TelegramIcon } from "@/components/ui/social";
import { footerNavItems } from "@/lib/categories";
import { getNewsRepository } from "@/lib/news/repository";
import { strings } from "@/lib/strings";

export async function SiteFooter() {
  const items = footerNavItems(await getNewsRepository("api").getCategories());

  return (
    <footer className="mt-section bg-ink-700 text-white">
      <Container className="py-5 lg:py-10">
        <TelegramCallout
          pitch={strings.footer.telegramPitch}
          cta={strings.footer.telegramCta}
        />

        <Logo
          label={strings.a11y.home}
          tone="light"
          className="h-9 lg:h-[50px]"
        />

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-4 lg:gap-8">
          <FooterColumn title={strings.footer.sectionsTitle}>
            {items.map((item) => (
              <Link
                key={item.key}
                href={`/${item.href}/`}
                className="text-body text-white transition-opacity hover:opacity-70"
              >
                #{item.label}
              </Link>
            ))}
          </FooterColumn>

          <FooterColumn title={strings.footer.editorialTitle}>
            <Link
              href="/about/"
              className="text-body text-white transition-opacity hover:opacity-70"
            >
              {strings.footer.aboutPublication}
            </Link>
            <Link
              href="/media-kit/"
              className="text-body text-white transition-opacity hover:opacity-70"
            >
              {strings.footer.mediaKit}
            </Link>
          </FooterColumn>

          <div className="lg:col-span-2">
            <FooterColumn title={strings.footer.socialTitle}>
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
          <p className="max-w-xl">{strings.footer.legal}</p>
          <p>
            {strings.footer.founder}
            <br />
            {strings.footer.editor}
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
