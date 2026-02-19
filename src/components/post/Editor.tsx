"use client";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Youtube from "@tiptap/extension-youtube";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { CharacterCount } from "@tiptap/extension-character-count";
import { Placeholder } from "@tiptap/extension-placeholder";
import MenuBar from "./MenuBar";
import styles from "./post-editor.module.scss";

interface TiptapProps {
  content: string;
  onchange: (data: string) => void;
  placeholder?: string;
  maxLength?: number;
}

const Tiptap = ({
  content,
  onchange,
  placeholder = "Start writing your amazing post...",
  maxLength = 50000,
}: TiptapProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Youtube.configure({
        controls: true,
        nocookie: true,
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: "rounded-lg max-w-full",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      CharacterCount.configure({
        limit: maxLength,
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onchange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-lg max-w-none",
      },
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  const characterCount = editor.storage.characterCount;
  const percentage = Math.round((characterCount.characters() / maxLength) * 100);

  return (
    <div className={styles.editorWrapper}>
      <MenuBar editor={editor} />
      <div className={styles.editorContent}>
        <EditorContent editor={editor} />
      </div>
      <div className={styles.editorFooter}>
        <span className={styles.wordCount}>
          {characterCount.words()} words
        </span>
        <span className={styles.charLimit}>
          {characterCount.characters()} / {maxLength.toLocaleString()} characters
          {percentage > 80 && (
            <span style={{ marginLeft: 8, color: percentage > 95 ? "oklch(0.6 0.2 25)" : "oklch(0.7 0.15 70)" }}>
              ({percentage}%)
            </span>
          )}
        </span>
      </div>
    </div>
  );
};

export default Tiptap;