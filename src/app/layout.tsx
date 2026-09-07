import type { Metadata } from "next";

import { portalFont } from "@/lib/fonts";
import { strings } from "@/lib/strings";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://portal24.uz",
  ),
  title: {
    default: `${strings.site.name} - ${strings.site.tagline}`,
    template: `%s | ${strings.site.name}`,
  },
  description: strings.site.tagline,
  alternates: { canonical: "/" },
  openGraph: {
    siteName: strings.site.name,
    locale: "uz_UZ",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" className={`${portalFont.variable} h-full`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
