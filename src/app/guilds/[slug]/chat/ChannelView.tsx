"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { EMPTY_HISTORY, useGuildChatStore } from "@/stores/guild-chat-store";
import { authStore } from "@/stores/userStore";
import type { GuildMessage } from "@/types/guild";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { ChannelBackdrop } from "./components/ChannelBackdrop";
import { MessageComposer } from "./components/MessageComposer";
import { MessageList } from "./components/MessageList";

export default function ChannelView({ slug, channelId }: { slug: string; channelId: string }) {
  const router = useRouter();
  const currentUserId = authStore((s) => s.data.id);
  const [replyTo, setReplyTo] = useState<GuildMessage | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<GuildMessage | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { channel, channelsLoading, history, canModerate } = useGuildChatStore(
    useShallow((s) => ({
      channel: s.channels.find((c) => c.id === channelId),
      channelsLoading: s.channelsLoading,
      history: s.histories[channelId],
      canModerate: s.guild?.my_role === "owner" || s.guild?.my_role === "admin",
    })),
  );
  const { setActiveChannel, loadLatest, loadOlder, send, edit, remove } = useGuildChatStore.getState();

  // New messages here are read as they arrive, so they never count as unread.
  useEffect(() => {
    setActiveChannel(channelId);
    return () => setActiveChannel(null);
  }, [channelId, setActiveChannel]);

  useEffect(() => {
    if (channel && !useGuildChatStore.getState().histories[channelId]) {
      void loadLatest(channelId, false);
    }
  }, [channel, channelId, loadLatest]);

  // Unknown or just-deleted channel: fall back to the guild's first one.
  useEffect(() => {
    if (!channelsLoading && !channel) router.replace(`/guilds/${slug}/chat`);
  }, [channelsLoading, channel, slug, router]);

  const onLoadOlder = useCallback(() => void loadOlder(channelId), [loadOlder, channelId]);
  const onRetry = useCallback(() => void loadLatest(channelId, false), [loadLatest, channelId]);
  const onSend = useCallback(
    (content: string, replyToId?: string) => send(channelId, content, replyToId),
    [send, channelId],
  );

  const onConfirmDelete = async () => {
    if (!messageToDelete) return;
    setDeleting(true);
    const ok = await remove(messageToDelete);
    setDeleting(false);
    if (ok) {
      if (replyTo?.id === messageToDelete.id) setReplyTo(null);
      setMessageToDelete(null);
    }
  };

  if (!channel) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    // `isolate` keeps the backdrop's negative z-index inside this view.
    <div className="relative isolate flex h-full min-h-0 flex-col">
      <ChannelBackdrop channelId={channelId} />
      <MessageList
        key={channelId}
        channel={channel}
        history={history ?? EMPTY_HISTORY}
        currentUserId={currentUserId}
        canModerate={canModerate}
        onLoadOlder={onLoadOlder}
        onRetry={onRetry}
        onReply={setReplyTo}
        onEdit={edit}
        onDelete={setMessageToDelete}
      />
      <MessageComposer
        key={channelId}
        channelName={channel.name}
        replyTo={replyTo}
        onCancelReply={() => setReplyTo(null)}
        onSend={onSend}
      />

      <ConfirmDialog
        open={messageToDelete !== null}
        title="Delete message?"
        description="This permanently deletes the message. Replies to it keep their text but lose the quote."
        confirmLabel="Delete message"
        destructive
        busy={deleting}
        onOpenChange={(open) => !open && setMessageToDelete(null)}
        onConfirm={onConfirmDelete}
      />
    </div>
  );
}
