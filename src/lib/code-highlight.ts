import { createLowlight } from "lowlight";
import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import css from "highlight.js/lib/languages/css";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import markdown from "highlight.js/lib/languages/markdown";
import plaintext from "highlight.js/lib/languages/plaintext";
import python from "highlight.js/lib/languages/python";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";

import "highlight.js/styles/github-dark.css";

const grammars = {
  javascript,
  typescript,
  css,
  json,
  bash,
  xml,
  markdown,
  python,
  plaintext,
} as const;

export const lowlight = createLowlight(grammars);

hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("css", css);
hljs.registerLanguage("json", json);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("markdown", markdown);
hljs.registerLanguage("python", python);
hljs.registerLanguage("plaintext", plaintext);
hljs.registerLanguage("js", javascript);
hljs.registerLanguage("ts", typescript);
hljs.registerLanguage("shell", bash);
hljs.registerLanguage("sh", bash);
hljs.registerLanguage("html", xml);

const LANG_ALIASES: Record<string, string> = {
  code: "plaintext",
  txt: "plaintext",
  text: "plaintext",
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
  yml: "plaintext",
  yaml: "plaintext",
  vue: "xml",
  svg: "xml",
};

export function resolveHighlightLanguage(
  className: string,
  dataLanguage?: string | null
): string {
  const haystack = `${className} ${dataLanguage ?? ""}`;
  const match = /(?:language|lang)-([a-z0-9+#-]+)/i.exec(haystack);
  const raw = match?.[1]?.toLowerCase() ?? "plaintext";
  return LANG_ALIASES[raw] ?? raw;
}

export function highlightCodeElement(code: HTMLElement): void {
  if (code.classList.contains("hljs")) {
    return;
  }
  const lang = resolveHighlightLanguage(code.className, code.getAttribute("data-language"));
  const source = code.textContent ?? "";
  if (!source.trim()) {
    code.classList.add("hljs");
    return;
  }
  const resolved = hljs.getLanguage(lang) ? lang : "plaintext";
  try {
    const { value } = hljs.highlight(source, {
      language: resolved,
      ignoreIllegals: true,
    });
    code.innerHTML = value;
    code.classList.add("hljs");
  } catch {
    code.classList.add("hljs");
  }
}
