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
  MoreHorizontal,
  Settings,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { GuildBanner } from "../components/GuildBanner";
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
      <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6">
        <Skeleton className="h-60 w-full rounded-2xl" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <Skeleton className="h-72 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
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
  const hasMenu = canManage || (isMember && !isOwner);

  let primaryAction: React.ReactNode = null;
  if (!isLoggedIn) {
    primaryAction = (
      <Button asChild className="cursor-pointer">
        <Link href={`/login?redirect=/guilds/${guild.slug}`}>Sign in to join</Link>
      </Button>
    );
  } else if (isMember) {
    primaryAction = (
      <Button asChild className="cursor-pointer gap-1.5">
        <Link href={`/guilds/${guild.slug}/chat`}>
          <MessagesSquare className="w-4 h-4" />
          Open chat
        </Link>
      </Button>
    );
  } else if (guild.is_public) {
    primaryAction = (
      <Button type="button" className="cursor-pointer gap-1.5" disabled={joining} onClick={onJoin}>
        {joining ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
        Join guild
      </Button>
    );
  }

  const details = [
    {
      icon: guild.is_public ? Globe : Lock,
      label: "Visibility",
      value: guild.is_public ? "Public" : "Private",
    },
    {
      icon: Users,
      label: "Members",
      value: guild.member_count.toLocaleString(),
    },
    ...(guild.created_at
      ? [
          {
            icon: CalendarDays,
            label: "Created",
            value: format(new Date(guild.created_at), "d MMM yyyy"),
          },
        ]
      : []),
    ...(guild.my_role
      ? [{ icon: ShieldCheck, label: "Your role", value: guild.my_role }]
      : []),
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      <section className="overflow-hidden rounded-2xl border border-border/70 bg-card">
        <GuildBanner guildId={guild.id} />

        <div className="px-5 sm:px-8 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 sm:-mt-12">
            <GuildAvatar
              name={guild.name}
              avatarUrl={guild.avatar_url}
              className="relative w-20 h-20 sm:w-24 sm:h-24 text-2xl rounded-2xl border-4 border-card shadow-sm"
            />

            <div className="flex-1 min-w-0 sm:pb-1">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">
                {guild.name}
              </h1>
              <p className="text-sm text-muted-foreground truncate">
                /{guild.slug}
                {guild.owner?.username && (
                  <>
                    {" · by "}
                    <Link
                      href={`/${guild.owner.username}`}
                      className="font-medium text-foreground/80 hover:text-primary transition-colors"
                    >
                      @{guild.owner.username}
                    </Link>
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center gap-2 sm:pb-1">
              {primaryAction}
              {hasMenu && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="cursor-pointer"
                      aria-label="Guild options"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {canManage && (
                      <DropdownMenuItem className="cursor-pointer" onSelect={() => setEditOpen(true)}>
                        <Settings />
                        Guild settings
                      </DropdownMenuItem>
                    )}
                    {isMember && !isOwner && (
                      <DropdownMenuItem className="cursor-pointer" onSelect={() => setLeaveOpen(true)}>
                        <LogOut />
                        Leave guild
                      </DropdownMenuItem>
                    )}
                    {isOwner && (
                      <>
                        {canManage && <DropdownMenuSeparator />}
                        <DropdownMenuItem
                          variant="destructive"
                          className="cursor-pointer"
                          onSelect={() => setDeleteOpen(true)}
                        >
                          <Trash2 />
                          Delete guild
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {isLoggedIn && !isMember && !guild.is_public && (
            <p className="mt-4 rounded-lg bg-muted px-3 py-2 text-sm text-muted-foreground">
              This guild is private — ask an admin for an invite.
            </p>
          )}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="space-y-6 min-w-0">
          <section className="rounded-2xl border border-border/70 bg-card p-5 sm:p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              About
            </h2>
            <p
              className={
                guild.description
                  ? "mt-3 text-[15px] leading-relaxed whitespace-pre-line"
                  : "mt-3 text-sm italic text-muted-foreground"
              }
            >
              {guild.description || "This guild has no description yet."}
            </p>
          </section>

          <section className="rounded-2xl border border-border/70 bg-card p-5 sm:p-6">
            <div className="flex items-baseline justify-between gap-2 mb-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Members
              </h2>
              <span className="text-xs text-muted-foreground tabular-nums">
                {membersTotal.toLocaleString()}
              </span>
            </div>
            <MemberList
              members={members}
              loading={membersLoading}
              loadingMore={membersLoadingMore}
              hasMore={members.length < membersTotal}
              onLoadMore={() => void loadMembers(members.length)}
            />
          </section>
        </div>

        <aside className="lg:sticky lg:top-6 self-start rounded-2xl border border-border/70 bg-card p-5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Details
          </h2>
          <dl className="mt-4 space-y-3">
            {details.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Icon className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <dt className="text-xs text-muted-foreground">{label}</dt>
                  <dd className="text-sm font-medium capitalize truncate">{value}</dd>
                </div>
              </div>
            ))}
          </dl>
        </aside>
      </div>

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
