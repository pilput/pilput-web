"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useShallow } from "zustand/react/shallow";
import type { GuildChannelFormData } from "@/lib/validation";
import { useGuildChatStore } from "@/stores/guild-chat-store";
import { ChannelDialog } from "../components/ChannelDialog";
import { ConfirmDialog } from "../components/ConfirmDialog";

/** Channel create/edit/delete dialogs, opened from the sidebar or a page. */
export function ChannelDialogs() {
  const router = useRouter();
  const pathname = usePathname();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const {
    slug,
    canManage,
    channelDialog,
    closeChannelDialog,
    channelToDelete,
    requestDeleteChannel,
    createChannel,
    updateChannel,
    deleteChannel,
  } = useGuildChatStore(
    useShallow((s) => ({
      slug: s.slug,
      canManage: s.guild?.my_role === "owner" || s.guild?.my_role === "admin",
      channelDialog: s.channelDialog,
      closeChannelDialog: s.closeChannelDialog,
      channelToDelete: s.channelToDelete,
      requestDeleteChannel: s.requestDeleteChannel,
      createChannel: s.createChannel,
      updateChannel: s.updateChannel,
      deleteChannel: s.deleteChannel,
    })),
  );

  if (!canManage || !slug) return null;

  const onSubmit = async (data: GuildChannelFormData) => {
    setSaving(true);
    const body = { name: data.name.trim(), topic: data.topic?.trim() ?? "" };
    const editing = channelDialog.channel;
    if (editing) {
      const ok = await updateChannel(editing.id, body);
      if (ok) {
        toast.success("Channel updated");
        closeChannelDialog();
      }
    } else {
      const created = await createChannel(body);
      if (created) {
        toast.success(`#${created.name} created`);
        closeChannelDialog();
        router.push(`/guilds/${slug}/chat/${created.id}`);
      }
    }
    setSaving(false);
  };

  const onConfirmDelete = async () => {
    if (!channelToDelete) return;
    setDeleting(true);
    const ok = await deleteChannel(channelToDelete);
    setDeleting(false);
    if (!ok) return;
    toast.success(`#${channelToDelete.name} deleted`);
    if (pathname.endsWith(`/chat/${channelToDelete.id}`)) {
      router.replace(`/guilds/${slug}/chat`);
    }
    requestDeleteChannel(null);
  };

  return (
    <>
      <ChannelDialog
        channel={channelDialog.channel}
        open={channelDialog.open}
        saving={saving}
        onOpenChange={(open) => !open && closeChannelDialog()}
        onSubmit={onSubmit}
      />
      <ConfirmDialog
        open={channelToDelete !== null}
        title={`Delete #${channelToDelete?.name ?? ""}?`}
        description="Every message in this channel is deleted with it. This cannot be undone."
        confirmLabel="Delete channel"
        destructive
        busy={deleting}
        onOpenChange={(open) => !open && requestDeleteChannel(null)}
        onConfirm={onConfirmDelete}
      />
    </>
  );
}
