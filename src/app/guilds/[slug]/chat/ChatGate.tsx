"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, Lock, MessagesSquare, Users } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { Button } from "@/components/ui/button";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";
import { useGuildChatStore } from "@/stores/guild-chat-store";
import { guildErrorMessage, joinGuild } from "@/utils/guilds";

/** Renders the channel pages only for a signed-in member of the guild. */
export function ChatGate({ slug, children }: { slug: string; children: React.ReactNode }) {
  const { isLoggedIn, ready } = useIsLoggedIn();
  const [joining, setJoining] = useState(false);
  const { storeSlug, guild, guildStatus, refreshGuild, loadMyGuilds } = useGuildChatStore(
    useShallow((s) => ({
      storeSlug: s.slug,
      guild: s.guild,
      guildStatus: s.guildStatus,
      refreshGuild: s.refreshGuild,
      loadMyGuilds: s.loadMyGuilds,
    })),
  );

  if (ready && !isLoggedIn) {
    return (
      <ChatNotice
        icon={<MessagesSquare />}
        title="Sign in to chat"
        description="Guild channels are for members only."
      >
        <Button asChild className="cursor-pointer">
          <Link href={`/login?redirect=/guilds/${slug}/chat`}>Sign in</Link>
        </Button>
      </ChatNotice>
    );
  }

  const loading = !ready || storeSlug !== slug || guildStatus === "idle" || (guildStatus === "loading" && !guild);
  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (guildStatus === "notfound" || !guild) {
    return (
      <ChatNotice
        icon={<Users />}
        title="Guild not found"
        description="It may have been deleted, or it is private and you are not a member."
      >
        <Button asChild variant="secondary" className="cursor-pointer">
          <Link href="/guilds">Explore guilds</Link>
        </Button>
      </ChatNotice>
    );
  }

  if (!guild.is_member) {
    const onJoin = async () => {
      setJoining(true);
      try {
        await joinGuild(slug);
        toast.success(`Welcome to ${guild.name}!`);
        await Promise.all([refreshGuild(), loadMyGuilds()]);
      } catch (error) {
        toast.error(guildErrorMessage(error, "Could not join the guild."));
      } finally {
        setJoining(false);
      }
    };

    return (
      <ChatNotice
        icon={guild.is_public ? <MessagesSquare /> : <Lock />}
        title={`Join ${guild.name} to chat`}
        description={
          guild.is_public
            ? "Channels are for members only. Join the guild to read and send messages."
            : "This guild is private — ask an admin for an invite."
        }
      >
        <Button asChild variant="secondary" className="cursor-pointer">
          <Link href={`/guilds/${guild.slug}`}>View guild</Link>
        </Button>
        {guild.is_public && (
          <Button type="button" className="cursor-pointer" disabled={joining} onClick={onJoin}>
            {joining && <Loader2 className="animate-spin" />}
            Join guild
          </Button>
        )}
      </ChatNotice>
    );
  }

  return <>{children}</>;
}

export function ChatNotice({
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
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="max-w-sm text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary [&_svg]:size-8">
          {icon}
        </div>
        <h1 className="mt-4 text-xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">{description}</p>
        {children && <div className="mt-5 flex items-center justify-center gap-2">{children}</div>}
      </div>
    </div>
  );
}
