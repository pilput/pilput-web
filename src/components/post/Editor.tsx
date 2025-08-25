"use client";
import { useEditor, EditorContent } from "@tiptap/react";
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
  const editor = useEditor({
    extensions,
    content,
    onUpdate: ({ editor }) => {
      onchange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-lg max-w-none leading-relaxed " +
          "text-gray-900 dark:text-gray-100 " +
          "prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-headings:font-semibold " +
          "prose-h1:text-2xl prose-h1:mb-4 prose-h1:mt-6 " +
          "prose-h2:text-xl prose-h2:mb-3 prose-h2:mt-6 " +
          "prose-h3:text-lg prose-h3:mb-2 prose-h3:mt-4 " +
          "prose-p:text-gray-900 dark:prose-p:text-gray-100 prose-p:mb-4 prose-p:leading-7 " +
          "prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline " +
          "prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-strong:font-semibold " +
          "prose-em:text-gray-800 dark:prose-em:text-gray-200 prose-em:italic " +
          "prose-code:text-sm prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:text-gray-900 dark:prose-code:text-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded " +
          "prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:text-gray-900 dark:prose-pre:text-gray-100 " +
          "prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-700 dark:prose-blockquote:text-gray-300 " +
          "prose-ul:text-gray-900 dark:prose-ul:text-gray-100 " +
          "prose-ol:text-gray-900 dark:prose-ol:text-gray-100 " +
          "prose-li:text-gray-900 dark:prose-li:text-gray-100 focus:outline-none",
      },
    },
    immediatelyRender: false,
  });

  return (
    <div className="w-full">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default Tiptap;
