import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { isLocale, locales, localeHrefLang, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/get-dictionary";
import { portalFont } from "@/lib/fonts";
import "../globals.css";

/** Prerender exactly these three locales... */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/** ...and 404 anything else, instead of trying to render /fr at runtime. */
export const dynamicParams = false;

type LocaleParams = { params: Promise<{ locale: string }> };

export async function generateMetadata({
  params,
}: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = await getDictionary(locale);

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://portal24.uz",
    ),
    title: {
      default: `${dict.site.name} - ${dict.site.tagline}`,
      template: `%s | ${dict.site.name}`,
    },
    description: dict.site.tagline,
    // Tells Google these three pages are translations of each other rather
    // than duplicate content competing with one another.
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(
        locales.map((l) => [localeHrefLang[l], `/${l}`]),
      ),
    },
    openGraph: {
      siteName: dict.site.name,
      locale: localeHrefLang[locale],
      type: "website",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleParams & { children: React.ReactNode }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html
      lang={localeHrefLang[locale as Locale]}
      className={`${portalFont.variable} h-full`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
