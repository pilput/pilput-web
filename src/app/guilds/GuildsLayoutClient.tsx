"use client";

import { useEffect } from "react";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";
import { cn } from "cn";
import { useGuildChatStore } from "@/stores/guild-chat-store";
import { authStore } from "@/stores/userStore";
import { GuildsShellProvider } from "./components/GuildsShell";
import { GuildsSidebar } from "./components/GuildsSidebar";
import { GuildsTopBar } from "./components/GuildsTopBar";

/**
 * Workspace shell for every /guilds page, in the spirit of the dashboard: a
 * custom off-canvas sidebar and a fixed-height content pane that scrolls on
 * its own, so a channel can pin its composer to the bottom.
 */
export default function GuildsLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, ready } = useIsLoggedIn();
  const fetchUser = authStore((s) => s.fetch);
  const loadMyGuilds = useGuildChatStore((s) => s.loadMyGuilds);

  useEffect(() => {
    if (!ready || !isLoggedIn) return;
    void fetchUser();
    void loadMyGuilds();
  }, [ready, isLoggedIn, fetchUser, loadMyGuilds]);

  return (
    <GuildsShellProvider>
      <div className="flex h-svh overflow-hidden bg-sidebar">
        <GuildsSidebar />
        <ContentPane>{children}</ContentPane>
      </div>
    </GuildsShellProvider>
  );
}

/** The page surface: a raised sheet beside the sidebar on desktop. */
function ContentPane({ children }: { children: React.ReactNode }) {
  return (
    <main
      className={cn(
        "flex min-w-0 flex-1 flex-col overflow-hidden bg-background",
        "md:my-2 md:mr-2 md:rounded-xl md:border md:border-border/60",
      )}
    >
      <GuildsTopBar />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</div>
    </main>
  );
}
