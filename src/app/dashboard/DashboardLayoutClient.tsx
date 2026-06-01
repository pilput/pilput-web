"use client";

import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Home,
  Users,
  FileText,
  ArrowLeft,
  DollarSign,
  LayoutDashboard,
} from "lucide-react";
import { authStore } from "@/stores/userStore";
import { AuthGuard } from "@/components/auth/AuthGuard";

const navMain = [
  {
    title: "Main",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: Home,
      },
      {
        title: "Users",
        url: "/dashboard/users",
        icon: Users,
        superAdminOnly: true,
      },
    ],
  },
  {
    title: "Content",
    items: [
      {
        title: "Posts",
        url: "/dashboard/posts",
        icon: FileText,
      },
    ],
  },
  {
    title: "Finance",
    items: [
      {
        title: "Overview",
        url: "/dashboard/holdings/overview",
        icon: LayoutDashboard,
      },
      {
        title: "Holdings",
        url: "/dashboard/holdings",
        icon: DollarSign,
      },
    ],
  },
];

function AppSidebar() {
  const pathname = usePathname();
  const isSuperAdmin = authStore((state) => state.data.is_super_admin);

  const filteredNavMain = navMain.map((group) => ({
    ...group,
    items: group.items.filter(
      (item) => !("superAdminOnly" in item && item.superAdminOnly) || isSuperAdmin
    ),
  })).filter((group) => group.items.length > 0);

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" className="px-1">
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-base font-bold tracking-tight">
                    pilput
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    Dashboard
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {filteredNavMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/" className="w-full">
                <ArrowLeft className="size-4" />
                <span>Back to Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 glass-navbar px-2 transition-[width,height] ease-linear">
          <div className="flex items-center gap-2 px-4 flex-1">
            <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground transition-colors" />
            <Separator orientation="vertical" className="mr-2 h-4 opacity-50" />
            <div className="flex-1">
              <DashboardTopBar />
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 bg-muted/10 p-4 md:p-6">
          <main className="flex-1 rounded-2xl glass-card p-4 shadow-premium md:p-6">
            {children}
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
