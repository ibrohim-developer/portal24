"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

let observer: IntersectionObserver | null = null;
const waiting = new WeakMap<Element, () => void>();

function whenNear(el: Element, run: () => void): () => void {
  if (typeof IntersectionObserver === "undefined") {
    run();
    return () => {};
  }

  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        observer?.unobserve(entry.target);
        waiting.get(entry.target)?.();
        waiting.delete(entry.target);
      }
    },
    { rootMargin: "300px" },
  );

  waiting.set(el, run);
  observer.observe(el);
  return () => {
    observer?.unobserve(el);
    waiting.delete(el);
  };
}

/**
 * A photo that shows the loading sweep while its pixels are on their way.
 *
 * Images are fetched separately from the document, so they land about half a
 * second after the text on a warm cache and a second or two on a cold one.
 * `loading.tsx` cannot help with that: its boundary clears when the CMS
 * answers, which is before the browser has even asked for an image. This
 * covers the gap, so the page never shows a white hole where a photo is about
 * to be.
 *
 * Both conditions below are load-bearing, and each was measured on the front
 * page (49 images) rather than reasoned about:
 *
 *  - Stop when the image arrives. A background animation under an
 *    already-painted image still recalculates style every frame: 47 of them
 *    cost ~709ms of main thread per 6s, for ever, for something nobody can
 *    see. This is why what looks like a CSS problem is a client component.
 *  - Do not start until the image is near the viewport. Lazy images below the
 *    fold never load, so they would never stop - that alone was still ~549ms
 *    per 6s. `content-visibility:auto` only took it to ~353ms, so the fix has
 *    to be not animating rather than animating out of sight.
 *
 * An eager image is shimmering in the server-rendered HTML, before any of this
 * hydrates - which is the point, since the hero is the one image a reader is
 * actually watching. Lazy images start dark and light up as they come into
 * range.
 *
 * Transparent art must not use this: the sweep would show through for ever.
 * See `Logo`, which stays a bare `next/image`.
 */
export function Photo({ className, onLoad, alt, ...props }: ImageProps) {
  const eager = props.priority === true || props.loading === "eager";

  const [pending, setPending] = useState(true);
  const [near, setNear] = useState(eager);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // An image served from cache can already be complete before React attaches
    // the handler, and `load` never fires again for it - so the sweep would
    // run for ever on exactly the images that were fastest. Reading `complete`
    // is the only way to catch those.
    if (el.complete) {
      setPending(false);
      return;
    }

    if (eager) return;
    return whenNear(el, () => setNear(true));
  }, [eager]);

  return (
    <Image
      {...props}
      // Named rather than left to the spread: jsx-a11y cannot follow a spread,
      // and an image component that silently drops alt is worth the rule
      // staying able to see it.
      alt={alt}
      ref={ref}
      onLoad={(event) => {
        setPending(false);
        onLoad?.(event);
      }}
      // A photo that 404s, or whose host is down, keeps its alt text and its
      // reserved box. What it must not do is shimmer for the rest of the visit.
      onError={() => setPending(false)}
      className={cn(pending && near && "skeleton", className)}
    />
  );
}
