export const MAX_POST_LINKS = 2;

const BARE_URL = /(?:https?:\/\/|www\.)[^\s<>"']+/gi;

/**
 * Counts the links in TipTap post HTML: `<a href>` elements plus bare URLs
 * typed as plain text (outside an anchor). Must run in the browser.
 */
export const countPostLinks = (html: string): number => {
  if (!html) return 0;
  const doc = new DOMParser().parseFromString(html, "text/html");
  const anchors = doc.querySelectorAll("a[href]");
  let count = anchors.length;

  const walker = doc.createTreeWalker(doc.body, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (node.parentElement?.closest("a")) continue;
    count += node.textContent?.match(BARE_URL)?.length ?? 0;
  }
  return count;
};

export const hasTooManyLinks = (html: string): boolean =>
  countPostLinks(html) > MAX_POST_LINKS;
