'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

interface MarkdownProps {
  content: string;
  isStreaming?: boolean;
  className?: string;
}

export function Markdown({ content, isStreaming = false, className }: MarkdownProps) {
  const [displayContent, setDisplayContent] = useState('');
  const [streamingIndex, setStreamingIndex] = useState(0);

  // Handle streaming effect
  useEffect(() => {
    if (!isStreaming) {
      setDisplayContent(content);
      return;
    }

    // Reset streaming when content changes
    setStreamingIndex(0);
    setDisplayContent('');
  }, [content, isStreaming]);

  // Simulate streaming effect
  useEffect(() => {
    if (!isStreaming || !content) return;

    if (streamingIndex < content.length) {
      const timeout = setTimeout(() => {
        setDisplayContent(content.substring(0, streamingIndex + 1));
        setStreamingIndex(streamingIndex + 1);
      }, 10); // Adjust speed as needed

      return () => clearTimeout(timeout);
    }
  }, [content, isStreaming, streamingIndex]);

  // Simple markdown formatting (can be enhanced as needed)
  const formatContent = (text: string) => {
    // Basic markdown replacements
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
      .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italic
      .replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>') // Inline code
      .replace(/\n/g, '<br />'); // Line breaks
  };

  return (
    <div 
      className={cn('prose dark:prose-invert max-w-none', className)}
      dangerouslySetInnerHTML={{ __html: formatContent(displayContent) }}
    />
  );
}
