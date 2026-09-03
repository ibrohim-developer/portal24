import { notFound } from "next/navigation";

import { LanguageSwitcher } from "@/components/language-switcher";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";

/**
 * Placeholder home page. This exists to prove the locale routing works end to
 * end - it gets replaced wholesale once the Figma design lands in design/.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return (
    <>
      <header className="border-b border-black/10 dark:border-white/15">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
          <span className="text-lg font-semibold tracking-tight">
            {dict.site.name}
          </span>
          <LanguageSwitcher current={locale} />
        </div>
        <div className="mx-auto max-w-5xl px-6 pb-3">
          <ul className="flex flex-wrap gap-4 text-sm text-foreground/70">
            {(["politics", "economy", "society", "sport", "world"] as const).map(
              (key) => (
                <li key={key}>{dict.nav[key]}</li>
              ),
            )}
          </ul>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">
          {dict.site.tagline}
        </h1>
        <p className="mt-3 text-foreground/60">
          {dict.common.latest} - {locale}
        </p>
      </main>

      <footer className="border-t border-black/10 px-6 py-6 text-sm text-foreground/60 dark:border-white/15">
        <div className="mx-auto max-w-5xl">
          {dict.site.name} - {dict.footer.rights}
        </div>
      </footer>
    </>
  );
}
