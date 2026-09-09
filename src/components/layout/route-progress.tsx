"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";

const APPEAR_DELAY = 120;

/** Where the bar starts, as a fraction of the window's width. */
const START = 0.02;

const CEILING = 0.9;

/** How long the creep takes to cross from START to CEILING. */
const CREEP = 12_000;

const CREEP_EASING = "cubic-bezier(0.1, 0.9, 0.15, 1)";

/** Closing the bar once the page has committed, then fading the full bar out. */
const DONE = 180;
const FADE = 220;

const SAFETY = 20_000;

function RouteProgressBar() {
  const pathname = usePathname();
  const query = useSearchParams().toString();

  const [visible, setVisible] = useState(false);
  const bar = useRef<HTMLDivElement>(null);
  const creep = useRef<Animation | null>(null);

  const timers = useRef<{ appear?: number; hide?: number; safety?: number }>(
    {},
  );
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
    clear();
    setVisible(false);

    timers.current.appear = window.setTimeout(() => {
      shown.current = true;
      setVisible(true);
    }, APPEAR_DELAY);

    timers.current.safety = window.setTimeout(finish, SAFETY);
  }, [clear, finish]);

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
      <div
        ref={bar}
        className="h-full origin-left bg-accent will-change-transform"
        style={{ transform: `scaleX(${START})` }}
      />
    </div>
  );
}

export function RouteProgress() {
  return (
    <Suspense fallback={null}>
      <RouteProgressBar />
    </Suspense>
  );
}
