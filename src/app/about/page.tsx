import type { Metadata } from "next";

import { FocusGrid } from "@/components/about/focus-grid";
import { MediaKitPanel } from "@/components/about/media-kit-panel";
import { PlatformLinks } from "@/components/about/platform-links";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AdsSlot } from "@/components/ui/ads-slot";
import { BadgePanel } from "@/components/ui/badge-panel";
import { Container } from "@/components/ui/container";
import { strings } from "@/lib/strings";

export const metadata: Metadata = {
  title: strings.nav.about,
  description: strings.about.title,
  alternates: { canonical: "/about/" },
};

/**
 * About Us (Figma "Web" page, section 2196:16803 - Desktop 2196:16341 and
 * Mobile 2218:16614).
 *
 * The two frames hold the same six blocks in different orders: desktop hangs
 * the media kit beside the intro column and runs the rest full width beneath
 * it, mobile stacks everything and drops the media kit to the bottom. One tree
 * covers both - a flex column on mobile with the panel ordered last, switching
 * to a two-track grid at lg where source order is the layout order again.
 */
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
            <div className="flex min-w-0 flex-col gap-head lg:grid lg:grid-cols-[minmax(0,635fr)_minmax(0,305fr)] lg:gap-x-gutter lg:gap-y-section">
              <div className="flex flex-col gap-head lg:gap-10">
                <section className="flex flex-col gap-5">
                  <div className="flex flex-col gap-3">
                    <h1 className="text-title-sm font-medium text-ink-900 lg:text-title-lg">
                      {about.title}
                    </h1>
                    <p className="text-body text-ink-600 lg:text-lead">
                      {about.focusIntro}
                    </p>
                  </div>

                  <FocusGrid labels={about.focus} />

                  <p className="text-body text-ink-600 lg:text-lead">
                    {about.coverage}
                  </p>
                </section>

                <section className="flex flex-col gap-5">
                  <div className="flex flex-col gap-3">
                    <h2 className="text-title-sm font-medium text-ink-900 lg:text-title-lg">
                      {about.platformsTitle}
                    </h2>
                    <p className="text-body text-ink-600 lg:text-lead">
                      {about.platformsText}
                    </p>
                  </div>

                  <PlatformLinks />
                </section>
              </div>

              <MediaKitPanel
                className="order-1 lg:order-none"
                title={about.mediaKit.title}
                items={about.mediaKit.items}
                downloadLabel={about.mediaKit.download}
                href="/media-kit/"
              />

              {/* The only block that runs the full 960 of the content column. */}
              <div className="lg:col-span-2">
                <BadgePanel
                  label={about.goalLabel}
                  offset="pt-9 lg:pt-[11px]"
                  labelClassName="text-lead leading-[25px] lg:text-title-sm lg:leading-[30px]"
                  className="px-4 pb-10 pt-15 lg:px-13 lg:pb-13 lg:pt-20"
                >
                  <div className="flex flex-col gap-5 lg:gap-head">
                    <p className="text-[42px] font-medium leading-[50px] text-white lg:text-display">
                      {about.goalValue}
                    </p>
                    <p className="mx-auto max-w-[600px] text-body text-ink-400 lg:text-lead">
                      {about.goalText}
                    </p>
                  </div>
                </BadgePanel>
              </div>

              {/*
                The legal notice and the masthead are one stacked block in the
                left track, not the two tracks of the grid - the design runs
                them down the same edge and keeps the editor's name on one line.
              */}
              <div className="flex flex-col gap-head lg:gap-10">
                <section className="flex flex-col gap-3">
                  <h2 className="text-title-sm font-medium text-ink-900 lg:text-title-lg">
                    {about.legalTitle}
                  </h2>
                  <p className="text-body text-ink-600 lg:text-lead">
                    {about.legalText}
                  </p>
                </section>

                <section className="flex flex-col gap-3">
                  <h2 className="text-body text-ink-600 lg:text-lead">
                    {about.editorLabel}
                  </h2>
                  <p className="text-title-sm font-medium text-ink-900 lg:text-title-lg">
                    {about.editorName}
                  </p>
                </section>
              </div>
            </div>

            {/* Mobile has no side rail in this design, only the leaderboard. */}
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
