"use client";

import { Fragment, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { format, isToday, isYesterday } from "date-fns";
import { ArrowDown, Hash, Loader2, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipProvider } from "@/components/ui/tooltip";
import type { GuildChannel, GuildMessage } from "@/types/guild";
import type { ChannelHistory } from "@/stores/guild-chat-store";
import { MessageItem } from "./MessageItem";

/** Consecutive messages by one author within this window share a header. */
const GROUP_WINDOW_MS = 7 * 60 * 1000;
/** Within this many px of the bottom counts as "reading the latest". */
const BOTTOM_THRESHOLD_PX = 120;
const HIGHLIGHT_MS = 1600;

function dayKey(iso: string | null) {
  return iso ? format(new Date(iso), "yyyy-MM-dd") : "";
}

function dayLabel(iso: string) {
  const date = new Date(iso);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, d MMMM yyyy");
}

function isCompact(prev: GuildMessage | undefined, message: GuildMessage) {
  if (!prev || prev.author_id !== message.author_id || message.reply_to_id) return false;
  if (!prev.created_at || !message.created_at) return false;
  if (dayKey(prev.created_at) !== dayKey(message.created_at)) return false;
  return new Date(message.created_at).getTime() - new Date(prev.created_at).getTime() < GROUP_WINDOW_MS;
}

interface MessageListProps {
  channel: GuildChannel;
  history: ChannelHistory;
  currentUserId: string | undefined;
  canModerate: boolean;
  onLoadOlder: () => void;
  onRetry: () => void;
  onReply: (message: GuildMessage) => void;
  onEdit: (message: GuildMessage, content: string) => Promise<boolean>;
  onDelete: (message: GuildMessage) => void;
}

/** Mount one per channel (keyed by channel id): scroll state is per channel. */
export function MessageList({
  channel,
  history,
  currentUserId,
  canModerate,
  onLoadOlder,
  onRetry,
  onReply,
  onEdit,
  onDelete,
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const atBottomRef = useRef(true);
  const [showJump, setShowJump] = useState(false);
  const [newCount, setNewCount] = useState(0);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  // Messages with a greater id arrived while the channel was open and fade in;
  // the initial page and older pages do not.
  const [freshAfter, setFreshAfter] = useState<string | null>(null);

  // What was rendered last time, to tell a prepend (older page) from an append.
  const prevRef = useRef<{ firstId?: string; lastId?: string; scrollHeight: number }>({
    scrollHeight: 0,
  });

  const { messages } = history;

  const scrollToBottom = useCallback((smooth = false) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
  }, []);

  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el || history.loading) return;
    const prev = prevRef.current;
    const firstId = messages[0]?.id;
    const last = messages.at(-1);

    if (freshAfter === null) {
      // First page on screen: start at the latest.
      el.scrollTop = el.scrollHeight;
      atBottomRef.current = true;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFreshAfter(last?.id ?? "");
    } else if (firstId !== prev.firstId && last?.id === prev.lastId) {
      // An older page was prepended: keep the same messages under the reader.
      el.scrollTop += el.scrollHeight - prev.scrollHeight;
    } else if (last && last.id !== prev.lastId) {
      // New message: follow it if the reader was at the bottom, or sent it.
      if (atBottomRef.current || last.author_id === currentUserId) {
        el.scrollTop = el.scrollHeight;
        atBottomRef.current = true;
      } else {
        setNewCount((n) => n + 1);
      }
    }

    prevRef.current = { firstId, lastId: last?.id, scrollHeight: el.scrollHeight };
  }, [messages, history.loading, currentUserId, freshAfter]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < BOTTOM_THRESHOLD_PX;
    atBottomRef.current = atBottom;
    prevRef.current.scrollHeight = el.scrollHeight;
    setShowJump(!atBottom);
    if (atBottom) setNewCount(0);
  };

  // Scrolling near the top pulls in the next older page.
  useEffect(() => {
    const root = scrollRef.current;
    const target = topSentinelRef.current;
    if (!root || !target || !history.hasMore || history.loading) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) onLoadOlder();
      },
      { root, rootMargin: "300px 0px 0px 0px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [history.hasMore, history.loading, history.loadingOlder, onLoadOlder]);

  const jumpTo = useCallback((messageId: string) => {
    const target = document.getElementById(`message-${messageId}`);
    if (!target) return; // Parent is older than what is loaded.
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    setHighlightId(messageId);
    window.setTimeout(() => setHighlightId((id) => (id === messageId ? null : id)), HIGHLIGHT_MS);
  }, []);

  if (history.loading && messages.length === 0) {
    return (
      <div className="flex-1 min-h-0 overflow-hidden flex flex-col justify-end px-4 pb-6 space-y-5" aria-busy>
        {[35, 60, 20, 75, 45, 55].map((w, i) => (
          <div key={i} className="flex gap-3">
            <Skeleton className="h-9 w-9 rounded-full shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="flex gap-2">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-3.5 w-12 opacity-60" />
              </div>
              <Skeleton className="h-3.5" style={{ width: `${w}%` }} />
              {i % 3 === 1 && <Skeleton className="h-3.5" style={{ width: `${w / 2}%` }} />}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (history.error && messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="text-sm text-muted-foreground">Could not load messages.</p>
        <Button type="button" variant="secondary" className="cursor-pointer gap-1.5" onClick={onRetry}>
          <RotateCw className="w-4 h-4" />
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="relative flex-1 min-h-0">
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex h-full flex-col overflow-y-auto overscroll-contain pb-3"
        role="log"
        aria-live="polite"
        aria-label={`Messages in #${channel.name}`}
      >
        {/* Pushes a short history to the bottom, next to the composer. */}
        <div className="flex-1" />
        <div ref={topSentinelRef} aria-hidden />

        {history.hasMore ? (
          <div className="flex justify-center py-3">
            {history.loadingOlder ? (
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            ) : (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 cursor-pointer text-xs text-muted-foreground"
                onClick={onLoadOlder}
              >
                Load older messages
              </Button>
            )}
          </div>
        ) : (
          <ChannelIntro channel={channel} />
        )}

        <TooltipProvider delayDuration={300}>
          {messages.map((message, i) => {
            const prev = messages[i - 1];
            const newDay =
              !!message.created_at && dayKey(message.created_at) !== dayKey(prev?.created_at ?? null);
            const own = message.author_id === currentUserId;
            return (
              <Fragment key={message.id}>
                {newDay && message.created_at && (
                  <div className="mt-4 mb-1 flex items-center gap-3 px-4 sm:px-5" role="separator">
                    <span className="text-xs font-semibold text-foreground/80">
                      {dayLabel(message.created_at)}
                    </span>
                    <span aria-hidden className="h-px flex-1 bg-border" />
                  </div>
                )}
                <MessageItem
                  message={message}
                  compact={!newDay && isCompact(prev, message)}
                  fresh={freshAfter !== null && message.id > freshAfter}
                  own={own}
                  highlighted={highlightId === message.id}
                  canEdit={own}
                  canDelete={own || canModerate}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onJumpTo={jumpTo}
                />
              </Fragment>
            );
          })}
        </TooltipProvider>
      </div>

      {showJump &&
        (newCount > 0 ? (
          <button
            type="button"
            onClick={() => scrollToBottom(true)}
            className="absolute inset-x-3 bottom-2 flex cursor-pointer items-center justify-between rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground shadow-md animate-in fade-in slide-in-from-bottom-1 sm:inset-x-5"
          >
            <span>
              {newCount} new message{newCount === 1 ? "" : "s"}
            </span>
            <span className="flex items-center gap-1">
              Jump to latest
              <ArrowDown className="size-3.5" />
            </span>
          </button>
        ) : (
          <Button
            type="button"
            size="icon-sm"
            variant="secondary"
            aria-label="Jump to latest"
            title="Jump to latest"
            className="absolute bottom-3 right-4 cursor-pointer rounded-full border border-border shadow-md animate-in fade-in"
            onClick={() => scrollToBottom(true)}
          >
            <ArrowDown />
          </Button>
        ))}
    </div>
  );
}

/** Top of a channel's history: a short intro instead of a splash screen. */
function ChannelIntro({ channel }: { channel: GuildChannel }) {
  return (
    <div className="mb-2 border-b border-border/60 px-4 pt-8 pb-4 sm:px-5">
      <span className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Hash className="size-5" />
      </span>
      <h2 className="mt-3 text-lg font-bold tracking-tight">#{channel.name}</h2>
      <p className="mt-0.5 text-sm text-muted-foreground">
        This is the very beginning of <span className="font-medium text-foreground">#{channel.name}</span>
        {channel.created_at && <>, created {format(new Date(channel.created_at), "d MMMM yyyy")}</>}.
      </p>
      {channel.topic && (
        <p className="mt-2.5 max-w-2xl rounded-md border-l-2 border-primary/60 bg-muted/60 px-3 py-1.5 text-sm">
          {channel.topic}
        </p>
      )}
    </div>
  );
}
