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
    <div className="shrink-0 px-3 pb-3 sm:px-4 sm:pb-4">
      <div
        className={cn(
          "overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm transition-[border-color,box-shadow]",
          "focus-within:border-primary/40 focus-within:shadow-md focus-within:ring-4 focus-within:ring-primary/5",
          tooLong && "border-destructive/60 focus-within:border-destructive/60",
        )}
      >
        {replyTo && (
          <div className="flex items-center gap-2 border-b border-border/60 bg-muted/40 py-2 pl-3 pr-2 animate-in fade-in slide-in-from-bottom-1 duration-150">
            <div className="min-w-0 flex-1 border-l-2 border-primary pl-2.5">
              <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                <CornerUpLeft className="w-3 h-3" />
                Replying to{" "}
                <span className="font-semibold text-foreground">
                  {replyTo.author?.username ? `@${replyTo.author.username}` : "a deleted user"}
                </span>
              </p>
              <p className="truncate text-xs text-muted-foreground/90">{replyTo.content}</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              className="shrink-0 cursor-pointer rounded-full text-muted-foreground"
              aria-label="Cancel reply"
              onClick={onCancelReply}
            >
              <X />
            </Button>
          </div>
        )}
        <form
          className="flex items-end gap-2 p-2 pl-3"
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
            className="min-h-9 max-h-[200px] resize-none border-0 bg-transparent px-0 py-2 text-[15px] shadow-none focus-visible:ring-0 dark:bg-transparent"
          />
          <Button
            type="submit"
            size="icon"
            disabled={!canSend}
            className={cn(
              "shrink-0 cursor-pointer rounded-xl transition-all",
              !canSend && "bg-muted text-muted-foreground",
            )}
            aria-label="Send message"
          >
            {sending ? <Loader2 className="animate-spin" /> : <SendHorizontal />}
          </Button>
        </form>
      </div>
      <div className="mt-1.5 flex min-h-4 items-center justify-between px-2 text-[11px] text-muted-foreground">
        <span className="hidden sm:inline">
          <Kbd>Enter</Kbd> to send · <Kbd>Shift</Kbd> + <Kbd>Enter</Kbd> for a new line
        </span>
        {remaining < 500 && (
          <span className={cn("ml-auto tabular-nums", tooLong && "font-semibold text-destructive")}>
            {remaining.toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-border bg-muted px-1 py-px font-sans text-[10px] font-medium">
      {children}
    </kbd>
  );
}
