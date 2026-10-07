import { Config } from "@/utils/getConfig";
import { htmlToMarkdown } from "@/lib/html-to-markdown";
import { apiClient } from "@/utils/fetch";
import type { Post } from "@/types/post";

export const revalidate = 3600; // 1 hour

interface SuccessResponse {
  data: Post;
  message: string;
  success: boolean;
}

const toYamlString = (value: string): string =>
  `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, " ")}"`;

export async function GET(
  _request: Request,
  props: { params: Promise<{ username: string; slug: string }> },
): Promise<Response> {
  const { username, slug } = await props.params;
  const baseUrl = Config.mainbaseurl;

  try {
    const response = await apiClient.get(
      `/api/posts/u/${encodeURIComponent(username)}/${encodeURIComponent(slug)}`,
    );
    const post = (response.data as SuccessResponse).data;
    if (!post) throw new Error("POST_NOT_FOUND");

    const canonical = `${baseUrl}/${username}/${slug}`;
    const plain = (post.body || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    const summary = plain.length > 160 ? `${plain.slice(0, 159)}...` : plain;

    const frontmatter = [
      "---",
      `title: ${toYamlString(post.title || "Untitled")}`,
      `author: ${toYamlString(post.user?.username || "Anonymous")}`,
      `canonical: ${toYamlString(canonical)}`,
      ...(post.created_at ? [`published: ${toYamlString(post.created_at)}`] : []),
      ...(post.updated_at ? [`updated: ${toYamlString(post.updated_at)}`] : []),
      ...(post.tags?.length
        ? [`tags: [${post.tags.map((t) => toYamlString(t.name)).join(", ")}]`]
        : []),
      ...(summary ? [`description: ${toYamlString(summary)}`] : []),
      "---",
      "",
    ].join("\n");

    const markdown = `${frontmatter}# ${post.title || "Untitled"}\n\n${htmlToMarkdown(post.body || "")}\n`;

    return new Response(markdown, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
        Link: `<${canonical}>; rel="canonical"`,
      },
    });
  } catch {
    return new Response("Post not found", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}
