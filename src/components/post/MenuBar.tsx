"use client";
import { useCurrentEditor } from "@tiptap/react";
import {
  Bold,
  Code,
  Italic,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
  Underline,
} from "lucide-react";

const MenuBar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }
  return (
    <div className="px-3 flex space-x-1 bg-gray-100 py-4">
      <button
        onClick={() => editor.commands.toggleBold()}
        className={`${
          editor?.isActive("bold") ? "outline outline-1" : ""
        } p-2 hover:bg-gray-200 rounded-lg`}
      >
        <Bold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`${
          editor?.isActive("bulletList") ? "outline outline-1" : ""
        } p-2 hover:bg-gray-200 rounded-lg`}
      >
        <List />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`${
          editor?.isActive("orderedList") ? "outline outline-1" : ""
        } p-2 hover:bg-gray-200 rounded-lg`}
      >
        <ListOrdered />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`${
          editor?.isActive("blockquote") ? "outline outline-1" : ""
        } p-2 hover:bg-gray-200 rounded-lg`}
      >
        <Quote />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`${
          editor?.isActive("codeBlock") ? "outline outline-1" : ""
        } p-2 hover:bg-gray-200 rounded-lg`}
      >
        <Code />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`${
          editor?.isActive("italic") ? "outline outline-1" : ""
        } p-2 hover:bg-gray-200 rounded-lg`}
      >
        <Italic />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={`${
          editor?.isActive("strike") ? "outline outline-1" : ""
        } p-2 hover:bg-gray-200 rounded-lg`}
      >
        <Strikethrough />
      </button>
      <button
        onClick={() => editor.commands.toggleUnderline()}
        className={`${
          editor?.isActive("strike") ? "outline outline-1" : ""
        } p-2 hover:bg-gray-200 rounded-lg`}
      >
        <Underline />
      </button>
    </div>
  );
};

export default MenuBar;
