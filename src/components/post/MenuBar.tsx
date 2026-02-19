"use client";
import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  Image,
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Undo,
  Redo,
  RemoveFormatting,
} from "lucide-react";
import styles from "./editor.module.scss";

interface MenuBarProps {
  editor: Editor | null;
}

const MenuBar = ({ editor }: MenuBarProps) => {
  if (!editor) {
    return null;
  }

  const addYoutubeVideo = () => {
    const url = prompt("Enter YouTube URL");
    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: 640,
        height: 360,
      });
    }
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

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

  return (
    <div className={styles.menuBar}>
      {/* History Group */}
      <div className={styles.menuGroup}>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className={styles.menuButton}
          title="Undo"
        >
          <Undo />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className={styles.menuButton}
          title="Redo"
        >
          <Redo />
        </button>
      </div>

      <div className={styles.separator} />

      {/* Text Formatting Group */}
      <div className={styles.menuGroup}>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`${styles.menuButton} ${editor.isActive("bold") ? styles.active : ""}`}
          title="Bold (Ctrl+B)"
        >
          <Bold />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`${styles.menuButton} ${editor.isActive("italic") ? styles.active : ""}`}
          title="Italic (Ctrl+I)"
        >
          <Italic />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`${styles.menuButton} ${editor.isActive("underline") ? styles.active : ""}`}
          title="Underline (Ctrl+U)"
        >
          <Underline />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`${styles.menuButton} ${editor.isActive("strike") ? styles.active : ""}`}
          title="Strikethrough"
        >
          <Strikethrough />
        </button>
      </div>

      <div className={styles.separator} />

      {/* Headings Group */}
      <div className={styles.menuGroup}>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`${styles.menuButton} ${editor.isActive("heading", { level: 1 }) ? styles.active : ""}`}
          title="Heading 1"
        >
          <Heading1 />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`${styles.menuButton} ${editor.isActive("heading", { level: 2 }) ? styles.active : ""}`}
          title="Heading 2"
        >
          <Heading2 />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`${styles.menuButton} ${editor.isActive("heading", { level: 3 }) ? styles.active : ""}`}
          title="Heading 3"
        >
          <Heading3 />
        </button>
      </div>

      <div className={styles.separator} />

      {/* Lists Group */}
      <div className={styles.menuGroup}>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`${styles.menuButton} ${editor.isActive("bulletList") ? styles.active : ""}`}
          title="Bullet List"
        >
          <List />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`${styles.menuButton} ${editor.isActive("orderedList") ? styles.active : ""}`}
          title="Ordered List"
        >
          <ListOrdered />
        </button>
      </div>

      <div className={styles.separator} />

      {/* Alignment Group */}
      <div className={styles.menuGroup}>
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`${styles.menuButton} ${editor.isActive({ textAlign: "left" }) ? styles.active : ""}`}
          title="Align Left"
        >
          <AlignLeft />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`${styles.menuButton} ${editor.isActive({ textAlign: "center" }) ? styles.active : ""}`}
          title="Align Center"
        >
          <AlignCenter />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`${styles.menuButton} ${editor.isActive({ textAlign: "right" }) ? styles.active : ""}`}
          title="Align Right"
        >
          <AlignRight />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={`${styles.menuButton} ${editor.isActive({ textAlign: "justify" }) ? styles.active : ""}`}
          title="Justify"
        >
          <AlignJustify />
        </button>
      </div>

      <div className={styles.separator} />

      {/* Blocks Group */}
      <div className={styles.menuGroup}>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`${styles.menuButton} ${editor.isActive("blockquote") ? styles.active : ""}`}
          title="Blockquote"
        >
          <Quote />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`${styles.menuButton} ${editor.isActive("codeBlock") ? styles.active : ""}`}
          title="Code Block"
        >
          <Code />
        </button>
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={styles.menuButton}
          title="Horizontal Rule"
        >
          <Minus />
        </button>
      </div>

      <div className={styles.separator} />

      {/* Media Group */}
      <div className={styles.menuGroup}>
        <button
          onClick={setLink}
          className={`${styles.menuButton} ${editor.isActive("link") ? styles.active : ""}`}
          title="Add/Edit Link"
        >
          <Link />
        </button>
        <button onClick={addImage} className={styles.menuButton} title="Insert Image">
          <Image />
        </button>
        <button onClick={addYoutubeVideo} className={styles.menuButton} title="Insert YouTube Video">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
            <path d="m10 15 5-3-5-3z" />
          </svg>
        </button>
      </div>

      <div className={styles.separator} />

      {/* Clear Formatting */}
      <div className={styles.menuGroup}>
        <button
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          className={styles.menuButton}
          title="Clear Formatting"
        >
          <RemoveFormatting />
        </button>
      </div>
    </div>
  );
};

export default MenuBar;