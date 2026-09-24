"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Hash, Loader2, Plus } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/button";
import { useGuildChatStore } from "@/stores/guild-chat-store";
import { ChatNotice } from "./ChatGate";

/** /guilds/:slug/chat has no content of its own: it opens the first channel. */
export default function ChatIndexClient({ slug }: { slug: string }) {
  const router = useRouter();
  const { firstChannelId, channelsLoading, canManage, openChannelDialog } = useGuildChatStore(
    useShallow((s) => ({
      firstChannelId: s.channels[0]?.id,
      channelsLoading: s.channelsLoading,
      canManage: s.guild?.my_role === "owner" || s.guild?.my_role === "admin",
      openChannelDialog: s.openChannelDialog,
    })),
  );

  useEffect(() => {
    if (firstChannelId) router.replace(`/guilds/${slug}/chat/${firstChannelId}`);
  }, [firstChannelId, slug, router]);

  if (channelsLoading || firstChannelId) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <ChatNotice
      icon={<Hash />}
      title="No channels yet"
      description={
        canManage
          ? "Create the first channel to get the conversation going."
          : "An admin has not created any channels yet."
      }
    >
      {canManage && (
        <Button type="button" className="cursor-pointer" onClick={() => openChannelDialog(null)}>
          <Plus />
          Create channel
        </Button>
      )}
    </ChatNotice>
  );
}
