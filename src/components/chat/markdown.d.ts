import { FC } from 'react';

declare const Markdown: FC<{
  content: string;
  isStreaming?: boolean;
  className?: string;
}>;

export default Markdown;
