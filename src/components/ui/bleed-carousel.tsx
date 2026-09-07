"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { Container } from "@/components/ui/container";
import { SectionHead } from "@/components/ui/section-head";

/**
 * A titled row that scrolls sideways off the right edge of the page.
 *
 * Shared by "Цифры последних дней" and "Главное за минуту", which differ only
 * in what their cards contain. The head keeps to the 960 content column, but
 * the track is full-bleed, so the component expects to be rendered as a direct
 * child of <main>, OUTSIDE <Container> - see the main page - and brings its own
 * Container back for the head alone.
 *
 * The inset is a MARGIN on the left and a PADDING on the right, and the
 * difference matters: overflow clips at the padding box, so a left padding
 * would let scrolled-out cards stay visible all the way to the edge of the
 * screen. The margin puts the clip edge on the content column instead, which is
 * where the design cuts them off. On the right there is nothing to clip - the
 * padding just stops the last card short of the screen edge at the end of the
 * row.
 *
 * The row stays a native scroller, so touch and keyboard still work when the
 * buttons do not; they are the only part of the block that needs JS, and the
 * only part mobile drops entirely.
 *
 * Children are the `<li>` cards.
 */
export function BleedCarousel({
  title,
  prevLabel,
  nextLabel,
  step,
  children,
}: {
  title: string;
  prevLabel: string;
  nextLabel: string;
  /** Card width + gutter: one press of an arrow advances exactly one card. */
  step: number;
  children: React.ReactNode;
}) {
  const scroller = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    // 1px of slack - fractional scroll offsets never land exactly on the end.
    setAtStart(el.scrollLeft <= 1);

    // "The last card is fully in view", not "the scroll is exhausted". Those
    // differ here: snap-mandatory rests the row on a card boundary, but the
    // scrollable range runs `pr-(--page-inset)` further than the last of them,
    // so measuring against scrollWidth leaves the arrow live for a small stub
    // that scrolls nothing anyone can see.
    const last = el.lastElementChild;
    setAtEnd(
      !last ||
        last.getBoundingClientRect().right <=
          el.getBoundingClientRect().right + 1,
    );
  }, []);

  useEffect(() => {
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [sync]);

  const scrollBy = (direction: 1 | -1) => {
    scroller.current?.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  return (
    <section className="flex flex-col gap-head">
      {/*
        The head stops at the content column: the design lines the prev/next
        pair up with the 960 edge, not with the container edge.
      */}
      <Container>
        <div className="lg:w-column">
          <SectionHead
            title={title}
            actions={
              // Mobile has no room for the pair beside the title, and the row
              // is a native scroller there anyway - a finger does what the
              // arrows do. They come back with the desktop layout at `lg`,
              // centred against the title line the way the Figma has them.
              <div className="hidden self-center lg:flex">
                <ArrowButton
                  label={prevLabel}
                  disabled={atStart}
                  onClick={() => scrollBy(-1)}
                />
                <ArrowButton
                  label={nextLabel}
                  disabled={atEnd}
                  onClick={() => scrollBy(1)}
                  next
                />
              </div>
            }
          />
        </div>
      </Container>

      <ul
        ref={scroller}
        onScroll={sync}
        tabIndex={0}
        aria-label={title}
        className="ml-(--page-inset) flex snap-x snap-mandatory gap-gutter overflow-x-auto pr-(--page-inset) [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </ul>
    </section>
  );
}

/**
 * 72x40 flat square on `hairline` (#0010200d in the Figma). Hover deepens the
 * same tint rather than introducing a colour the design does not have.
 */
function ArrowButton({
  label,
  disabled,
  onClick,
  next = false,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  next?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-10 w-18 items-center justify-center bg-hairline text-ink-900 transition-colors hover:bg-ink-900/10 disabled:opacity-30 disabled:hover:bg-hairline"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d={next ? "M4 12h16M14 6l6 6-6 6" : "M20 12H4M10 6l-6 6 6 6"}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
