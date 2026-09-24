"use client";

import { memo, useState, type KeyboardEvent, type ReactNode } from "react";
import Link from "next/link";
import { format, isToday, isYesterday } from "date-fns";
import { CornerUpLeft, Loader2, Pencil, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { getProfilePicture } from "@/utils/getImage";
import { GUILD_MESSAGE_MAX_LENGTH, type GuildMessage } from "@/types/guild";

const URL_PATTERN = /(https?:\/\/[^\s<]+[^\s<.,:;"')\]}!?])/g;

/** Plain text with bare URLs turned into links; React escapes the rest. */
function renderContent(content: string): ReactNode[] {
  return content.split(URL_PATTERN).map((part, i) =>
    i % 2 === 1 ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="text-primary hover:underline underline-offset-2 break-all"
      >
        {part}
      </a>
    ) : (
      part
    ),
  );
}

function formatStamp(date: Date) {
  const time = format(date, "HH:mm");
  if (isToday(date)) return `Today at ${time}`;
  if (isYesterday(date)) return `Yesterday at ${time}`;
  return format(date, "dd/MM/yyyy HH:mm");
}

function initials(username: string | null | undefined) {
  return (username || "?").slice(0, 2).toUpperCase();
}

interface MessageItemProps {
  message: GuildMessage;
  /** Continues the previous message's group: no avatar or name. */
  compact: boolean;
  /** Arrived after the list was opened — fades in. */
  fresh: boolean;
  own: boolean;
  highlighted: boolean;
  canEdit: boolean;
  canDelete: boolean;
  onReply: (message: GuildMessage) => void;
  onEdit: (message: GuildMessage, content: string) => Promise<boolean>;
  onDelete: (message: GuildMessage) => void;
  onJumpTo: (messageId: string) => void;
}

export const MessageItem = memo(function MessageItem({
  message,
  compact,
  fresh,
  own,
  highlighted,
  canEdit,
  canDelete,
  onReply,
  onEdit,
  onDelete,
  onJumpTo,
}: MessageItemProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);

  const createdAt = message.created_at ? new Date(message.created_at) : null;
  const username = message.author?.username;
  const reply = message.reply_to;

  const startEdit = () => {
    setDraft(message.content);
    setEditing(true);
  };

  const saveEdit = async () => {
    const content = draft.trim();
    if (!content || content.length > GUILD_MESSAGE_MAX_LENGTH) return;
    if (content === message.content) {
      setEditing(false);
      return;
    }
    setSaving(true);
    const ok = await onEdit(message, content);
    setSaving(false);
    if (ok) setEditing(false);
  };

  const onEditKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      void saveEdit();
    } else if (e.key === "Escape") {
      setEditing(false);
    }
  };

  return (
    <div
      id={`message-${message.id}`}
      // Focusable by tap so the action bar is reachable on touch screens.
      tabIndex={-1}
      className={cn(
        "group relative px-4 sm:px-5 py-0.5 outline-none transition-colors",
        "hover:bg-muted/50 focus-within:bg-muted/50",
        !compact && "mt-2.5 pt-1",
        fresh && "animate-in fade-in duration-300",
        editing && "bg-muted/50",
        highlighted && "bg-primary/10 hover:bg-primary/10",
      )}
    >
      {message.reply_to_id && (
        <div className="relative mb-1 flex min-w-0 items-center gap-1.5 pl-12 text-xs text-muted-foreground">
          <span
            aria-hidden
            className="absolute left-4.5 top-1/2 -bottom-1 w-6.5 rounded-tl-md border-l-2 border-t-2 border-muted-foreground/30"
          />
          {reply ? (
            <button
              type="button"
              onClick={() => onJumpTo(reply.id)}
              className="flex min-w-0 items-center gap-1.5 cursor-pointer hover:text-foreground transition-colors"
              title="Jump to the original message"
            >
              <Avatar className="h-4 w-4 shrink-0 rounded">
                <AvatarImage src={getProfilePicture(reply.author?.image || "")} alt="" />
                <AvatarFallback className="text-[7px] font-bold">
                  {initials(reply.author?.username)}
                </AvatarFallback>
              </Avatar>
              <span className="shrink-0 font-semibold text-foreground/80">
                @{reply.author?.username ?? "deleted user"}
              </span>
              <span className="truncate">{reply.content}</span>
            </button>
          ) : (
            <span className="italic">Original message was deleted</span>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <div className="w-9 shrink-0">
          {!compact ? (
            username ? (
              <Link href={`/${username}`} tabIndex={-1} aria-hidden>
                <Avatar className="mt-0.5 h-9 w-9 rounded-lg hover:opacity-90 transition-opacity">
                  <AvatarImage className="rounded-lg" src={getProfilePicture(message.author?.image || "")} alt="" />
                  <AvatarFallback className="rounded-lg text-[10px] font-bold">{initials(username)}</AvatarFallback>
                </Avatar>
              </Link>
            ) : (
              <Avatar className="mt-0.5 h-9 w-9 rounded-lg">
                <AvatarFallback className="rounded-lg text-[10px] font-bold">?</AvatarFallback>
              </Avatar>
            )
          ) : (
            createdAt && (
              <time
                dateTime={message.created_at ?? undefined}
                title={format(createdAt, "PPPPp")}
                className="invisible group-hover:visible group-focus-within:visible block pt-0.75 text-right text-[10px] leading-5 text-muted-foreground tabular-nums"
              >
                {format(createdAt, "HH:mm")}
              </time>
            )
          )}
        </div>

        <div className="min-w-0 flex-1">
          {!compact && (
            <div className="flex items-baseline gap-2">
              {username ? (
                <Link
                  href={`/${username}`}
                  className={cn(
                    "text-sm font-bold hover:underline",
                    own && "text-primary",
                  )}
                >
                  {username}
                </Link>
              ) : (
                <span className="text-sm font-semibold text-muted-foreground">Deleted user</span>
              )}
              {createdAt && (
                <time
                  dateTime={message.created_at ?? undefined}
                  title={format(createdAt, "PPPPp")}
                  className="text-[11px] text-muted-foreground"
                >
                  {formatStamp(createdAt)}
                </time>
              )}
            </div>
          )}

          {editing ? (
            <div className="py-1 space-y-1.5">
              <Textarea
                autoFocus
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onEditKeyDown}
                onFocus={(e) => {
                  const len = e.currentTarget.value.length;
                  e.currentTarget.setSelectionRange(len, len);
                }}
                aria-label="Edit message"
                className="min-h-10 max-h-60 resize-none bg-background text-sm"
              />
              <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                escape to
                <button
                  type="button"
                  className="text-primary hover:underline cursor-pointer"
                  onClick={() => setEditing(false)}
                >
                  cancel
                </button>
                · enter to
                <button
                  type="button"
                  className="text-primary hover:underline cursor-pointer"
                  onClick={() => void saveEdit()}
                >
                  save
                </button>
                {saving && <Loader2 className="ml-1 w-3 h-3 animate-spin" />}
              </p>
            </div>
          ) : (
            <p className="text-sm leading-6 whitespace-pre-wrap wrap-break-word">
              {renderContent(message.content)}
              {message.edited_at && (
                <span
                  className="ml-1.5 align-baseline text-[10px] text-muted-foreground"
                  title={`Edited ${format(new Date(message.edited_at), "PPPPp")}`}
                >
                  (edited)
                </span>
              )}
            </p>
          )}
        </div>
      </div>

      {!editing && (
        <div className="absolute -top-4 right-4 z-10 hidden items-center gap-0.5 rounded-lg border border-border bg-popover p-0.5 shadow-md group-hover:flex group-focus-within:flex">
          <ActionButton label="Reply" onClick={() => onReply(message)}>
            <CornerUpLeft />
          </ActionButton>
          {canEdit && (
            <ActionButton label="Edit" onClick={startEdit}>
              <Pencil />
            </ActionButton>
          )}
          {canDelete && (
            <ActionButton label="Delete" destructive onClick={() => onDelete(message)}>
              <Trash2 />
            </ActionButton>
          )}
        </div>
      )}
    </div>
  );
});

function ActionButton({
  label,
  destructive,
  onClick,
  children,
}: {
  label: string;
  destructive?: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={label}
          onClick={onClick}
          className={cn(
            "size-7 cursor-pointer text-muted-foreground hover:text-foreground",
            destructive && "hover:bg-destructive/10 hover:text-destructive",
          )}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="top">{label}</TooltipContent>
    </Tooltip>
  );
}
