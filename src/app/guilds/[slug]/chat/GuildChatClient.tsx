"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Hash, Loader2, Lock, Menu, MessagesSquare, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";
import { cn } from "@/lib/utils";
import type { GuildChannelFormData } from "@/lib/validation";
import { authStore } from "@/stores/userStore";
import { isHttpError } from "@/utils/fetch";
import { getGuild, guildErrorMessage, joinGuild } from "@/utils/guilds";
import type { Guild, GuildChannel, GuildMessage } from "@/types/guild";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { ChannelDialog } from "./components/ChannelDialog";
import { ChannelList } from "./components/ChannelList";
import { MessageComposer } from "./components/MessageComposer";
import { MessageList } from "./components/MessageList";
import { useGuildChat } from "./hooks/useGuildChat";

const STATUS_LABEL = {
  connecting: "Connecting…",
  open: "Live",
  reconnecting: "Reconnecting…",
  closed: "Disconnected",
} as const;

export default function GuildChatClient({ slug }: { slug: string }) {
  const { isLoggedIn, ready } = useIsLoggedIn();
  const currentUser = authStore((s) => s.data);
  const fetchCurrentUser = authStore((s) => s.fetch);

  const [guild, setGuild] = useState<Guild | null>(null);
  const [guildLoading, setGuildLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [joining, setJoining] = useState(false);

  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [replyTo, setReplyTo] = useState<GuildMessage | null>(null);
  const [channelDialog, setChannelDialog] = useState<{ open: boolean; channel: GuildChannel | null }>({
    open: false,
    channel: null,
  });
  const [savingChannel, setSavingChannel] = useState(false);
  const [channelToDelete, setChannelToDelete] = useState<GuildChannel | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<GuildMessage | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadGuild = useCallback(async () => {
    try {
      const fresh = await getGuild(slug);
      setGuild(fresh);
      setNotFound(!fresh);
    } catch (error) {
      if (isHttpError(error) && error.response?.status === 404) {
        setNotFound(true);
        return;
      }
      toast.error(guildErrorMessage(error, "Could not load the guild."));
    } finally {
      setGuildLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (!ready || !isLoggedIn) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadGuild();
  }, [ready, isLoggedIn, loadGuild]);

  // Own messages are recognised by id, which only /users/me provides.
  useEffect(() => {
    if (ready && isLoggedIn && !currentUser.id) void fetchCurrentUser();
  }, [ready, isLoggedIn, currentUser.id, fetchCurrentUser]);

  const onAccessLost = useCallback(() => {
    toast.error("You no longer have access to this guild's chat.");
    void loadGuild();
  }, [loadGuild]);

  const isMember = guild?.is_member === true;
  const canManage = guild?.my_role === "owner" || guild?.my_role === "admin";

  const chat = useGuildChat({
    slug,
    enabled: isMember,
    currentUserId: currentUser.id,
    onAccessLost,
  });
  const { activeChannel, activeHistory } = chat;

  const selectChannel = (channelId: string) => {
    chat.setActiveChannelId(channelId);
    setReplyTo(null);
    setMobileNavOpen(false);
  };

  const onJoin = async () => {
    setJoining(true);
    try {
      await joinGuild(slug);
      toast.success("You joined the guild");
      await loadGuild();
    } catch (error) {
      toast.error(guildErrorMessage(error, "Could not join the guild."));
    } finally {
      setJoining(false);
    }
  };

  const onSaveChannel = async (data: GuildChannelFormData) => {
    setSavingChannel(true);
    const body = { name: data.name.trim(), topic: data.topic?.trim() ?? "" };
    const ok = channelDialog.channel
      ? await chat.updateChannel(channelDialog.channel.id, body)
      : await chat.createChannel(body);
    setSavingChannel(false);
    if (ok) {
      toast.success(channelDialog.channel ? "Channel updated" : "Channel created");
      setChannelDialog((d) => ({ ...d, open: false }));
    }
  };

  const onConfirmDeleteChannel = async () => {
    if (!channelToDelete) return;
    setDeleting(true);
    const ok = await chat.deleteChannel(channelToDelete);
    setDeleting(false);
    if (ok) {
      toast.success(`#${channelToDelete.name} deleted`);
      setChannelToDelete(null);
    }
  };

  const onConfirmDeleteMessage = async () => {
    if (!messageToDelete) return;
    setDeleting(true);
    const ok = await chat.remove(messageToDelete);
    setDeleting(false);
    if (ok) {
      if (replyTo?.id === messageToDelete.id) setReplyTo(null);
      setMessageToDelete(null);
    }
  };

  const onRequestDeleteMessage = useCallback((message: GuildMessage) => setMessageToDelete(message), []);

  if (ready && !isLoggedIn) {
    return (
      <CenteredNotice
        icon={<MessagesSquare className="w-10 h-10" />}
        title="Sign in to chat"
        description="Guild channels are for members only."
      >
        <Button asChild className="cursor-pointer">
          <Link href={`/login?redirect=/guilds/${slug}/chat`}>Sign in</Link>
        </Button>
      </CenteredNotice>
    );
  }

  if (!ready || (guildLoading && !guild)) {
    return (
      <div className="flex h-full">
        <div className="hidden md:block w-64 border-r border-border/60 p-3 space-y-3">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-7 w-full" />
          <Skeleton className="h-7 w-full" />
        </div>
        <div className="flex-1 p-4 space-y-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-full max-h-96 w-full" />
        </div>
      </div>
    );
  }

  if (notFound || !guild) {
    return (
      <CenteredNotice
        icon={<Users className="w-10 h-10" />}
        title="Guild not found"
        description="It may have been deleted, or it is private and you are not a member."
      >
        <Button asChild variant="secondary" className="cursor-pointer">
          <Link href="/guilds">Browse guilds</Link>
        </Button>
      </CenteredNotice>
    );
  }

  if (!isMember) {
    return (
      <CenteredNotice
        icon={guild.is_public ? <MessagesSquare className="w-10 h-10" /> : <Lock className="w-10 h-10" />}
        title={`Join ${guild.name} to chat`}
        description={
          guild.is_public
            ? "Channels are for members only. Join the guild to read and send messages."
            : "This guild is private — ask an admin for an invite."
        }
      >
        <Button asChild variant="secondary" className="cursor-pointer">
          <Link href={`/guilds/${guild.slug}`}>Guild page</Link>
        </Button>
        {guild.is_public && (
          <Button type="button" className="cursor-pointer" disabled={joining} onClick={onJoin}>
            {joining && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Join guild
          </Button>
        )}
      </CenteredNotice>
    );
  }

  const channelList = (
    <ChannelList
      guild={guild}
      channels={chat.channels}
      loading={chat.channelsLoading}
      activeChannelId={activeChannel?.id ?? null}
      unread={chat.unread}
      canManage={canManage}
      onSelect={selectChannel}
      onCreate={() => {
        setMobileNavOpen(false);
        setChannelDialog({ open: true, channel: null });
      }}
      onEdit={(channel) => {
        setMobileNavOpen(false);
        setChannelDialog({ open: true, channel });
      }}
      onDelete={(channel) => {
        setMobileNavOpen(false);
        setChannelToDelete(channel);
      }}
    />
  );

  const hasUnreadElsewhere = [...chat.unread].some((id) => id !== activeChannel?.id);

  return (
    <div className="flex h-full min-h-0">
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-border/60 bg-card/40">
        {channelList}
      </aside>

      <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <SheetContent side="left" className="w-72 p-0 gap-0">
          <SheetTitle className="sr-only">Channels</SheetTitle>
          <SheetDescription className="sr-only">Channels of {guild.name}</SheetDescription>
          {channelList}
        </SheetContent>
      </Sheet>

      <section className="flex flex-1 min-w-0 flex-col">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border/60 px-3 sm:px-4">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="relative md:hidden cursor-pointer"
            aria-label="Open channels"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu />
            {hasUnreadElsewhere && (
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
            )}
          </Button>
          {activeChannel ? (
            <>
              <Hash className="w-5 h-5 shrink-0 text-muted-foreground" />
              <h1 className="font-semibold truncate">{activeChannel.name}</h1>
              {activeChannel.topic && (
                <p
                  className="hidden lg:block min-w-0 truncate border-l border-border pl-3 text-sm text-muted-foreground"
                  title={activeChannel.topic}
                >
                  {activeChannel.topic}
                </p>
              )}
            </>
          ) : (
            <h1 className="font-semibold truncate">{guild.name}</h1>
          )}
          <span
            className="ml-auto flex shrink-0 items-center gap-1.5 text-[11px] text-muted-foreground"
            role="status"
          >
            <span
              className={cn(
                "h-2 w-2 rounded-full",
                chat.streamStatus === "open" ? "bg-emerald-500" : "bg-amber-500 animate-pulse",
                chat.streamStatus === "closed" && "bg-destructive animate-none",
              )}
            />
            <span className="hidden sm:inline">{STATUS_LABEL[chat.streamStatus]}</span>
          </span>
        </header>

        {activeChannel && activeHistory ? (
          <>
            <MessageList
              key={activeChannel.id}
              channel={activeChannel}
              history={activeHistory}
              currentUserId={currentUser.id}
              canModerate={canManage}
              onLoadOlder={chat.loadOlder}
              onRetry={chat.retryHistory}
              onReply={setReplyTo}
              onEdit={chat.edit}
              onDelete={onRequestDeleteMessage}
            />
            <MessageComposer
              key={`composer-${activeChannel.id}`}
              channelName={activeChannel.name}
              replyTo={replyTo}
              onCancelReply={() => setReplyTo(null)}
              onSend={chat.send}
            />
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-muted-foreground">
            {chat.channelsLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : canManage ? (
              "No channels yet — create one to start chatting."
            ) : (
              "This guild has no channels yet."
            )}
          </div>
        )}
      </section>

      {canManage && (
        <ChannelDialog
          channel={channelDialog.channel}
          open={channelDialog.open}
          saving={savingChannel}
          onOpenChange={(open) => setChannelDialog((d) => ({ ...d, open }))}
          onSubmit={onSaveChannel}
        />
      )}

      <ConfirmDialog
        open={channelToDelete !== null}
        title={`Delete #${channelToDelete?.name ?? ""}?`}
        description="Every message in this channel is deleted with it. This cannot be undone."
        confirmLabel="Delete channel"
        destructive
        busy={deleting}
        onOpenChange={(open) => !open && setChannelToDelete(null)}
        onConfirm={onConfirmDeleteChannel}
      />

      <ConfirmDialog
        open={messageToDelete !== null}
        title="Delete message?"
        description="This permanently deletes the message. Replies to it keep their text but lose the quote."
        confirmLabel="Delete message"
        destructive
        busy={deleting}
        onOpenChange={(open) => !open && setMessageToDelete(null)}
        onConfirm={onConfirmDeleteMessage}
      />
    </div>
  );
}

function CenteredNotice({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex h-full items-center justify-center px-4">
      <div className="max-w-md text-center space-y-3">
        <div className="flex justify-center text-muted-foreground">{icon}</div>
        <h1 className="text-xl font-bold">{title}</h1>
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex items-center justify-center gap-2 pt-2">{children}</div>
      </div>
    </div>
  );
}
