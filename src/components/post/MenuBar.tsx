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
  Image,
} from "lucide-react";

const MenuBar = () => {
  const { editor } = useCurrentEditor();

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
    const url = window.prompt("URL");

    if (url) {
      if (editor) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    }
  }
  return (
    <div className="px-2 flex space-x-1 bg-gray-100 py-3 rounded-2xl shadow-xl my-3 border">
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
      <button className="p-2 hover:bg-gray-200 rounded-lg" onClick={addImage}>
        <Image />
      </button>
      <button
        onClick={addYoutubeVideo}
        className={`${
          editor?.isActive("strike") ? "outline outline-1" : ""
        } p-2 hover:bg-gray-200 rounded-lg`}
      >
        {/* <Underline /> */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-youtube"
        >
          <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
          <path d="m10 15 5-3-5-3z" />
        </svg>{" "}
      </button>
    </div>
  );
};

export default MenuBar;
