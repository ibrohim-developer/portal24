"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";

/**
 * How long a navigation may run before the bar is drawn at all.
 *
 * Most moves between pages are served from the router cache or a finished
 * prefetch and commit in a few frames; drawing for those would be a flash of
 * blue on every click. The bar is only for the ones that actually wait on the
 * CMS - see the note on the completion effect for what "wait" means here.
 */
const APPEAR_DELAY = 120;

/** Where the bar starts, as a fraction of the window's width. */
const START = 0.02;

/**
 * The width the creep approaches but never reaches.
 *
 * There is no progress to report - the router gives no bytes-received signal -
 * so the bar eases toward a ceiling and only completes when the new page does.
 * Stopping short of the edge is what keeps that honest: a bar that filled on
 * its own would claim the page had arrived.
 */
const CEILING = 0.9;

/** How long the creep takes to cross from START to CEILING. */
const CREEP = 12_000;

/**
 * Off the mark fast, then flattening hard: roughly a third of the way across in
 * the first half second, three quarters by two and a half, and only creeping
 * after that. Shaped around where navigations here actually land - the bar has
 * to have covered visible ground by the time a quick one finishes, or the
 * completion reads as a jump.
 */
const CREEP_EASING = "cubic-bezier(0.1, 0.9, 0.15, 1)";

/** Closing the bar once the page has committed, then fading the full bar out. */
const DONE = 180;
const FADE = 220;

/**
 * A navigation this long has almost certainly failed. Release the bar rather
 * than leave it parked at the ceiling for the rest of the session.
 */
const SAFETY = 20_000;

