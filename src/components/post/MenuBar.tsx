"use client";
import { Editor } from "@tiptap/react";
import {
  Bold,
  Code,
  Italic,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
  Underline,
  Image,
  Heading1,
  Heading2,
  Heading3,
  Minus,
} from "lucide-react";

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null;
  }

  const addYoutubeVideo = () => {
    const url = prompt("Enter YouTube URL");

    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: Math.max(320, parseInt("600", 10)) || 640,
        height: Math.max(180, parseInt("300", 10)) || 480,
      });
    }
  };

  function addImage() {
    const url = window.prompt("Enter image URL");

    if (url) {
      if (editor) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    }
  }

  const setHeading = (level: 1 | 2 | 3) => {
    editor.chain().focus().toggleHeading({ level }).run();
  };

  return (
    <div className="px-2 flex flex-wrap gap-1 bg-gray-100 dark:bg-gray-800 py-3 rounded-2xl shadow-xl my-3 border dark:border-gray-700">
      {/* Text formatting */}
      <button
        onClick={() => editor.commands.toggleBold()}
        className={`${
          editor?.isActive("bold") ? "bg-gray-200 dark:bg-gray-700" : ""
        } p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg`}
        title="Bold"
      >
        <Bold size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${
          editor?.isActive("italic") ? "bg-gray-200 dark:bg-gray-700" : ""
        } p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg`}
        title="Italic"
      >
        <Italic size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`${
          editor?.isActive("underline") ? "bg-gray-200 dark:bg-gray-700" : ""
        } p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg`}
        title="Underline"
      >
        <Underline size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`${
          editor?.isActive("strike") ? "bg-gray-200 dark:bg-gray-700" : ""
        } p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg`}
        title="Strikethrough"
      >
        <Strikethrough size={18} />
      </button>

      {/* Headings */}
      <button
        onClick={() => setHeading(1)}
        className={`${
          editor?.isActive("heading", { level: 1 }) ? "bg-gray-200 dark:bg-gray-700" : ""
        } p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg`}
        title="Heading 1"
      >
        <Heading1 size={18} />
      </button>
      <button
        onClick={() => setHeading(2)}
        className={`${
          editor?.isActive("heading", { level: 2 }) ? "bg-gray-200 dark:bg-gray-700" : ""
        } p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg`}
        title="Heading 2"
      >
        <Heading2 size={18} />
      </button>
      <button
        onClick={() => setHeading(3)}
        className={`${
          editor?.isActive("heading", { level: 3 }) ? "bg-gray-200 dark:bg-gray-700" : ""
        } p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg`}
        title="Heading 3"
      >
        <Heading3 size={18} />
      </button>

      {/* Lists */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${
          editor?.isActive("bulletList") ? "bg-gray-200 dark:bg-gray-700" : ""
        } p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg`}
        title="Bullet List"
      >
        <List size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`${
          editor?.isActive("orderedList") ? "bg-gray-200 dark:bg-gray-700" : ""
        } p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg`}
        title="Ordered List"
      >
        <ListOrdered size={18} />
      </button>

      {/* Blocks */}
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`${
          editor?.isActive("blockquote") ? "bg-gray-200 dark:bg-gray-700" : ""
        } p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg`}
        title="Blockquote"
      >
        <Quote size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`${
          editor?.isActive("codeBlock") ? "bg-gray-200 dark:bg-gray-700" : ""
        } p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg`}
        title="Code Block"
      >
        <Code size={18} />
      </button>
      <button
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
        title="Horizontal Rule"
      >
        <Minus size={18} />
      </button>

      {/* Media */}
      <button
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
        onClick={addImage}
        title="Insert Image"
      >
        <Image size={18} />
      </button>
      <button
        onClick={addYoutubeVideo}
        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg"
        title="Insert YouTube Video"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
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
  );
};

export default MenuBar;
