"use client";

import { Editor } from "@tiptap/react";
import {
  Code2,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Minus,
  Pilcrow,
  Quote,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import styles from "./post-editor.module.scss";

interface SlashCommandMenuProps {
  editor: Editor | null;
}

interface SlashCommandItem {
  id: string;
  label: string;
  description: string;
  icon: typeof Pilcrow;
  run: (editor: Editor) => void;
}

interface SlashPosition {
  top: number;
  left: number;
}

const SLASH_COMMANDS: SlashCommandItem[] = [
  {
    id: "text",
    label: "Text",
    description: "Regular paragraph",
    icon: Pilcrow,
    run: (editor) => {
      editor.chain().focus().setParagraph().run();
    },
  },
  {
    id: "h1",
    label: "Heading 1",
    description: "Large section heading",
    icon: Heading1,
    run: (editor) => {
      editor.chain().focus().toggleHeading({ level: 1 }).run();
    },
  },
  {
    id: "h2",
    label: "Heading 2",
    description: "Medium section heading",
    icon: Heading2,
    run: (editor) => {
      editor.chain().focus().toggleHeading({ level: 2 }).run();
    },
  },
  {
    id: "h3",
    label: "Heading 3",
    description: "Small section heading",
    icon: Heading3,
    run: (editor) => {
      editor.chain().focus().toggleHeading({ level: 3 }).run();
    },
  },
  {
    id: "bullet-list",
    label: "Bullet List",
    description: "Create unordered list",
    icon: List,
    run: (editor) => {
      editor.chain().focus().toggleBulletList().run();
    },
  },
  {
    id: "ordered-list",
    label: "Numbered List",
    description: "Create ordered list",
    icon: ListOrdered,
    run: (editor) => {
      editor.chain().focus().toggleOrderedList().run();
    },
  },
  {
    id: "quote",
    label: "Quote",
    description: "Insert blockquote",
    icon: Quote,
    run: (editor) => {
      editor.chain().focus().toggleBlockquote().run();
    },
  },
  {
    id: "code",
    label: "Code Block",
    description: "Insert code block",
    icon: Code2,
    run: (editor) => {
      editor.chain().focus().toggleCodeBlock().run();
    },
  },
  {
    id: "divider",
    label: "Divider",
    description: "Insert horizontal line",
    icon: Minus,
    run: (editor) => {
      editor.chain().focus().setHorizontalRule().run();
    },
  },
];

const SlashCommandMenu = ({ editor }: SlashCommandMenuProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<SlashPosition>({ top: 0, left: 0 });
  const [query, setQuery] = useState("");
  const [range, setRange] = useState<{ from: number; to: number } | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const filteredCommands = useMemo(() => {
    if (!query.trim()) return SLASH_COMMANDS;
    const q = query.toLowerCase();
    return SLASH_COMMANDS.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    );
  }, [query]);

  const closeMenu = useCallback(() => {
    setIsVisible(false);
    setQuery("");
    setRange(null);
    setActiveIndex(0);
  }, []);

  const updateSlashState = useCallback(() => {
    if (!editor || !editor.isEditable) {
      closeMenu();
      return;
    }

    const { selection } = editor.state;
    if (!selection.empty) {
      closeMenu();
      return;
    }

    const { $from, from } = selection;
    const parentText = $from.parent.textContent;
    const textBefore = parentText.slice(0, $from.parentOffset);
    const match = textBefore.match(/^\/([^/]*)$/);

    if (!match) {
      closeMenu();
      return;
    }

    const commandQuery = match[1] ?? "";
    const start = from - match[0].length;
    const end = from;
    const coords = editor.view.coordsAtPos(from);

    setQuery(commandQuery);
    setRange({ from: start, to: end });
    setPosition({
      left: coords.left,
      top: coords.bottom + 8,
    });
    setIsVisible(true);
  }, [closeMenu, editor]);

  const applyCommand = useCallback(
    (command: SlashCommandItem) => {
      if (!editor || !range) return;
      editor.chain().focus().deleteRange(range).run();
      command.run(editor);
      closeMenu();
    },
    [closeMenu, editor, range]
  );

  useEffect(() => {
    if (!editor) return;

    updateSlashState();
    editor.on("selectionUpdate", updateSlashState);
    editor.on("transaction", updateSlashState);
    editor.on("blur", closeMenu);

    window.addEventListener("resize", updateSlashState);
    window.addEventListener("scroll", updateSlashState, true);

    return () => {
      editor.off("selectionUpdate", updateSlashState);
      editor.off("transaction", updateSlashState);
      editor.off("blur", closeMenu);
      window.removeEventListener("resize", updateSlashState);
      window.removeEventListener("scroll", updateSlashState, true);
    };
  }, [closeMenu, editor, updateSlashState]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query, isVisible]);

  useEffect(() => {
    if (!editor) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (!isVisible) return;

      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (!filteredCommands.length) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setActiveIndex((prev) => (prev + 1) % filteredCommands.length);
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setActiveIndex((prev) =>
          (prev - 1 + filteredCommands.length) % filteredCommands.length
        );
      }

      if (event.key === "Enter") {
        event.preventDefault();
        applyCommand(filteredCommands[activeIndex] ?? filteredCommands[0]);
      }
    };

    const editorDom = editor.view.dom;
    editorDom.addEventListener("keydown", onKeyDown);
    return () => {
      editorDom.removeEventListener("keydown", onKeyDown);
    };
  }, [activeIndex, applyCommand, closeMenu, editor, filteredCommands, isVisible]);

  if (!isVisible || !editor) {
    return null;
  }

  return (
    <div className={styles.slashMenu} style={{ top: position.top, left: position.left }}>
      {filteredCommands.length ? (
        filteredCommands.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              className={`${styles.slashItem} ${index === activeIndex ? styles.active : ""}`}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => applyCommand(item)}
            >
              <span className={styles.slashIcon}>
                <Icon />
              </span>
              <span className={styles.slashContent}>
                <span className={styles.slashLabel}>{item.label}</span>
                <span className={styles.slashDescription}>{item.description}</span>
              </span>
            </button>
          );
        })
      ) : (
        <div className={styles.slashEmpty}>No matching command</div>
      )}
    </div>
  );
};

export default SlashCommandMenu;
