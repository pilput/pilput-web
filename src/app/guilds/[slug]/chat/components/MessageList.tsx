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
        className="flex h-full flex-col overflow-y-auto overscroll-contain pb-6"
        role="log"
        aria-live="polite"
        aria-label={`Messages in #${channel.name}`}
      >
        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col">
          {/* Pushes a short history to the bottom, next to the composer. */}
          <div className="flex-1" />
          <div ref={topSentinelRef} aria-hidden />

          {history.hasMore ? (
            <div className="flex justify-center py-4">
              {history.loadingOlder ? (
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="cursor-pointer text-muted-foreground"
                  onClick={onLoadOlder}
                >
                  Load older messages
                </Button>
              )}
            </div>
          ) : (
            <div className="px-4 sm:px-5 pt-10 pb-2">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-primary/25 to-primary/5 text-primary ring-1 ring-primary/20">
                <Hash className="w-8 h-8" />
              </div>
              <h2 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight">
                Welcome to #{channel.name}
              </h2>
              <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">
                {channel.topic || `This is the start of the #${channel.name} channel. Say hello!`}
              </p>
              <div className="mt-6 h-px bg-border" />
            </div>
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
                    <div className="relative mt-6 mb-1 flex justify-center px-4" role="separator">
                      <div className="absolute inset-x-4 top-1/2 h-px bg-border" aria-hidden />
                      <span className="relative rounded-full border border-border bg-background px-3 py-0.5 text-[11px] font-semibold text-muted-foreground">
                        {dayLabel(message.created_at)}
                      </span>
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
      </div>

      {showJump && (
        <Button
          type="button"
          size="sm"
          variant={newCount > 0 ? "default" : "secondary"}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 gap-1.5 rounded-full shadow-lg cursor-pointer animate-in fade-in slide-in-from-bottom-2"
          onClick={() => scrollToBottom(true)}
        >
          <ArrowDown className="w-4 h-4" />
          {newCount > 0
            ? `${newCount} new message${newCount === 1 ? "" : "s"}`
            : "Jump to latest"}
        </Button>
      )}
    </div>
  );
}
