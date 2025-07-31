// import "@/titptap.scss";
// src/Tiptap.jsx
"use client";
import { EditorProvider } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Undelineextention from "@tiptap/extension-underline";
import Youtube from "@tiptap/extension-youtube";
import MenuBar from "./MenuBar";
import Image from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extension-placeholder";

// define your extension array
const extensions = [
  StarterKit.configure({
    paragraph: {
      HTMLAttributes: {
        class: "my-custom-paragraph",
      },
    },
    hardBreak: {
      keepMarks: false,
      HTMLAttributes: {
        class: "my-custom-break",
      },
    },
  }),
  Undelineextention,
  Youtube,
  Placeholder.configure({
    placeholder: "Write something …",
  }),
  Image,
];

const Tiptap = ({
  content,
  onchange,
}: {
  content: string;
  onchange: (data: string) => void;
}) => {
  return (
    <div className="w-full">
      <EditorProvider
        editorProps={{
          attributes: {
            class:
              "w-full prose prose-sm sm:prose lg:prose-lg !max-w-none prose prose-slate max-w-none focus:outline-none " +
              "prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-headings:font-bold " +
              "prose-h1:text-2xl prose-h1:mb-4 prose-h1:mt-2 " +
              "prose-h2:text-xl prose-h2:mb-3 prose-h2:mt-6 " +
              "prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4 " +
              "prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-strong:font-semibold " +
              "prose-em:text-gray-700 dark:prose-em:text-gray-300 prose-em:italic " +
              "prose-code:px-1 prose-code:py-0.5 " +
              "prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:text-green-500 " +
              "prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:underline hover:prose-a:text-blue-800 dark:hover:prose-a:text-blue-300 " +
              "prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600 " +
              "prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400 " +
              "prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-4 " +
              "prose-ol:list-decimal prose-ol:pl-6 prose-ol:mb-4 " +
              "prose-li:mb-1 prose-li:text-gray-700 dark:prose-li:text-gray-300",
          },
          handleKeyDown: (view, event) => {
            // Ensure Enter key creates new paragraphs
            if (event.key === "Enter" && !event.shiftKey) {
              return false; // Let Tiptap handle it normally
            }
            // Shift+Enter creates hard breaks
            if (event.key === "Enter" && event.shiftKey) {
              return false; // Let Tiptap handle it normally
            }
            return false;
          },
        }}
        onUpdate={(props) => {
          onchange(props.editor.getHTML());
        }}
        editable={true}
        slotBefore={<MenuBar />}
        extensions={extensions}
        content={content}
      ></EditorProvider>
    </div>
  );
};

export default Tiptap;
