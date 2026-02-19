"use client";

import { Editor } from "@tiptap/react";
import { Bold, Code, Italic, Link, Strikethrough, Underline } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import styles from "./post-editor.module.scss";

interface FloatingTextMenuProps {
  editor: Editor | null;
}

interface BubblePosition {
  top: number;
  left: number;
}

const FloatingTextMenu = ({ editor }: FloatingTextMenuProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<BubblePosition>({ top: 0, left: 0 });

  const updatePosition = useCallback(() => {
    if (!editor || !editor.isEditable) {
      setIsVisible(false);
      return;
    }

    const { from, to, empty } = editor.state.selection;
    if (empty || from === to) {
      setIsVisible(false);
      return;
    }

    const start = editor.view.coordsAtPos(from);
    const end = editor.view.coordsAtPos(to);

    setPosition({
      left: (start.left + end.left) / 2,
      top: Math.min(start.top, end.top) - 12,
    });
    setIsVisible(true);
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    const handleBlur = () => setIsVisible(false);

    updatePosition();

    editor.on("selectionUpdate", updatePosition);
    editor.on("transaction", updatePosition);
    editor.on("blur", handleBlur);

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);

    return () => {
      editor.off("selectionUpdate", updatePosition);
      editor.off("transaction", updatePosition);
      editor.off("blur", handleBlur);
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [editor, updatePosition]);

  if (!editor) {
    return null;
  }

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={styles.bubbleMenuContainer}
      style={{ top: position.top, left: position.left }}
      onMouseDown={(event) => event.preventDefault()}
    >
      <div className={styles.bubbleMenu}>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${styles.bubbleButton} ${editor.isActive("bold") ? styles.active : ""}`}
          title="Bold"
          type="button"
        >
          <Bold />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${styles.bubbleButton} ${editor.isActive("italic") ? styles.active : ""}`}
          title="Italic"
          type="button"
        >
          <Italic />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`${styles.bubbleButton} ${editor.isActive("underline") ? styles.active : ""}`}
          title="Underline"
          type="button"
        >
          <Underline />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`${styles.bubbleButton} ${editor.isActive("strike") ? styles.active : ""}`}
          title="Strikethrough"
          type="button"
        >
          <Strikethrough />
        </button>
        <span className={styles.bubbleSeparator} />
        <button
          onClick={setLink}
          className={`${styles.bubbleButton} ${editor.isActive("link") ? styles.active : ""}`}
          title="Link"
          type="button"
        >
          <Link />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`${styles.bubbleButton} ${editor.isActive("code") ? styles.active : ""}`}
          title="Inline code"
          type="button"
        >
          <Code />
        </button>
      </div>
    </div>
  );
};

export default FloatingTextMenu;
