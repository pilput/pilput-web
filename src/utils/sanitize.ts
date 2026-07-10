import DOMPurify from "isomorphic-dompurify";

// Only allow YouTube embeds through the `iframe` tag TipTap's youtube
// extension produces — any other iframe src is dropped regardless of what
// the stored post HTML contains.
const YOUTUBE_EMBED_SRC = /^https:\/\/(www\.)?youtube(-nocookie)?\.com\/embed\//;

// `node` may come from a server-side jsdom instance rather than the browser's
// own DOM, so it can't be checked with `instanceof Element` (that global
// class doesn't exist outside a browser/jsdom window) — duck-type instead.
DOMPurify.addHook("uponSanitizeElement", (node, data) => {
  const element = node as Partial<Element>;
  if (data.tagName === "iframe" && typeof element.getAttribute === "function") {
    const src = element.getAttribute("src") ?? "";
    if (!YOUTUBE_EMBED_SRC.test(src)) {
      element.remove?.();
    }
  }
});

/**
 * Sanitizes TipTap-authored post HTML before it is rendered with
 * `dangerouslySetInnerHTML`. Allows the rich-text markup the editor
 * produces (headings, code blocks, links, images, YouTube embeds, tables)
 * while stripping scripts, event handlers, and any other injectable markup.
 */
export const sanitizeHtml = (html: string): string => {
  if (!html) return "";
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p", "br", "hr",
      "h1", "h2", "h3", "h4", "h5", "h6",
      "strong", "em", "u", "s", "del", "mark",
      "code", "pre", "span",
      "blockquote",
      "ul", "ol", "li",
      "a", "img", "iframe",
      "table", "thead", "tbody", "tr", "th", "td",
    ],
    ALLOWED_ATTR: [
      "href", "target", "rel",
      "src", "alt", "title", "width", "height",
      "class", "style", "data-language",
      "frameborder", "allow", "allowfullscreen",
    ],
  });
};

export const escapeHtml = (text: string): string => {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
};

/**
 * Serializes a JSON-LD object for embedding via `dangerouslySetInnerHTML`
 * on a `<script type="application/ld+json">` tag. Escapes `<` so a
 * user-controlled field (post title, username, bio, ...) containing
 * `</script>` can't break out of the script element and inject markup.
 */
export const toSafeJsonLd = (data: unknown): string =>
  JSON.stringify(data).replace(/</g, "\\u003c");
