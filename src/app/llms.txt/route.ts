import { Config } from "@/utils/getConfig";

/**
 * `llms.txt` (https://llmstxt.org) — a plain-text entry point that tells AI
 * crawlers and assistants what pilput is and where the citable content lives.
 */
export const revalidate = 86400; // 24 hours

export async function GET(): Promise<Response> {
  const base = Config.mainbaseurl;

  const body = `# pilput

> pilput is an open publishing platform where anyone can write and share articles with ease.

## About

- [About pilput](${base}/about): mission and how the platform works.
- [Contact](${base}/contact): support, feedback, and collaboration inquiries.
- [Terms of Service](${base}/terms): content and conduct rules for authors.
- [Privacy Policy](${base}/privacy): how reader and author data is handled.

## Content

- [Blog](${base}/blog): latest articles, tutorials, and discussions from the community.
- [Tags](${base}/tags): browse articles by topic.
- [Communities](${base}/guilds): guilds group people and topics.

## Reading a post as Markdown

- Every public post has a plain-text alternate at \`/{username}/{slug}/md\`
  served as \`text/markdown\` (frontmatter + body), e.g. linked from the post
  page via a \`text/markdown\` alternate.

## Sitemaps

- [Main sitemap](${base}/sitemap.xml)
- [Posts sitemap](${base}/posts/sitemap.xml)
- [Tags sitemap](${base}/tags/sitemap.xml)
- [Writers sitemap](${base}/users/sitemap.xml)
- [Guilds sitemap](${base}/guilds/sitemap.xml)
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
