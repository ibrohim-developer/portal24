import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { AdsSlot } from "@/components/ui/ads-slot";
import { Container } from "@/components/ui/container";
import { Bar, Lines } from "@/components/ui/skeleton";
import { strings } from "@/lib/strings";

/**
 * The article page's loading state (Claude Design "News article skeleton").
 *
 * `loading.tsx` wraps page.tsx in a Suspense boundary but *not* the layout, and
 * on this site the chrome lives in the page rather than in a layout - see the
 * note in app/error.tsx. So the header and footer are drawn here too; leaving
 * them out would make them vanish on every navigation into an article and
 * reappear when it resolved.
 *
 * That does mean this fallback awaits the category list the header and footer
 * need. It is the same memoised fetch the page makes and it is not the slow
 * one - `getArticle` is - so the skeleton still paints well before the story.
 *
 * When it is seen: `revalidate = 900` with `dynamicParams`, so any article
 * outside the prebuilt recent run renders on its first request, and every
 * article does again once its 15 minutes are up.
 *
 * Where this departs from the design file, and why:
 *
 *  - Geometry is the page's, not the mock's. The design is drawn on its own
 *    1180px frame with a 1fr/275px pair and a 16/10 hero; the real page is the
 *    1121 "Content" frame, `grid-article`, and a 358/250 -> 800/540 hero. A
 *    skeleton whose boxes are not the boxes that replace them defeats the
 *    point, so above the body - where what renders is fully determined by
 *    ArticleHead and ArticleFigure - the page's measurements win. Inside the
 *    body, where the CMS decides what exists at all, the design's rhythm wins
 *    unchanged.
 *  - The advertising slots are the real `AdsSlot`, not placeholder bars. They
 *    draw the same box loaded or loading, so shimmering them would animate
 *    something that is not actually pending.
 *  - The design's callout hexes (#F2F5F9 on #0B3A6F) are the mock's sampling
 *    of accent/8 on accent, so the tokens are used directly.
 */
export default function Loading() {
  return (
    <>
      <Container bleed className="pb-gutter">
        <AdsSlot
          width={1280}
          height={200}
          label={strings.a11y.advertising}
          className="w-full"
        />
      </Container>

      <SiteHeader />

      <main className="flex-1 py-gutter">
        <Container>
          <div className="mx-auto w-full max-w-280">
            {/*
              One live region for the whole skeleton rather than per bar: the
              bars carry no text, so without this a screen reader is told
              nothing at all while the article is on its way.
            */}
            <div
              role="status"
              aria-busy="true"
              aria-label={strings.a11y.loading}
              className="lg:grid lg:grid-article lg:gap-x-gutter"
            >
              {/* ArticleHead: category, headline, byline - 20px apart. */}
              <div className="flex flex-col gap-gutter lg:col-start-1 lg:row-start-1">
                <Bar width={92} height={14} />

                <div className="flex flex-col gap-3">
                  <Bar width="100%" height={30} />
                  <Bar width="72%" height={30} />
                </div>

                <div className="flex gap-[14px]">
                  <Bar width={168} height={12} />
                  <Bar width={56} height={12} />
                </div>
              </div>

              <div className="mt-head flex min-w-0 flex-col lg:col-start-1 lg:row-start-2">
                {/* Hero and its caption, at ArticleFigure's crop and its 16px gap. */}
                <Bar
                  width="100%"
                  className="aspect-[358/250] lg:aspect-[800/540]"
                />
                <Bar width="58%" height={12} className="mt-4" />

                {/* Body. Widths and spacing straight from the design. */}
                <Lines widths={["100%", "100%", "64%"]} className="mt-head" />
                <Lines
                  widths={["100%", "96%", "100%", "41%"]}
                  className="mt-[22px]"
                />

                <Bar width="56%" height={24} className="mt-9" />
                <Lines widths={["100%", "52%"]} className="mt-[22px]" />

                {/*
                  AttentionText's panel, reproduced rather than approximated:
                  the 2px rule sits inside the 12px padding, and the 32px row
                  gives the design's 56px block height.
                */}
                <div className="mt-[26px] w-full bg-accent/8 p-3">
                  <div className="flex h-8 items-center border-l-2 border-accent pl-[13px]">
                    <Bar width="78%" height={14} tone="accent" />
                  </div>
                </div>

                <Lines
                  widths={["100%", "100%", "73%"]}
                  className="mt-[26px]"
                />

                {/*
                  A trailing figure. 16/9 is the design's call and is kept: the
                  inline crop ArticleFigure uses in the body is portrait
                  (801/1000), but whether a story carries a closing image at all
                  is unknowable here, and a portrait slab that usually resolves
                  to nothing is the worse guess.
                */}
                <Bar width="100%" className="mt-8 aspect-video" />
              </div>

              {/*
                The rail. Hidden below `lg`, as on the page - the design stacks
                it under the article at 900px instead, but the article page has
                no mobile rail to stack.
              */}
              <aside className="mt-head hidden lg:col-start-2 lg:row-start-2 lg:flex lg:flex-col lg:gap-gutter">
                <AdsSlot
                  width={300}
                  height={450}
                  label={strings.a11y.advertising}
                  className="w-full"
                />

                <div className="flex flex-col gap-[14px]">
                  <Bar width="60%" height={16} />

                  {["70%", "55%", "82%"].map((width) => (
                    <div
                      key={width}
                      className="flex flex-col gap-2 border-b border-hairline pb-[14px]"
                    >
                      <Bar width="38%" height={11} />
                      <Bar width="100%" height={13} />
                      <Bar width={width} height={13} />
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </Container>
      </main>

      <SiteFooter />
    </>
  );
}
