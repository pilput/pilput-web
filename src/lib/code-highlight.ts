import hljs from "highlight.js/lib/core";
import type { LanguageFn } from "highlight.js";
import bash from "highlight.js/lib/languages/bash";
import css from "highlight.js/lib/languages/css";
import diff from "highlight.js/lib/languages/diff";
import go from "highlight.js/lib/languages/go";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import markdown from "highlight.js/lib/languages/markdown";
import python from "highlight.js/lib/languages/python";
import rust from "highlight.js/lib/languages/rust";
import sql from "highlight.js/lib/languages/sql";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";

import { escapeHtml } from "@/utils/sanitize";

import "highlight.js/styles/tomorrow-night-bright.css";

/**
 * Grammars shared by the post viewer / chat (highlight.js) and the TipTap
 * editor (lowlight). Register new languages here so both stay in sync.
 */
export const HIGHLIGHT_LANGUAGES: Record<string, LanguageFn> = {
  bash,
  css,
  diff,
  go,
  javascript,
  json,
  markdown,
  python,
  rust,
  sql,
  typescript,
  xml,
  yaml,
};

for (const [name, grammar] of Object.entries(HIGHLIGHT_LANGUAGES)) {
  hljs.registerLanguage(name, grammar);
}

const LANG_ALIASES: Record<string, string> = {
  code: "plaintext",
  txt: "plaintext",
  text: "plaintext",
  plain: "plaintext",
  js: "javascript",
  jsx: "javascript",
  mjs: "javascript",
  cjs: "javascript",
  ts: "typescript",
  tsx: "typescript",
  py: "python",
  md: "markdown",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  yml: "yaml",
  golang: "go",
  rs: "rust",
  patch: "diff",
  html: "xml",
  markup: "xml",
  svg: "xml",
  vue: "xml",
};

/**
 * Resolve fenced / class language to a highlight.js grammar id, or "plaintext".
 */
export function resolveHighlightLanguage(
  className: string,
  dataLanguage?: string | null
): string {
  const haystack = `${className} ${dataLanguage ?? ""}`;
  const match = /(?:language|lang)-([a-z0-9+#-]+)/i.exec(haystack);
  const raw = match?.[1]?.toLowerCase() ?? "plaintext";
  return LANG_ALIASES[raw] ?? raw;
}

function hasHljsGrammar(lang: string): boolean {
  return Boolean(lang && lang !== "plaintext" && hljs.getLanguage(lang));
}

/**
 * Human-readable label for UI (post header, chat). Mirrors previous detectLanguage behavior.
 */
export function formatLanguageLabel(resolvedLang: string, rawFromClass?: string): string {
  if (resolvedLang === "xml") {
    const r = rawFromClass?.toLowerCase();
    if (r === "html" || r === "xml" || r === "svg" || r === "vue") return r;
    return "markup";
  }
  if (resolvedLang === "bash") return "shell";
  if (resolvedLang === "plaintext" || !resolvedLang) return "code";
  return resolvedLang;
}

/**
 * Extract raw language slug from class/data-language for labeling.
 */
export function extractRawLanguageSlug(
  className: string,
  dataLanguage?: string | null
): string | undefined {
  const haystack = `${className} ${dataLanguage ?? ""}`;
  const match = /(?:language|lang)-([a-z0-9+#-]+)/i.exec(haystack);
  return match?.[1]?.toLowerCase();
}

/**
 * Highlight source text directly using highlight.js
 */
export function highlightCode(
  source: string,
  rawLang?: string
): { html: string; language: string } {
  if (!source) {
    return { html: "", language: "plaintext" };
  }
  const resolved = rawLang ? resolveHighlightLanguage(rawLang) : "plaintext";
  const grammarLang = hasHljsGrammar(resolved) ? resolved : "plaintext";

  // The result is rendered via `dangerouslySetInnerHTML`, so un-highlighted
  // source must be escaped (hljs output is already escaped).
  if (grammarLang === "plaintext") {
    return { html: escapeHtml(source), language: "plaintext" };
  }

  try {
    const result = hljs.highlight(source, { language: grammarLang });
    return { html: result.value, language: grammarLang };
  } catch {
    return { html: escapeHtml(source), language: "plaintext" };
  }
}

/**
 * Highlight a `<code>` element inside `<pre>` (post HTML hydration).
 *
 * `fallbackLanguage` is used when the `<code>` element has no
 * `language-xxx` / `lang-xxx` marker on its class or `data-language`
 * attribute. This makes legacy posts — which were saved before the
 * editor attached a default language — still render with highlighting.
 */
export function highlightCodeElement(
  code: HTMLElement,
  fallbackLanguage: string = "plaintext"
): void {
  if (code.dataset.highlighted === "true") {
    return;
  }

  const detected = resolveHighlightLanguage(
    code.className,
    code.getAttribute("data-language")
  );
  const lang =
    detected === "plaintext" && fallbackLanguage
      ? LANG_ALIASES[fallbackLanguage.toLowerCase()] ?? fallbackLanguage.toLowerCase()
      : detected;
  const source = code.textContent ?? "";

  if (!source.trim()) {
    code.dataset.highlighted = "true";
    return;
  }

  const grammarLang = hasHljsGrammar(lang) ? lang : "plaintext";

  if (grammarLang === "plaintext") {
    code.textContent = source;
    code.dataset.highlighted = "true";
    return;
  }

  // Surface the resolved language back onto the element so the header label
  // + any downstream consumers can read it, even when the original HTML
  // didn't carry a `language-xxx` class.
  if (!/(?:language|lang)-/i.test(code.className)) {
    code.classList.add(`language-${grammarLang}`);
  }

  try {
    code.innerHTML = hljs.highlight(source, { language: grammarLang }).value;
    code.classList.add("hljs");
    code.dataset.highlighted = "true";
  } catch {
    code.textContent = source;
    code.dataset.highlighted = "true";
  }
}
