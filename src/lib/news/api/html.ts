import type { ArticleBlock, InlineSpan } from "../types";

/**
 * The CMS's `content` HTML, reduced to the block union the article page draws.
 *
 * This exists because `ArticleBlock` is a typed union on purpose: rendering the
 * CMS's HTML directly would let an editor's markup - a pasted `<div style>`, a
 * `<span>` carrying the admin panel's own Tailwind classes, an `<iframe>` -
 * walk straight past every style on the page. Parsing to a fixed vocabulary
 * means anything unrecognised degrades to its text instead of to a surprise.
 *
 * What the CMS actually emits, sampled across 50 articles:
 *
 *   p:430  br:192  a:108  li:32  span:28  img:13  strong:12  blockquote:6  ul:4
 *
 * and no headings at all - so `heading` blocks come only from the fixtures
 * today. `span` and `div` carry no meaning worth keeping and are unwrapped.
 *
 * Hand-rolled rather than a DOM library: this runs at build and on ISR
 * regeneration, the vocabulary above is small and closed, and the alternative
 * is shipping a parser to production to read one field.
 */

/** Tags whose text is kept but whose own markup is dropped. */
const UNWRAPPED = new Set(["span", "div", "section", "figure", "em", "i", "u"]);

/** Tags that contribute nothing and whose contents go with them. */
const DROPPED = new Set(["script", "style", "iframe", "noscript"]);

interface Token {
  tag: string;
  attrs: string;
  closing: boolean;
  selfClosing: boolean;
}

const TAG_PATTERN = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:[^>"']|"[^"]*"|'[^']*')*)>/g;

function attr(attrs: string, name: string): string | null {
  const match = new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i").exec(
    attrs,
  );
  if (!match) return null;
  return match[2] ?? match[3] ?? null;
}

/**
 * HTML entities, decoded by hand.
 *
 * Only the ones a CMS body realistically carries. A numeric escape is decoded
 * generically; anything else is left as written, which reads as the literal
 * text the editor typed rather than as a mangled glyph.
 */
const ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ",
  laquo: "«", raquo: "»", ldquo: "“", rdquo: "”", lsquo: "‘", rsquo: "’",
  mdash: "—", ndash: "–", hellip: "…", middot: "·", deg: "°", eacute: "é",
};

function decodeEntities(text: string): string {
  return text.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (whole, body: string) => {
    if (body.startsWith("#")) {
      const code = body[1] === "x" || body[1] === "X"
        ? parseInt(body.slice(2), 16)
        : parseInt(body.slice(1), 10);
      return Number.isFinite(code) ? String.fromCodePoint(code) : whole;
    }
    return ENTITIES[body.toLowerCase()] ?? whole;
  });
}

/**
 * Only http(s) links survive.
 *
 * An href the CMS stored as `javascript:` or `data:` is dropped to plain text
 * rather than rendered - editor input reaches this from the admin panel, and a
 * link is the one span that turns text into something a reader can act on.
 */
function safeHref(href: string | null): string | null {
  if (!href) return null;
  const trimmed = href.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  // Site-relative links are fine and are how the CMS points at its own stories.
  if (/^\/[^/]/.test(trimmed)) return trimmed;
  return null;
}

/** Collapses the whitespace an editor's line breaks leave in the markup. */
function normalise(text: string): string {
  return text.replace(/\s+/g, " ");
}

/**
 * Turns one run of inline HTML into spans, dropping every tag it does not
 * model. `<br>` is handled by the caller, which splits on it first.
 */
function parseInline(html: string): InlineSpan[] {
  const spans: InlineSpan[] = [];
  let linkHref: string | null = null;
  let emphasis = 0;
  let dropDepth = 0;
  let cursor = 0;

  const push = (raw: string) => {
    if (dropDepth > 0) return;
    const text = decodeEntities(normalise(raw));
    if (!text) return;

    const kind: InlineSpan["kind"] =
      linkHref !== null ? "link" : emphasis > 0 ? "emphasis" : "text";

    // Merge with the previous span when it carries the same mark, so a
    // paragraph broken up by tags we unwrap does not become a run of
    // single-word spans.
    const last = spans[spans.length - 1];
    if (
      last &&
      last.kind === kind &&
      (kind !== "link" || last.kind !== "link" || last.href === linkHref)
    ) {
      last.text += text;
      return;
    }

    spans.push(
      kind === "link"
        ? { kind, text, href: linkHref as string }
        : { kind, text },
    );
  };

  for (const match of html.matchAll(TAG_PATTERN)) {
    push(html.slice(cursor, match.index));
    cursor = match.index + match[0].length;

    const token: Token = {
      closing: match[1] === "/",
      tag: match[2].toLowerCase(),
      attrs: match[3] ?? "",
      selfClosing: (match[3] ?? "").trimEnd().endsWith("/"),
    };

    if (DROPPED.has(token.tag)) {
      dropDepth += token.closing ? -1 : 1;
      if (dropDepth < 0) dropDepth = 0;
      continue;
    }
    if (UNWRAPPED.has(token.tag)) continue;

    if (token.tag === "a") {
      linkHref = token.closing ? null : safeHref(attr(token.attrs, "href"));
    } else if (token.tag === "strong" || token.tag === "b") {
      emphasis = Math.max(0, emphasis + (token.closing ? -1 : 1));
    }
  }

  push(html.slice(cursor));

  // Trim the outer edges without disturbing the single spaces between spans.
  const first = spans[0];
  if (first) first.text = first.text.replace(/^\s+/, "");
  const last = spans[spans.length - 1];
  if (last) last.text = last.text.replace(/\s+$/, "");

  return spans.filter((span) => span.text.length > 0);
}

