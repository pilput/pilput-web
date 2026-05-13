import "@/lib/code-highlight";

import { CodeBlock } from "@tiptap/extension-code-block";

import { PrismPlugin } from "@/lib/tiptap-prism-plugin";

/**
 * Code block with Prism-based syntax highlighting (inline decorations), compatible with Tiptap v3.
 *
 * Default language is set to `typescript` so freshly-created code blocks are
 * serialized as `<pre><code class="language-typescript">...</code></pre>`,
 * which lets the viewer (PostContent) actually run Prism highlighting on them.
 * Authors can still override the language per-block via the editor UI.
 */
export const CodeBlockPrism = CodeBlock.extend({
  addProseMirrorPlugins() {
    return [
      ...(this.parent?.() || []),
      PrismPlugin({
        name: this.name,
        defaultLanguage: this.options.defaultLanguage,
      }),
    ];
  },
}).configure({
  defaultLanguage: "typescript",
});
