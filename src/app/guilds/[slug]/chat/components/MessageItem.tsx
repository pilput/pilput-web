"use client";

import { memo, useState, type KeyboardEvent, type ReactNode } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { CornerUpLeft, Loader2, Pencil, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
        className="text-primary underline underline-offset-2 break-all"
      >
        {part}
      </a>
    ) : (
      part
    ),
  );
}

function authorLabel(message: Pick<GuildMessage, "author">) {
  return message.author?.username ?? "Deleted user";
}

interface MessageItemProps {
  message: GuildMessage;
  /** Continues the previous message's group: no avatar or name. */
  compact: boolean;
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
        "group relative flex gap-3 outline-none px-3 sm:px-4 py-0.5 hover:bg-accent/40 transition-colors",
        !compact && "mt-3 pt-1",
        highlighted && "bg-primary/10 hover:bg-primary/10",
      )}
    >
      <div className="w-9 shrink-0">
        {!compact ? (
          <Avatar className="h-9 w-9 border border-border mt-0.5">
            <AvatarImage src={getProfilePicture(message.author?.image || "")} alt="" />
            <AvatarFallback className="text-[10px] font-bold">
              {(username || "?").slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ) : (
          createdAt && (
            <time
              dateTime={message.created_at ?? undefined}
              className="hidden group-hover:block pt-1 text-[10px] leading-4 text-muted-foreground text-right tabular-nums"
            >
              {format(createdAt, "HH:mm")}
            </time>
          )
        )}
      </div>

      <div className="min-w-0 flex-1">
        {message.reply_to_id && (
          <button
            type="button"
            disabled={!reply}
            onClick={() => reply && onJumpTo(reply.id)}
            className="mb-0.5 flex max-w-full items-center gap-1.5 text-xs text-muted-foreground enabled:hover:text-foreground enabled:cursor-pointer"
          >
            <CornerUpLeft className="w-3 h-3 shrink-0" />
            {reply ? (
              <>
                <span className="font-semibold shrink-0">@{authorLabel(reply)}</span>
                <span className="truncate">{reply.content}</span>
              </>
            ) : (
              <span className="italic">Original message was deleted</span>
            )}
          </button>
        )}

        {!compact && (
          <div className="flex items-baseline gap-2">
            {username ? (
              <Link href={`/${username}`} className="text-sm font-semibold hover:underline">
                {username}
              </Link>
            ) : (
              <span className="text-sm font-semibold text-muted-foreground">Deleted user</span>
            )}
            {createdAt && (
              <time
                dateTime={message.created_at ?? undefined}
                title={format(createdAt, "PPpp")}
                className="text-[11px] text-muted-foreground"
              >
                {format(createdAt, "HH:mm")}
              </time>
            )}
          </div>
        )}

        {editing ? (
          <div className="py-1 space-y-1">
            <Textarea
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onEditKeyDown}
              aria-label="Edit message"
              className="min-h-9 max-h-60 resize-none text-sm"
            />
            <p className="text-[11px] text-muted-foreground">
              Escape to{" "}
              <button type="button" className="text-primary hover:underline cursor-pointer" onClick={() => setEditing(false)}>
                cancel
              </button>{" "}
              · Enter to{" "}
              <button type="button" className="text-primary hover:underline cursor-pointer" onClick={() => void saveEdit()}>
                save
              </button>
              {saving && <Loader2 className="inline w-3 h-3 ml-1.5 animate-spin" />}
            </p>
          </div>
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">
            {renderContent(message.content)}
            {message.edited_at && (
              <span
                className="ml-1 text-[10px] text-muted-foreground"
                title={`Edited ${format(new Date(message.edited_at), "PPpp")}`}
              >
                (edited)
              </span>
            )}
          </p>
        )}
      </div>

      {!editing && (
        <div className="absolute -top-3 right-3 hidden group-hover:flex group-focus-within:flex items-center rounded-md border border-border bg-popover shadow-sm">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="cursor-pointer"
            aria-label="Reply"
            title="Reply"
            onClick={() => onReply(message)}
          >
            <CornerUpLeft />
          </Button>
          {canEdit && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="cursor-pointer"
              aria-label="Edit message"
              title="Edit"
              onClick={startEdit}
            >
              <Pencil />
            </Button>
          )}
          {canDelete && (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="cursor-pointer text-destructive hover:text-destructive"
              aria-label="Delete message"
              title="Delete"
              onClick={() => onDelete(message)}
            >
              <Trash2 />
            </Button>
          )}
        </div>
      )}
    </div>
  );
});
