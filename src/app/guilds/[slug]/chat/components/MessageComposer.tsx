"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { CornerUpLeft, Loader2, SendHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { GUILD_MESSAGE_MAX_LENGTH, type GuildMessage } from "@/types/guild";

const MAX_HEIGHT_PX = 200;

interface MessageComposerProps {
  channelName: string;
  replyTo: GuildMessage | null;
  onCancelReply: () => void;
  onSend: (content: string, replyToId?: string) => Promise<boolean>;
}

export function MessageComposer({
  channelName,
  replyTo,
  onCancelReply,
  onSend,
}: MessageComposerProps) {
  const [value, setValue] = useState("");
  const [sending, setSending] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT_PX)}px`;
  }, [value]);

  // Jump into the box when a reply is started.
  useEffect(() => {
    if (replyTo) textareaRef.current?.focus();
  }, [replyTo]);

  const trimmed = value.trim();
  const tooLong = value.length > GUILD_MESSAGE_MAX_LENGTH;
  const canSend = trimmed.length > 0 && !tooLong && !sending;

  const submit = async () => {
    if (!canSend) return;
    setSending(true);
    const ok = await onSend(trimmed, replyTo?.id);
    setSending(false);
    if (ok) {
      setValue("");
      onCancelReply();
    }
    textareaRef.current?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      void submit();
    } else if (e.key === "Escape" && replyTo) {
      onCancelReply();
    }
  };

  const remaining = GUILD_MESSAGE_MAX_LENGTH - value.length;

  return (
    <div className="shrink-0 border-t border-border/60 bg-background/75 px-4 pt-3 pb-3 backdrop-blur-md sm:px-5">
      <div
        className={cn(
          "rounded-lg border border-input bg-background transition-colors",
          "focus-within:border-foreground/30",
          tooLong && "border-destructive/60 focus-within:border-destructive/60",
        )}
      >
        {replyTo && (
          <div className="flex items-center gap-2 border-b border-border/60 bg-muted/50 px-3 py-1.5 text-xs">
            <CornerUpLeft className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="shrink-0 text-muted-foreground">Replying to</span>
            <span className="shrink-0 font-semibold">
              {replyTo.author?.username ? `@${replyTo.author.username}` : "deleted user"}
            </span>
            <span className="min-w-0 truncate text-muted-foreground">{replyTo.content}</span>
            <button
              type="button"
              className="ml-auto flex size-5 shrink-0 cursor-pointer items-center justify-center rounded text-muted-foreground hover:bg-background hover:text-foreground"
              aria-label="Cancel reply"
              onClick={onCancelReply}
            >
              <X className="size-3.5" />
            </button>
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
        >
          <Textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={`Message #${channelName}`}
            aria-label={`Message #${channelName}`}
            className="min-h-10 max-h-[200px] resize-none rounded-none border-0 bg-transparent px-3 pt-2.5 pb-1 text-sm shadow-none focus-visible:ring-0 dark:bg-transparent"
          />
          <div className="flex items-center gap-2 px-2 pb-2">
            <span className="hidden pl-1 text-[11px] text-muted-foreground sm:inline">
              <b className="font-medium">Shift + Enter</b> for a new line
            </span>
            <span className="ml-auto flex items-center gap-2">
              {remaining < 500 && (
                <span className={cn("text-[11px] tabular-nums text-muted-foreground", tooLong && "font-semibold text-destructive")}>
                  {remaining.toLocaleString()}
                </span>
              )}
              <Button
                type="submit"
                size="sm"
                disabled={!canSend}
                className="h-7 cursor-pointer gap-1.5 px-2.5 text-xs"
              >
                {sending ? <Loader2 className="animate-spin" /> : <SendHorizontal />}
                Send
              </Button>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
