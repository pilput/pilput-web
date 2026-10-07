/**
 * Best-effort HTML → Markdown for the per-post `text/markdown` alternate
 * (`/[username]/[slug]/md`). Dependency-free and server-safe (no DOM).
 *
 * Input is TipTap-authored post HTML; output feeds AI crawlers and readers
 * that prefer plain text over the full page chrome.
 */

const decodeEntities = (text: string): string =>
  text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");

const stripTags = (html: string): string =>
  decodeEntities(html.replace(/<[^>]*>/g, "")).trim();

export function htmlToMarkdown(html: string): string {
  if (!html) return "";

  let md = html;

  // Code blocks first (may contain markup-like text inside).
  md = md.replace(
    /<pre[^>]*>\s*<code[^>]*>([\s\S]*?)<\/code>\s*<\/pre>/gi,
    (_m, code: string) => `\n\`\`\`\n${stripTags(code)}\n\`\`\`\n`,
  );
  md = md.replace(/<code[^>]*>([\s\S]*?)<\/code>/gi, (_m, code: string) => `\`${stripTags(code)}\``);

  // Headings.
  for (let level = 6; level >= 1; level--) {
    const hashes = "#".repeat(level);
    md = md.replace(
      new RegExp(`<h${level}[^>]*>([\\s\\S]*?)<\\/h${level}>`, "gi"),
      (_m, inner: string) => `\n${hashes} ${stripTags(inner)}\n`,
    );
  }

  // Images (keep URL + alt).
  md = md.replace(
    /<img[^>]*src="([^"]+)"[^>]*>/gi,
    (_m, src: string) => {
      const alt = /alt="([^"]*)"/i.exec(_m)?.[1] ?? "";
      return `\n![${alt}](${src})\n`;
    },
  );

  // Links.
  md = md.replace(
    /<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi,
    (_m, href: string, text: string) => `[${stripTags(text)}](${href})`,
  );

  // Inline emphasis.
  md = md.replace(/<(strong|b)[^>]*>([\s\S]*?)<\/(strong|b)>/gi, "**$2**");
  md = md.replace(/<(em|i)[^>]*>([\s\S]*?)<\/(em|i)>/gi, "_$2_");
  md = md.replace(/<(s|del|strike)[^>]*>([\s\S]*?)<\/(s|del|strike)>/gi, "~~$2~~");

  // Blockquotes.
  md = md.replace(
    /<blockquote[^>]*>([\s\S]*?)<\/blockquote>/gi,
    (_m, inner: string) =>
      `\n${stripTags(inner)
        .split("\n")
        .map((line) => `> ${line}`)
        .join("\n")}\n`,
  );

  // List items, then collapse list wrappers.
  md = md.replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, (_m, inner: string) => `\n- ${stripTags(inner)}`);
  md = md.replace(/<\/?(ul|ol)[^>]*>/gi, "\n");

  // Paragraphs, breaks, rules.
  md = md.replace(/<\/p>\s*<p[^>]*>/gi, "\n\n");
  md = md.replace(/<\/?p[^>]*>/gi, "\n\n");
  md = md.replace(/<br\s*\/?>/gi, "\n");
  md = md.replace(/<hr\s*\/?>/gi, "\n---\n");

  // Drop anything left (iframes/embeds, tables, spans) to plain text.
  md = md.replace(/<[^>]+>/g, "");
  md = decodeEntities(md);

  // Normalize: max 2 consecutive newlines, trim trailing spaces.
  return md
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/g, ""))
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
