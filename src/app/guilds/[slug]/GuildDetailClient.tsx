"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CalendarDays,
  Globe,
  Loader2,
  Lock,
  LogOut,
  MessagesSquare,
  Settings,
  Trash2,
  Users,
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";
import { useGuildChatStore } from "@/stores/guild-chat-store";
import { isHttpError } from "@/utils/fetch";
import {
  deleteGuild,
  getGuild,
  getGuildMembers,
  guildErrorMessage,
  joinGuild,
  leaveGuild,
  updateGuild,
} from "@/utils/guilds";
import {
  GUILD_MEMBERS_PAGE_SIZE,
  type Guild,
  type GuildMember,
} from "@/types/guild";
import type { GuildFormData } from "@/lib/validation";
import { GuildAvatar } from "../components/GuildAvatar";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { EditGuildDialog } from "./components/EditGuildDialog";
import { MemberList } from "./components/MemberList";

interface GuildDetailClientProps {
  slug: string;
  /** Server-rendered copy; absent for private guilds and for missing ones. */
  initialGuild: Guild | null;
}

export default function GuildDetailClient({
  slug,
  initialGuild,
}: GuildDetailClientProps) {
  const router = useRouter();
  const { isLoggedIn, ready } = useIsLoggedIn();

  const [guild, setGuild] = useState<Guild | null>(initialGuild);
  const [loading, setLoading] = useState(initialGuild === null);
  const [notFound, setNotFound] = useState(false);

  const [members, setMembers] = useState<GuildMember[]>([]);
  const [membersTotal, setMembersTotal] = useState(0);
  const [membersLoading, setMembersLoading] = useState(true);
  const [membersLoadingMore, setMembersLoadingMore] = useState(false);

  const [joining, setJoining] = useState(false);
  const [leaveOpen, setLeaveOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadGuild = useCallback(async () => {
    try {
      const fresh = await getGuild(slug);
      if (fresh) {
        setGuild(fresh);
        setNotFound(false);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      if (isHttpError(error) && error.response?.status === 404) {
        setNotFound(true);
        return;
      }
      toast.error(guildErrorMessage(error, "Could not load the guild."));
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const loadMembers = useCallback(
    async (offset: number) => {
      const isFirstPage = offset === 0;
      if (isFirstPage) {
        setMembersLoading(true);
      } else {
        setMembersLoadingMore(true);
      }
      try {
        const result = await getGuildMembers(slug, {
          limit: GUILD_MEMBERS_PAGE_SIZE,
          offset,
        });
        setMembers((prev) =>
          isFirstPage ? result.members : [...prev, ...result.members],
        );
        setMembersTotal(result.meta?.total_items ?? result.members.length);
      } catch (error) {
        // A 404 here is the private-guild case, already surfaced by the guild
        // fetch — no second toast for it.
        if (!isHttpError(error) || error.response?.status !== 404) {
          toast.error(guildErrorMessage(error, "Could not load members."));
        }
        if (isFirstPage) {
          setMembers([]);
          setMembersTotal(0);
        }
      } finally {
        setMembersLoading(false);
        setMembersLoadingMore(false);
      }
    },
    [slug],
  );

  // Re-fetch once the auth cookie is readable: the server render is anonymous,
  // so membership fields (and private guilds) only arrive on the client.
  useEffect(() => {
    if (!ready) return;
    // The rule flags the loading flags these raise before awaiting; fetching on
    // mount is the point of the effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadGuild();
    void loadMembers(0);
  }, [ready, loadGuild, loadMembers]);

  // The workspace sidebar keeps its own copy of the guild and the viewer's
  // guild list; membership and settings changes here must reach it too.
  const syncWorkspace = useCallback(() => {
    const store = useGuildChatStore.getState();
    void store.refreshGuild();
    void store.loadMyGuilds();
  }, []);

  const refreshAll = useCallback(async () => {
    await Promise.all([loadGuild(), loadMembers(0)]);
    syncWorkspace();
  }, [loadGuild, loadMembers, syncWorkspace]);

  const onJoin = async () => {
    setJoining(true);
    try {
      await joinGuild(slug);
      toast.success("You joined the guild");
      await refreshAll();
    } catch (error) {
      toast.error(guildErrorMessage(error, "Could not join the guild."));
    } finally {
      setJoining(false);
    }
  };

  const onLeave = async () => {
    setLeaving(true);
    try {
      await leaveGuild(slug);
      toast.success("You left the guild");
      setLeaveOpen(false);
      await refreshAll();
    } catch (error) {
      toast.error(guildErrorMessage(error, "Could not leave the guild."));
    } finally {
      setLeaving(false);
    }
  };

  const onSave = async (data: GuildFormData) => {
    setSaving(true);
    try {
      // Every field is sent so clearing one persists as an empty value.
      const updated = await updateGuild(slug, {
        name: data.name.trim(),
        description: data.description?.trim() ?? "",
        avatar_url: data.avatar_url?.trim() ?? "",
        is_public: data.is_public,
      });
      toast.success("Guild updated");
      setEditOpen(false);
      if (updated) {
        setGuild(updated);
      } else {
        await loadGuild();
      }
      syncWorkspace();
    } catch (error) {
      toast.error(guildErrorMessage(error, "Could not update the guild."));
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    setDeleting(true);
    try {
      await deleteGuild(slug);
      toast.success("Guild deleted");
      setDeleteOpen(false);
      void useGuildChatStore.getState().loadMyGuilds();
      router.push("/guilds");
    } catch (error) {
      toast.error(guildErrorMessage(error, "Could not delete the guild."));
    } finally {
      setDeleting(false);
    }
  };

  if (loading && !guild) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Skeleton className="h-40 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    );
  }

  if (notFound || !guild) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 py-20 text-center space-y-3">
        <Users className="w-10 h-10 mx-auto text-muted-foreground" />
        <h1 className="text-xl font-bold">Guild not found</h1>
        <p className="text-sm text-muted-foreground">
          It may have been deleted, or it is private and you are not a member.
          {!isLoggedIn && " Signing in may help."}
        </p>
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button asChild variant="secondary" className="cursor-pointer">
            <Link href="/guilds">Browse guilds</Link>
          </Button>
          {!isLoggedIn && (
            <Button asChild className="cursor-pointer">
              <Link href={`/login?redirect=/guilds/${slug}`}>Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    );
  }

  const isMember = guild.is_member === true;
  const isOwner = guild.my_role === "owner";
  const canManage = isOwner || guild.my_role === "admin";

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-10 space-y-6">
      <Card className="border-border/70 bg-card/90">
        <CardContent className="p-5 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <GuildAvatar
              name={guild.name}
              avatarUrl={guild.avatar_url}
              className="w-16 h-16 text-lg"
            />
            <div className="flex-1 min-w-0 space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">
                  {guild.name}
                </h1>
                <Badge variant="secondary" className="gap-1">
                  {guild.is_public ? (
                    <>
                      <Globe className="w-3 h-3" />
                      Public
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3" />
                      Private
                    </>
                  )}
                </Badge>
                {guild.my_role && (
                  <Badge className="capitalize">{guild.my_role}</Badge>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {guild.member_count.toLocaleString()}{" "}
                  {guild.member_count === 1 ? "member" : "members"}
                </span>
                {guild.created_at && (
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="w-3.5 h-3.5" />
                    Created {format(new Date(guild.created_at), "d MMM yyyy")}
                  </span>
                )}
                {guild.owner?.username && (
                  <Link
                    href={`/${guild.owner.username}`}
                    className="hover:text-foreground transition-colors"
                  >
                    Owned by @{guild.owner.username}
                  </Link>
                )}
              </div>
            </div>
          </div>

          {guild.description && (
            <p className="text-sm leading-relaxed whitespace-pre-line">
              {guild.description}
            </p>
          )}

          <Separator />

          <div className="flex flex-wrap items-center gap-2">
            {!isLoggedIn ? (
              <Button asChild className="cursor-pointer">
                <Link href={`/login?redirect=/guilds/${guild.slug}`}>
                  Sign in to join
                </Link>
              </Button>
            ) : !isMember ? (
              guild.is_public ? (
                <Button
                  type="button"
                  className="cursor-pointer"
                  disabled={joining}
                  onClick={onJoin}
                >
                  {joining && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Join guild
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">
                  This guild is private — ask an admin for an invite.
                </p>
              )
            ) : (
              <>
                <Button asChild className="cursor-pointer gap-1.5">
                  <Link href={`/guilds/${guild.slug}/chat`}>
                    <MessagesSquare className="w-4 h-4" />
                    Open chat
                  </Link>
                </Button>
                {!isOwner && (
                  <Button
                    type="button"
                    variant="secondary"
                    className="cursor-pointer gap-1.5"
                    onClick={() => setLeaveOpen(true)}
                  >
                    <LogOut className="w-4 h-4" />
                    Leave guild
                  </Button>
                )}
              </>
            )}

            {canManage && (
              <Button
                type="button"
                variant="secondary"
                className="cursor-pointer gap-1.5"
                onClick={() => setEditOpen(true)}
              >
                <Settings className="w-4 h-4" />
                Settings
              </Button>
            )}

            {isOwner && (
              <Button
                type="button"
                variant="destructive"
                className="cursor-pointer gap-1.5 sm:ml-auto"
                onClick={() => setDeleteOpen(true)}
              >
                <Trash2 className="w-4 h-4" />
                Delete guild
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/70 bg-card/90">
        <CardContent className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold">Members</h2>
            <span className="text-xs text-muted-foreground">
              {membersTotal.toLocaleString()} total
            </span>
          </div>
          <MemberList
            members={members}
            loading={membersLoading}
            loadingMore={membersLoadingMore}
            hasMore={members.length < membersTotal}
            onLoadMore={() => void loadMembers(members.length)}
          />
        </CardContent>
      </Card>

      {canManage && (
        <EditGuildDialog
          guild={guild}
          open={editOpen}
          saving={saving}
          onOpenChange={setEditOpen}
          onSubmit={onSave}
        />
      )}

      <ConfirmDialog
        open={leaveOpen}
        title={`Leave ${guild.name}?`}
        description="You will lose access to members-only content and can rejoin later if the guild is public."
        confirmLabel="Leave guild"
        busy={leaving}
        onOpenChange={setLeaveOpen}
        onConfirm={onLeave}
      />

      <ConfirmDialog
        open={deleteOpen}
        title={`Delete ${guild.name}?`}
        description="This permanently deletes the guild and every membership in it. This cannot be undone."
        confirmLabel="Delete guild"
        destructive
        busy={deleting}
        onOpenChange={setDeleteOpen}
        onConfirm={onDelete}
      />
    </div>
  );
}
