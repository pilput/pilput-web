"use client";

import { useEffect } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";
import { useGuildChatStore } from "@/stores/guild-chat-store";
import { authStore } from "@/stores/userStore";
import { GuildsSidebar } from "./components/GuildsSidebar";
import { GuildsTopBar } from "./components/GuildsTopBar";

/**
 * Workspace shell for every /guilds page, in the spirit of the dashboard: a
 * collapsible sidebar and a fixed-height content pane that scrolls on its own,
 * so a channel can pin its composer to the bottom.
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
    <SidebarProvider className="h-svh overflow-hidden">
      <GuildsSidebar />
      <SidebarInset className="min-h-0 overflow-hidden md:h-[calc(100svh-1rem)]">
        <GuildsTopBar />
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
