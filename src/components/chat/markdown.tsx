"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Check, Copy, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import "highlight.js/styles/github-dark.css";

interface MarkdownProps {
  content: string;
  isStreaming?: boolean;
  className?: string;
}

// Type for code block props
interface CodeBlockProps extends React.HTMLAttributes<HTMLElement> {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

// Type for blockquote props
interface BlockquoteProps
  extends React.BlockquoteHTMLAttributes<HTMLQuoteElement> {
  children?: React.ReactNode;
}

// Type for table props
interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  children?: React.ReactNode;
}

// Type for table cell props
interface TableCellProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  children?: React.ReactNode;
}

// Type for link props
interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: React.ReactNode;
}

// Type for heading props
interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  node?: any;
  children?: React.ReactNode;
}

// Type for image props
interface ImageProps {
  alt?: string;
  src?: string;
  className?: string;
  [key: string]: any;
}

// Copy button component for code blocks
const CopyButton = ({
  code,
  className,
}: {
  code: string;
  className?: string;
}) => {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<number | null>(null);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);

    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "absolute right-2 top-2 h-7 w-7 rounded-md opacity-0 transition-opacity group-hover:opacity-100",
        className
      )}
      onClick={copyToClipboard}
      aria-label="Copy code to clipboard"
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  );
};

export function Markdown({
  content,
  isStreaming = false,
  className,
}: MarkdownProps) {
  const [displayContent, setDisplayContent] = useState("");
  const [streamingIndex, setStreamingIndex] = useState(0);

  // Handle streaming effect
  useEffect(() => {
    if (!isStreaming) {
      setDisplayContent(content);
      return;
    }
    setStreamingIndex(0);
    setDisplayContent("");
  }, [content, isStreaming]);

  // Simulate streaming effect
  useEffect(() => {
    if (!isStreaming || !content) return;

    if (streamingIndex < content.length) {
      const timeout = setTimeout(() => {
        setDisplayContent((prev) => content.substring(0, streamingIndex + 1));
        setStreamingIndex((prev) => prev + 1);
      }, 5); // Slightly faster typing effect

      return () => clearTimeout(timeout);
    }
  }, [content, isStreaming, streamingIndex]);

  return (
    <div className={cn("prose dark:prose-invert max-w-none", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Customize headings
          h1: ({
            node,
            children,
            ...props
          }: React.HTMLAttributes<HTMLHeadingElement> & { node?: any }) => (
            <h1 className="text-3xl font-bold my-4" {...props}>
              {children}
            </h1>
          ),
          h2: ({
            node,
            children,
            ...props
          }: React.HTMLAttributes<HTMLHeadingElement> & { node?: any }) => (
            <h2 className="text-2xl font-bold my-3" {...props}>
              {children}
            </h2>
          ),
          h3: ({
            node,
            children,
            ...props
          }: React.HTMLAttributes<HTMLHeadingElement> & { node?: any }) => (
            <h3 className="text-xl font-semibold my-2" {...props}>
              {children}
            </h3>
          ),
          h4: ({
            node,
            children,
            ...props
          }: React.HTMLAttributes<HTMLHeadingElement> & { node?: any }) => (
            <h4 className="text-lg font-semibold my-2" {...props}>
              {children}
            </h4>
          ),
          h5: ({
            node,
            children,
            ...props
          }: React.HTMLAttributes<HTMLHeadingElement> & { node?: any }) => (
            <h5 className="text-base font-medium my-1" {...props}>
              {children}
            </h5>
          ),
          h6: ({
            node,
            children,
            ...props
          }: React.HTMLAttributes<HTMLHeadingElement> & { node?: any }) => (
            <h6 className="text-sm font-medium my-1" {...props}>
              {children}
            </h6>
          ),
          // Customize code blocks
          code: ({
            node,
            inline,
            className,
            children,
            ...props
          }: CodeBlockProps) => {
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";
            const code = String(children).replace(/\n$/, "");

            if (inline) {
              return (
                <code className="bg-muted rounded px-1.5 py-0.5 text-sm font-mono">
                  {children}
                </code>
              );
            }

            return (
              <div className="relative my-4 rounded-md border bg-muted/50">
                <div className="flex items-center justify-between rounded-t-md border-b bg-muted/50 px-4 py-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Terminal className="h-3.5 w-3.5" />
                    {language || "code"}
                  </div>
                  <CopyButton code={code} />
                </div>
                <pre className="overflow-x-auto p-4">
                  <code className={className} {...props}>
                    {children}
                  </code>
                </pre>
              </div>
            );
          },
          // Customize blockquotes
          blockquote: ({ children, ...props }: BlockquoteProps) => {
            return (
              <blockquote className="border-l-4 border-primary/50 bg-muted/30 pl-4 py-1 my-2 italic">
                {children}
              </blockquote>
            );
          },
          // Customize tables
          table: ({ children, ...props }: TableProps) => {
            return (
              <div className="my-4 overflow-x-auto">
                <table className="w-full border-collapse">{children}</table>
              </div>
            );
          },
          // Customize table cells
          th: ({ children, ...props }: TableCellProps) => {
            return (
              <th className="border px-4 py-2 text-left font-semibold bg-muted/50">
                {children}
              </th>
            );
          },
          td: ({ children, ...props }: TableCellProps) => {
            return <td className="border px-4 py-2">{children}</td>;
          },
          // Customize links
          a: ({ children, ...props }: LinkProps) => {
            return (
              <a
                {...props}
                className="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            );
          },
          // Customize images
          img: (props: ImageProps) => {
            const { alt, src, className = "", ...rest } = props;
            return (
              <div className="my-4 overflow-hidden rounded-lg border">
                <img
                  src={src}
                  alt={alt}
                  className={`w-full h-auto object-contain max-h-[500px] ${className}`}
                  loading="lazy"
                  {...rest}
                />
                {alt && (
                  <p className="text-center text-sm text-muted-foreground mt-2">
                    {alt}
                  </p>
                )}
              </div>
            );
          },
        }}
      >
        {displayContent}
      </ReactMarkdown>
    </div>
  );
}
