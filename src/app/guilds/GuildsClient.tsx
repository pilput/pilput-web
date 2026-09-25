"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Compass, Loader2, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";
import { useGuildChatStore } from "@/stores/guild-chat-store";
import {
  createGuild,
  getGuilds,
  getMyGuilds,
  guildErrorMessage,
  joinGuild,
} from "@/utils/guilds";
import { GUILDS_PAGE_SIZE, type Guild } from "@/types/guild";
import type { GuildFormData } from "@/lib/validation";
import { CreateGuildDialog } from "./components/CreateGuildDialog";
import { GuildBanner } from "./components/GuildBanner";
import { GuildCard } from "./components/GuildCard";

type GuildTab = "discover" | "mine";

export default function GuildsClient() {
  const router = useRouter();
  const { isLoggedIn, ready } = useIsLoggedIn();

  const [tab, setTab] = useState<GuildTab>("discover");
  const [searchInput, setSearchInput] = useState("");
  const search = useDebouncedValue(searchInput, 400);

  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [joiningSlug, setJoiningSlug] = useState<string | null>(null);

  // The list endpoints are public and never fill in `is_member`, so membership
  // is resolved against the ids of the guilds the viewer belongs to.
  const [myGuildIds, setMyGuildIds] = useState<Set<string>>(new Set());

  // "My guilds" needs a token, so a signed-out visitor always sees the directory.
  const activeTab: GuildTab = isLoggedIn ? tab : "discover";

  const load = useCallback(
    async (offset: number) => {
      const isFirstPage = offset === 0;
      if (isFirstPage) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      try {
        const result =
          activeTab === "mine"
            ? await getMyGuilds({ limit: GUILDS_PAGE_SIZE, offset })
            : await getGuilds({ limit: GUILDS_PAGE_SIZE, offset, search });
        setGuilds((prev) =>
          isFirstPage ? result.guilds : [...prev, ...result.guilds],
        );
        setTotal(result.meta?.total_items ?? result.guilds.length);
      } catch (error) {
        toast.error(guildErrorMessage(error, "Could not load guilds."));
        if (isFirstPage) {
          setGuilds([]);
          setTotal(0);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [activeTab, search],
  );

  const loadMyGuildIds = useCallback(async () => {
    try {
      // 100 is the API's page cap; a viewer in more guilds than that may still
      // see "Join" on one of them, which the API rejects with a clear message.
      const result = await getMyGuilds({ limit: 100, offset: 0 });
      setMyGuildIds(new Set(result.guilds.map((g) => g.id)));
    } catch {
      // Non-fatal: the cards just fall back to showing "Join".
    }
  }, []);

  // `ready` gates the fetches until the auth cookie is readable, so the
  // signed-in view is not skipped by the server-render snapshot.
  useEffect(() => {
    if (!ready || !isLoggedIn) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadMyGuildIds();
  }, [ready, isLoggedIn, loadMyGuildIds]);

  useEffect(() => {
    if (!ready) return;
    // The rule flags the loading flag `load` raises before awaiting; fetching
    // the list on mount (and on tab/search changes) is the point of the effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load(0);
  }, [ready, load]);

  const onCreate = async (data: GuildFormData) => {
    setCreating(true);
    try {
      const guild = await createGuild({
        name: data.name.trim(),
        ...(data.slug ? { slug: data.slug.trim() } : {}),
        ...(data.description ? { description: data.description.trim() } : {}),
        ...(data.avatar_url ? { avatar_url: data.avatar_url.trim() } : {}),
        is_public: data.is_public,
      });
      toast.success("Guild created");
      setCreateOpen(false);
      void useGuildChatStore.getState().loadMyGuilds();
      if (guild) {
        router.push(`/guilds/${guild.slug}`);
        return;
      }
      void load(0);
    } catch (error) {
      toast.error(guildErrorMessage(error, "Could not create the guild."));
    } finally {
      setCreating(false);
    }
  };

  const onJoin = async (guild: Guild) => {
    setJoiningSlug(guild.slug);
    try {
      await joinGuild(guild.slug);
      toast.success(`Joined ${guild.name}`);
      void useGuildChatStore.getState().loadMyGuilds();
      setMyGuildIds((prev) => new Set(prev).add(guild.id));
      setGuilds((prev) =>
        prev.map((g) =>
          g.id === guild.id
            ? { ...g, member_count: g.member_count + 1 }
            : g,
        ),
      );
    } catch (error) {
      toast.error(guildErrorMessage(error, "Could not join the guild."));
    } finally {
      setJoiningSlug(null);
    }
  };

  const hasMore = guilds.length < total;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      <header className="relative overflow-hidden rounded-2xl border border-border/70 bg-card">
        <GuildBanner guildId="pilput-guilds" className="absolute inset-0 h-full sm:h-full" />
        <div className="relative flex flex-col md:flex-row md:items-end md:justify-between gap-5 px-5 py-8 sm:px-8 sm:py-10">
          <div className="space-y-2 max-w-lg">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-background/70 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground backdrop-blur">
              <Compass className="w-3 h-3" />
              Communities
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Guilds
            </h1>
            <p className="text-sm sm:text-[15px] text-muted-foreground">
              Communities on pilput. Join one to find people working on the same
              things as you.
            </p>
          </div>
          {isLoggedIn && (
            <CreateGuildDialog
              open={createOpen}
              saving={creating}
              onOpenChange={setCreateOpen}
              onSubmit={onCreate}
            />
          )}
        </div>
      </header>

      <div className="sticky top-0 z-20 -mx-4 flex flex-col gap-3 bg-background/80 px-4 py-2 backdrop-blur sm:flex-row sm:items-center">
        {isLoggedIn && (
          <Tabs
            value={activeTab}
            onValueChange={(value) => setTab(value as GuildTab)}
          >
            <TabsList>
              <TabsTrigger value="discover" className="cursor-pointer gap-1.5">
                <Compass className="w-4 h-4" />
                Discover
              </TabsTrigger>
              <TabsTrigger value="mine" className="cursor-pointer gap-1.5">
                <Users className="w-4 h-4" />
                My guilds
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}

        {activeTab === "discover" && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search guilds"
              className="pl-9 rounded-full bg-card"
              aria-label="Search guilds"
            />
          </div>
        )}
      </div>

      {loading ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i}>
              <Skeleton className="h-60 w-full rounded-2xl" />
            </li>
          ))}
        </ul>
      ) : guilds.length === 0 ? (
        <div className="border border-dashed border-border rounded-2xl py-16 px-6 text-center space-y-2">
          <span className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <Users className="w-6 h-6" />
          </span>
          <p className="font-semibold">
            {activeTab === "mine"
              ? "You have not joined any guild yet"
              : search
                ? `No guilds match "${search}"`
                : "No guilds yet"}
          </p>
          <p className="text-sm text-muted-foreground">
            {activeTab === "mine"
              ? "Browse the directory and join one, or create your own."
              : "Be the first to start a community."}
          </p>
        </div>
      ) : (
        <>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {guilds.map((guild) => (
              <li key={guild.id}>
                <GuildCard
                  guild={guild}
                  isMember={activeTab === "mine" || myGuildIds.has(guild.id)}
                  showJoin={isLoggedIn}
                  joining={joiningSlug === guild.slug}
                  onJoin={onJoin}
                />
              </li>
            ))}
          </ul>

          {hasMore && (
            <div className="flex justify-center">
              <Button
                type="button"
                variant="secondary"
                className="cursor-pointer"
                disabled={loadingMore}
                onClick={() => void load(guilds.length)}
              >
                {loadingMore && (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                )}
                Load more
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
