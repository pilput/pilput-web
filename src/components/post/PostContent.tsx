"use client";

import {
  extractRawLanguageSlug,
  formatLanguageLabel,
  highlightCodeElement,
  resolveHighlightLanguage,
} from "@/lib/code-highlight";
import { useEffect, useRef } from "react";
import styles from "./post-content.module.scss";

interface PostContentProps {
  html: string;
  className?: string;
}

const PostContent = ({ html, className }: PostContentProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = contentRef.current;
    if (!container) {
      return;
    }

    const cleanups: Array<() => void> = [];
    const preBlocks = Array.from(container.querySelectorAll("pre"));

    preBlocks.forEach((pre) => {
      if (pre.dataset.enhanced === "true") {
        return;
      }

      const code = pre.querySelector("code");
      if (!code || !(code instanceof HTMLElement)) {
        return;
      }

      highlightCodeElement(code);

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
      copyButton.setAttribute("aria-label", "Copy code to clipboard");

      const clickHandler = async () => {
        const codeText = code.textContent ?? "";
        if (!codeText.trim()) {
          return;
        }

        try {
          await navigator.clipboard.writeText(codeText);
          copyButton.textContent = "Copied";
          window.setTimeout(() => {
            copyButton.textContent = "Copy";
          }, 1400);
        } catch {
          copyButton.textContent = "Failed";
          window.setTimeout(() => {
            copyButton.textContent = "Copy";
          }, 1400);
        }
      };

      copyButton.addEventListener("click", clickHandler);
      cleanups.push(() => copyButton.removeEventListener("click", clickHandler));

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
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [html]);

  return (
    <div className={className}>
      <div ref={contentRef} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
};

export default PostContent;