function RouteProgressBar() {
  const pathname = usePathname();
  const query = useSearchParams().toString();

  // Mounting is the only part of this React drives; the motion itself belongs
  // to the compositor. Unmounting between navigations is what gives each one a
  // fresh element that starts at START rather than at wherever the last one
  // stopped.
  const [visible, setVisible] = useState(false);
  const bar = useRef<HTMLDivElement>(null);
  const creep = useRef<Animation | null>(null);

  const timers = useRef<{ appear?: number; hide?: number; safety?: number }>({});
  /** A navigation is being tracked. */
  const active = useRef(false);
  /** The delay elapsed and the bar is on screen. */
  const shown = useRef(false);
  /** The URL the router last committed, as the address bar spells it. */
  const committed = useRef("");

  const clear = useCallback(() => {
    const { appear, hide, safety } = timers.current;
    window.clearTimeout(appear);
    window.clearTimeout(hide);
    window.clearTimeout(safety);
    timers.current = {};
  }, []);

  const finish = useCallback(() => {
    if (!active.current) return;
    active.current = false;
    clear();
    // The page arrived inside APPEAR_DELAY: nothing was ever drawn, so there
    // is nothing to complete.
    if (!shown.current) return;
    shown.current = false;

    const el = bar.current;
    if (!el) {
      setVisible(false);
      return;
    }

    // Freeze the creep where it stands before cancelling it, so the closing
    // animation picks that width up rather than snapping back to START and
    // sweeping across from there.
    creep.current?.commitStyles();
    creep.current?.cancel();
    creep.current = null;

    el.animate([{ transform: "scaleX(1)" }], {
      duration: DONE,
      easing: "ease-out",
      fill: "forwards",
    });
    el.animate([{ opacity: 0 }], {
      duration: FADE,
      delay: DONE,
      fill: "forwards",
    });

    timers.current.hide = window.setTimeout(
      () => setVisible(false),
      DONE + FADE,
    );
  }, [clear]);

  const start = useCallback(() => {
    if (active.current) return;
    active.current = true;
    // Cuts short a fade-out still in flight from the previous navigation;
    // without this the old bar would sit at full width while the new one waits
    // out its delay.
    clear();
    setVisible(false);

    timers.current.appear = window.setTimeout(() => {
      shown.current = true;
      setVisible(true);
    }, APPEAR_DELAY);

    timers.current.safety = window.setTimeout(finish, SAFETY);
  }, [clear, finish]);

  /*
   * The creep, as one Web Animation rather than as a timer nudging React state.
   *
   * Transform and opacity animations are handed to the compositor, so the bar
   * keeps moving at full frame rate while the main thread is busy doing the
   * very thing the bar is reporting on - parsing the RSC payload and
   * reconciling the new page. An earlier version of this re-rendered every
   * 200ms and transitioned between the steps; it stuttered twice over, once at
   * every step boundary where the easing brought it to a stop before the next
   * step began, and again wherever a render landed late because the main
   * thread was blocked.
   */
  useEffect(() => {
    const el = bar.current;
    if (!visible || !el) return;

    creep.current = el.animate(
      [{ transform: `scaleX(${START})` }, { transform: `scaleX(${CEILING})` }],
      { duration: CREEP, easing: CREEP_EASING, fill: "forwards" },
    );
    return () => {
      creep.current?.cancel();
      creep.current = null;
    };
  }, [visible]);

  useEffect(() => {
    /*
     * Capture, not bubble. Next's <Link> calls preventDefault on the click and
     * takes the navigation over itself, and React's own listener sits on the
     * root container - below document. A bubble-phase listener here would see
     * every internal link as already-defaultPrevented and never fire.
     */
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      // Modified clicks open a tab or download the target; the current page
      // stays where it is.
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor || anchor.hasAttribute("download")) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (!anchor.getAttribute("href")) return;

      const url = new URL(anchor.href, location.href);
      // Telegram, the social row, anything off-site: the browser takes over
      // and this page is about to be replaced anyway.
      if (url.origin !== location.origin) return;
      // Same URL or a bare hash - the router commits without fetching, and the
      // completion effect below would never fire to release the bar.
      if (url.pathname + url.search === location.pathname + location.search) {
        return;
      }

      start();
    }

    // Back and forward. The browser has already moved the address bar by the
    // time this fires, so a step that only changed the hash - and that the
    // router will therefore commit without a fetch - is visible as a URL that
    // still matches the committed one.
    function onPopState() {
      if (location.pathname + location.search === committed.current) return;
      start();
    }

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
    };
  }, [start]);

  /*
   * The completion signal. The App Router pushes the new URL only once the
   * transition commits - i.e. once the server has sent the page - so the frame
   * `usePathname` changes on is the frame the reader sees the new page.
   *
   * The query string is part of it because the search chips move between
   * `/search/` and `/search/?q=...` without touching the pathname.
   *
   * A search submitted from the field itself is a `router.replace`, not a
   * click, so it never starts the bar - it filters an index already in the
   * browser and has nothing to wait for.
   */
  useEffect(() => {
    committed.current = location.pathname + location.search;
    finish();
  }, [pathname, query, finish]);

  useEffect(() => clear, [clear]);

  if (!visible) return null;

  return (
    <div
      aria-hidden
      // Above the burger drawer's z-50: the drawer stays up while the page it
      // linked to loads, and the bar is the only sign that anything happened.
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px]"
    >
      {/* The inline transform is the animation's own first frame, so the bar
          cannot flash at full width in the frame before the animation starts.
          `will-change` asks for the compositor layer up front rather than on
          the first animated frame. */}
      <div
        ref={bar}
        className="h-full origin-left bg-accent will-change-transform"
        style={{ transform: `scaleX(${START})` }}
      />
    </div>
  );
}

/**
 * The loading bar across the top of the window, drawn while a click on a link
 * waits for the next page.
 *
 * Every route here renders on the server against the CMS API, and none of them
 * has a `loading.tsx`, so a click on an uncached story sits on the current page
 * with no feedback at all until the reply lands. This is that feedback.
 *
 * `useSearchParams` suspends on a prerendered route, so the boundary is part of
 * the component rather than something the layout has to remember to add - the
 * bar is client-only regardless, and the fallback it prerenders is nothing.
 */
export function RouteProgress() {
  return (
    <Suspense fallback={null}>
      <RouteProgressBar />
    </Suspense>
  );
}
