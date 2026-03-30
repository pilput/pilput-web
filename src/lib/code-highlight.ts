import Prism from "prismjs";

import "prismjs/components/prism-markup";
import "prismjs/components/prism-css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-json";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-python";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";

import "prismjs/themes/prism-tomorrow.css";

const LANG_ALIASES: Record<string, string> = {
  code: "plaintext",
  txt: "plaintext",
  text: "plaintext",
  plain: "plaintext",
  js: "javascript",
  jsx: "jsx",
  mjs: "javascript",
  cjs: "javascript",
  ts: "typescript",
  tsx: "tsx",
  py: "python",
  md: "markdown",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  yml: "plaintext",
  yaml: "plaintext",
  html: "markup",
  xml: "markup",
  svg: "markup",
  vue: "markup",
};

/**
 * Resolve fenced / class language to a Prism grammar id, or "plaintext".
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

function hasPrismGrammar(lang: string): boolean {
  return Boolean(
    lang &&
      lang !== "plaintext" &&
      typeof Prism.languages[lang] === "object"
  );
}

/**
 * Human-readable label for UI (post header, chat). Mirrors previous detectLanguage behavior.
 */
export function formatLanguageLabel(resolvedPrismLang: string, rawFromClass?: string): string {
  if (resolvedPrismLang === "markup") {
    const r = rawFromClass?.toLowerCase();
    if (r === "html" || r === "xml" || r === "svg" || r === "vue") return r;
    return "markup";
  }
  if (resolvedPrismLang === "bash") return "shell";
  if (resolvedPrismLang === "plaintext" || !resolvedPrismLang) return "code";
  return resolvedPrismLang;
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
 * Highlight a `<code>` element inside `<pre>` (post HTML hydration).
 */
export function highlightCodeElement(code: HTMLElement): void {
  if (code.dataset.prismHighlighted === "true") {
    return;
  }

  const lang = resolveHighlightLanguage(code.className, code.getAttribute("data-language"));
  const source = code.textContent ?? "";

  if (!source.trim()) {
    code.dataset.prismHighlighted = "true";
    return;
  }

  const grammarLang = hasPrismGrammar(lang) ? lang : "plaintext";

  if (grammarLang === "plaintext") {
    code.textContent = source;
    code.dataset.prismHighlighted = "true";
    return;
  }

  try {
    const grammar = Prism.languages[grammarLang];
    code.innerHTML = Prism.highlight(source, grammar, grammarLang);
    code.dataset.prismHighlighted = "true";
  } catch {
    code.textContent = source;
    code.dataset.prismHighlighted = "true";
  }
}

