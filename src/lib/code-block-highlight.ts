import { HIGHLIGHT_LANGUAGES } from "@/lib/code-highlight";

import { mergeAttributes } from "@tiptap/core";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { createLowlight } from "lowlight";

const lowlight = createLowlight(HIGHLIGHT_LANGUAGES);

lowlight.registerAlias({
  javascript: ["js", "jsx", "mjs", "cjs"],
  typescript: ["ts", "tsx"],
  python: ["py"],
  markdown: ["md"],
  bash: ["sh", "shell", "zsh"],
  xml: ["html", "svg", "vue"],
  yaml: ["yml"],
  go: ["golang"],
  rust: ["rs"],
  diff: ["patch"],
});

/**
 * Code block with highlight.js-based syntax highlighting (inline decorations), compatible with Tiptap v3.
 *
 * Default language is set to `bash` so freshly-created code blocks are
 * serialized as `<pre><code class="language-bash hljs">...</code></pre>`,
 * which lets the viewer (PostContent) actually run highlight.js on them and
 * matches the `.hljs` class `highlightCodeElement` adds for legacy posts.
 * Authors can still override the language per-block via the editor UI.
 */
export const CodeBlockHighlight = CodeBlockLowlight.extend({
  renderHTML({ node, HTMLAttributes }) {
    const languageClass = node.attrs.language
      ? `${this.options.languageClassPrefix}${node.attrs.language}`
      : null;

    return [
      "pre",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      [
        "code",
        { class: ["hljs", languageClass].filter(Boolean).join(" ") },
        0,
      ],
    ];
  },
}).configure({
  lowlight,
  defaultLanguage: "bash",
});
