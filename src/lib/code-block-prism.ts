import "@/lib/code-highlight";

import { CodeBlock } from "@tiptap/extension-code-block";

import { PrismPlugin } from "@/lib/tiptap-prism-plugin";

/**
 * Code block with Prism-based syntax highlighting (inline decorations), compatible with Tiptap v3.
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
});
