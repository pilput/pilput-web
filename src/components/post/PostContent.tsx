"use client";

import {
  extractRawLanguageSlug,
  formatLanguageLabel,
  highlightCodeElement,
  resolveHighlightLanguage,
} from "@/lib/code-highlight";
import { sanitizeHtml } from "@/utils/sanitize";
import { useEffect, useMemo, useRef } from "react";
import styles from "./post-content.module.scss";

interface PostContentProps {
  html: string;
  className?: string;
}

const PostContent = ({ html, className }: PostContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const safeHtml = useMemo(() => sanitizeHtml(html), [html]);

  useEffect(() => {
    const container = contentRef.current;
    if (!container) {
      return;
    }

    // Delegated so the handler survives effect re-runs (e.g. StrictMode),
    // where already-enhanced blocks are skipped below.
    const handleClick = async (event: MouseEvent) => {
      const copyButton = (event.target as Element | null)?.closest<HTMLButtonElement>(
        "button[data-code-copy]"
      );
      if (!copyButton || !container.contains(copyButton)) {
        return;
      }

      const code = copyButton
        .closest(`.${styles.codeBlockShell}`)
        ?.querySelector("pre code");
      const codeText = code?.textContent ?? "";
      if (!codeText.trim()) {
        return;
      }

      try {
        await navigator.clipboard.writeText(codeText);
        copyButton.textContent = "Copied";
      } catch {
        copyButton.textContent = "Failed";
      }
      window.setTimeout(() => {
        copyButton.textContent = "Copy";
      }, 1400);
    };

    container.addEventListener("click", handleClick);

    const preBlocks = Array.from(container.querySelectorAll("pre"));

    preBlocks.forEach((pre) => {
      if (pre.dataset.enhanced === "true") {
        return;
      }

      const code = pre.querySelector("code");
      if (!code || !(code instanceof HTMLElement)) {
        return;
      }

      highlightCodeElement(code, "bash");

      const wrapper = document.createElement("div");
      wrapper.className = styles.codeBlockShell;

      const header = document.createElement("div");
      header.className = styles.codeBlockHeader;

      const language = document.createElement("span");
      language.className = styles.codeLanguage;
      const raw = extractRawLanguageSlug(
        code.className,
        code.getAttribute("data-language")
      );
      const resolved = resolveHighlightLanguage(
        code.className,
        code.getAttribute("data-language")
      );
      language.textContent = formatLanguageLabel(resolved, raw);

      const copyButton = document.createElement("button");
      copyButton.className = styles.codeCopyButton;
      copyButton.type = "button";
      copyButton.textContent = "Copy";
      copyButton.dataset.codeCopy = "";
      copyButton.setAttribute("aria-label", "Copy code to clipboard");

      header.appendChild(language);
      header.appendChild(copyButton);

      const parent = pre.parentElement;
      if (!parent) {
        return;
      }

      parent.insertBefore(wrapper, pre);
      wrapper.appendChild(header);
      wrapper.appendChild(pre);
      pre.dataset.enhanced = "true";
    });

    return () => {
      container.removeEventListener("click", handleClick);
    };
  }, [safeHtml]);

  return (
    <div className={className}>
      <div ref={contentRef} dangerouslySetInnerHTML={{ __html: safeHtml }} />
    </div>
  );
};

export default PostContent;
