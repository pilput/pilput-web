import { findChildren } from "@tiptap/core";
import type { Node as ProsemirrorNode } from "@tiptap/pm/model";
import { Plugin, PluginKey } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";
import Prism from "prismjs";

import { resolveHighlightLanguage } from "@/lib/code-highlight";

function segmentsFromPrismTokens(
  input: string | Prism.Token | (string | Prism.Token)[],
  classStack: string[] = []
): { text: string; classes: string[] }[] {
  if (typeof input === "string") {
    return input.length ? [{ text: input, classes: [...classStack] }] : [];
  }
  if (Array.isArray(input)) {
    return input.flatMap((item) => segmentsFromPrismTokens(item, classStack));
  }
  const token = input;
  let nextClass = [...classStack, "token", String(token.type)];
  if (token.alias) {
    nextClass = nextClass.concat(
      typeof token.alias === "string" ? [token.alias] : [...token.alias]
    );
  }
  const c = token.content;
  if (typeof c === "string") {
    return c.length ? [{ text: c, classes: nextClass }] : [];
  }
  if (Array.isArray(c)) {
    return c.flatMap((item) => segmentsFromPrismTokens(item, nextClass));
  }
  return segmentsFromPrismTokens(c, nextClass);
}

function getDecorations({
  doc,
  name,
  defaultLanguage,
}: {
  doc: ProsemirrorNode;
  name: string;
  defaultLanguage: string | null | undefined;
}) {
  const decorations: Decoration[] = [];

  findChildren(doc, (node) => node.type.name === name).forEach((block) => {
    let from = block.pos + 1;
    const attrLang = block.node.attrs.language ?? defaultLanguage ?? "plaintext";
    const resolved = resolveHighlightLanguage(`language-${attrLang}`, null);
    const text = block.node.textContent;
    const grammar = Prism.languages[resolved];

    const segments =
      grammar && text.length > 0
        ? segmentsFromPrismTokens(Prism.tokenize(text, grammar), [])
        : [{ text, classes: [] as string[] }];

    segments.forEach((seg) => {
      const to = from + seg.text.length;
      if (seg.classes.length > 0) {
        decorations.push(
          Decoration.inline(from, to, {
            class: seg.classes.join(" "),
          })
        );
      }
      from = to;
    });
  });

  return DecorationSet.create(doc, decorations);
}

function isFunction(param: unknown): param is (...args: unknown[]) => unknown {
  return typeof param === "function";
}

export function PrismPlugin({
  name,
  defaultLanguage,
}: {
  name: string;
  defaultLanguage: string | null | undefined;
}) {
  if (!isFunction(Prism.tokenize)) {
    throw new Error("Prism is not available for CodeBlockPrism");
  }

  const prismPluginKey = new PluginKey("prism");

  const prismPlugin: Plugin<DecorationSet> = new Plugin({
    key: prismPluginKey,

    state: {
      init: (_, { doc }) =>
        getDecorations({
          doc,
          name,
          defaultLanguage,
        }),
      apply: (transaction, decorationSet, oldState, newState) => {
        const oldNodeName = oldState.selection.$head.parent.type.name;
        const newNodeName = newState.selection.$head.parent.type.name;
        const oldNodes = findChildren(oldState.doc, (node) => node.type.name === name);
        const newNodes = findChildren(newState.doc, (node) => node.type.name === name);

        if (
          transaction.docChanged &&
          ([oldNodeName, newNodeName].includes(name) ||
            newNodes.length !== oldNodes.length ||
            transaction.steps.some((step) => {
              const s = step as { from?: number; to?: number };
              return (
                s.from !== undefined &&
                s.to !== undefined &&
                oldNodes.some((node) => {
                  return (
                    node.pos >= s.from! &&
                    node.pos + node.node.nodeSize <= s.to!
                  );
                })
              );
            }))
        ) {
          return getDecorations({
            doc: transaction.doc,
            name,
            defaultLanguage,
          });
        }

        return decorationSet.map(transaction.mapping, transaction.doc);
      },
    },

    props: {
      decorations(state) {
        return prismPlugin.getState(state);
      },
    },
  });

  return prismPlugin;
}
