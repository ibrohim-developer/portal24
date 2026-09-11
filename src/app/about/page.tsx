import type { Metadata } from "next";

import { ContactLinks } from "@/components/about/contact-links";
import { MediaKitPanel } from "@/components/about/media-kit-panel";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AdsSlot } from "@/components/ui/ads-slot";
import { Container } from "@/components/ui/container";
import { strings } from "@/lib/strings";

export const metadata: Metadata = {
  title: strings.nav.about,
  description: strings.about.intro,
  alternates: { canonical: "/about/" },
};

export default function AboutPage() {
  const about = strings.about;

  return (
    <>
      {/* Leaderboard sits above the nav, as on the main page. */}
      <Container bleed className="pb-gutter">
        <AdsSlot
          width={1280}
          height={200}
          label={strings.a11y.advertising}
          className="w-full"
        />
      </Container>

      <SiteHeader />

      <main className="flex-1 pt-head lg:pt-10">
        <Container>
          <div className="flex flex-col gap-gutter lg:grid lg:grid-rail lg:items-start">
            {/*
             * Two tracks inside the content column: the text at 635 and the
             * media kit at 305, the same pair the lead block uses. Below `lg`
             * the media kit drops under the whole text column, after the
             * registration certificate, a section's distance down.
             */}
            <div className="flex min-w-0 flex-col gap-section lg:grid lg:grid-cols-[minmax(0,635fr)_minmax(0,305fr)] lg:items-start lg:gap-x-gutter">
              <div className="flex flex-col gap-10 lg:gap-15">
                <div className="flex flex-col gap-8 lg:gap-10">
                  <section className="flex flex-col gap-4 lg:gap-5">
                    <h1 className="text-title-sm font-medium text-ink-900 lg:text-title-lg">
                      {about.title}
                    </h1>
                    <p className="text-body text-ink-600 lg:text-lead">
                      {about.intro}
                    </p>
                  </section>

                  <ContactLinks />
                </div>

                <div className="flex flex-col gap-10 lg:gap-18">
                  <div className="flex flex-col gap-6 lg:gap-10">
                    <MastheadLine
                      label={about.editorLabel}
                      name={about.editorName}
                    />
                    <MastheadLine
                      label={about.founderLabel}
                      name={about.founderName}
                    />
                  </div>

                  <section className="flex flex-col gap-4 lg:gap-5">
                    <h2 className="text-title-sm font-medium text-ink-900 lg:text-title-lg">
                      {about.legalTitle}
                    </h2>
                    <p className="text-body text-ink-600 lg:text-lead">
                      {about.legalText}
                    </p>
                  </section>
                </div>
              </div>

              <MediaKitPanel
                title={about.mediaKit.title}
                items={about.mediaKit.items}
                downloadLabel={about.mediaKit.download}
              />
            </div>

            <aside className="hidden min-w-0 lg:block">
              <AdsSlot
                width={300}
                height={450}
                label={strings.a11y.advertising}
                className="w-full"
              />
            </aside>
          </div>
        </Container>
      </main>

      <SiteFooter />
    </>
  );
}

/** "Bosh muharrir:" over the name it labels - the page's masthead pair. */
function MastheadLine({ label, name }: { label: string; name: string }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-body text-ink-600 lg:text-lead">{label}</h2>
      <p className="text-title-sm font-medium text-ink-900 lg:text-title-lg">
        {name}
      </p>
    </section>
  );
}