/** Splits on `<br>`, which the CMS's editor uses as a paragraph break. */
function splitOnBreaks(html: string): string[] {
  return html.split(/<br\s*\/?>/i);
}

/** The top-level elements this reads; everything else is treated as a paragraph. */
const BLOCK_PATTERN =
  /<(p|h[1-6]|blockquote|ul|ol|img)\b((?:[^>"']|"[^"]*"|'[^']*')*)>([\s\S]*?)<\/\1\s*>|<img\b((?:[^>"']|"[^"]*"|'[^']*')*)\/?>/gi;

const LIST_ITEM_PATTERN = /<li\b(?:[^>"']|"[^"]*"|'[^']*')*>([\s\S]*?)<\/li\s*>/gi;

/** Nominal size for a body image, for the same reason as a cover - see `map`. */
const BODY_IMAGE_WIDTH = 1280;
const BODY_IMAGE_HEIGHT = 960;

function imageBlock(attrs: string): ArticleBlock | null {
  const src = safeHref(attr(attrs, "src"));
  if (!src) return null;

  const alt = attr(attrs, "alt");
  return {
    kind: "image",
    image: {
      url: src,
      alt: alt ? decodeEntities(normalise(alt)).trim() : "",
      width: BODY_IMAGE_WIDTH,
      height: BODY_IMAGE_HEIGHT,
    },
    // The CMS has no field for either: its editor inserts a bare <img>, so a
    // caption would have to be guessed from the paragraph after it.
    caption: null,
    credit: null,
  };
}

/**
 * Parses one article body.
 *
 * Returns an empty list for content that yields nothing renderable, which the
 * article page treats as a story with no body rather than as a failure.
 */
export function htmlToBlocks(html: string): ArticleBlock[] {
  const blocks: ArticleBlock[] = [];

  const addParagraphs = (inner: string) => {
    for (const piece of splitOnBreaks(inner)) {
      const spans = parseInline(piece);
      if (spans.length > 0) blocks.push({ kind: "paragraph", spans });
    }
  };

  for (const match of html.matchAll(BLOCK_PATTERN)) {
    // The second alternative matches a void <img>, which has no closing tag.
    if (match[4] !== undefined) {
      const image = imageBlock(match[4]);
      if (image) blocks.push(image);
      continue;
    }

    const tag = (match[1] ?? "").toLowerCase();
    const attrs = match[2] ?? "";
    const inner = match[3] ?? "";

    if (tag === "img") {
      const image = imageBlock(attrs);
      if (image) blocks.push(image);
      continue;
    }

    if (tag === "p") {
      addParagraphs(inner);
      continue;
    }

    if (/^h[1-6]$/.test(tag)) {
      const text = parseInline(inner)
        .map((span) => span.text)
        .join("")
        .trim();
      if (text) blocks.push({ kind: "heading", text });
      continue;
    }

    if (tag === "blockquote") {
      // The design's pull-quote is plain text on an accent panel, so a quote's
      // own links are flattened here rather than dropped from the page.
      const text = splitOnBreaks(inner)
        .map((piece) => parseInline(piece).map((span) => span.text).join(""))
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();
      if (text) blocks.push({ kind: "callout", text });
      continue;
    }

    if (tag === "ul" || tag === "ol") {
      const items = [...inner.matchAll(LIST_ITEM_PATTERN)]
        .map((item) => parseInline(item[1] ?? ""))
        .filter((spans) => spans.length > 0);

      if (items.length > 0) {
        blocks.push({ kind: "list", ordered: tag === "ol", items });
      }
      continue;
    }
  }

  // Content with no block tags at all - a body the editor left as bare text.
  if (blocks.length === 0) addParagraphs(html);

  return blocks;
}
