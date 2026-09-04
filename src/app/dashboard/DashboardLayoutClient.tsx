"use client";

import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Users,
  FileText,
  ArrowLeft,
  DollarSign,
  LayoutDashboard,
  CalendarRange,
  BarChart3,
  Tag,
  Plus,
  TrendingUp,
  ChevronsUpDown,
  ShieldCheck,
  User as UserIcon,
  Settings,
  LogOut,
} from "lucide-react";
import { authStore } from "@/stores/userStore";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getProfilePicture } from "@/utils/getImage";
import { logoutUser } from "@/utils/fetch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  superAdminOnly?: boolean;
  badge?: string;
  actionUrl?: string;
  actionTooltip?: string;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const navMain: NavGroup[] = [
  {
    title: "Main",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
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
        actionUrl: "/dashboard/posts/create",
        actionTooltip: "New Post",
      },
      {
        title: "Tags",
        url: "/dashboard/tags",
        icon: Tag,
        superAdminOnly: true,
        badge: "Admin",
      },
    ],
  },
  {
    title: "Finance",
    items: [
      {
        title: "Overview",
        url: "/dashboard/holdings/overview",
        icon: TrendingUp,
      },
      {
        title: "Holdings",
        url: "/dashboard/holdings",
        icon: DollarSign,
      },
      {
        title: "Calendar",
        url: "/dashboard/holdings/calendar",
        icon: CalendarRange,
      },
    ],
  },
  {
    title: "Administration",
    items: [
      {
        title: "Users",
        url: "/dashboard/users",
        icon: Users,
        superAdminOnly: true,
        badge: "Admin",
      },
      {
        title: "Reports",
        url: "/dashboard/reports",
        icon: BarChart3,
        superAdminOnly: true,
        badge: "Admin",
      },
    ],
  },
];

function checkIsActive(pathname: string, itemUrl: string): boolean {
  if (itemUrl === "/dashboard") {
    return pathname === "/dashboard";
  }
  if (itemUrl === "/dashboard/holdings") {
    if (pathname === "/dashboard/holdings") return true;
    if (
      pathname.startsWith("/dashboard/holdings/") &&
      !pathname.startsWith("/dashboard/holdings/overview") &&
      !pathname.startsWith("/dashboard/holdings/calendar")
    ) {
      return true;
    }
    return false;
  }
  return pathname === itemUrl || pathname.startsWith(`${itemUrl}/`);
}

function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = authStore((state) => state.data);
  const isSuperAdmin = user.is_super_admin;
  const { isMobile } = useSidebar();

  async function handleLogout() {
    await logoutUser();
    router.push("/");
  }

  const filteredNavMain = navMain
    .map((group) => ({
      ...group,
      items: group.items.filter(
        (item) => !item.superAdminOnly || isSuperAdmin
      ),
    }))
    .filter((group) => group.items.length > 0);

  const displayName =
    user.first_name || user.last_name
      ? `${user.first_name || ""} ${user.last_name || ""}`.trim()
      : user.username || "Account";

  const userInitial = (user.first_name?.[0] || user.username?.[0] || "U").toUpperCase();

  return (
    <Sidebar variant="inset" collapsible="icon">
      {/* Sidebar Header with Brand */}
      <SidebarHeader className="border-b border-sidebar-border/60 pb-3 pt-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              asChild
              tooltip="Pilput Dashboard"
              className="hover:bg-sidebar-accent/60 transition-colors group/brand"
            >
              <Link href="/dashboard" className="flex items-center gap-3">
                <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs ring-1 ring-primary/25 transition-transform duration-200 group-hover/brand:scale-105">
                  <span className="text-sm font-black tracking-tight">P</span>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold tracking-tight text-foreground text-sm">
                      pilput<span className="text-primary font-black">.</span>
                    </span>
                    <span className="rounded-md border border-primary/20 bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary tracking-wide uppercase">
                      Console
                    </span>
                  </div>
                  <span className="truncate text-[11px] text-muted-foreground">
                    Workspace & Analytics
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent className="gap-1 overflow-x-hidden pt-2">
        {filteredNavMain.map((group) => (
          <SidebarGroup key={group.title} className="py-1.5">
            <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 px-3">
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = checkIsActive(pathname, item.url);
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                        className={cn(
                          "relative font-medium transition-all duration-150 group/btn",
                          "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60",
                          "data-[active=true]:bg-primary/10 data-[active=true]:text-primary dark:data-[active=true]:bg-primary/20 data-[active=true]:font-semibold"
                        )}
                      >
                        <Link href={item.url} className="flex items-center gap-2.5">
                          {isActive && (
                            <span
                              aria-hidden="true"
                              className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-primary group-data-[collapsible=icon]:hidden"
                            />
                          )}
                          <item.icon
                            className={cn(
                              "size-4 shrink-0 transition-transform duration-200 group-hover/btn:scale-105",
                              isActive
                                ? "text-primary"
                                : "text-muted-foreground group-hover/btn:text-foreground"
                            )}
                          />
                          <span className="truncate">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>

                      {item.actionUrl && (
                        <SidebarMenuAction
                          asChild
                          showOnHover
                          className="hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          <Link href={item.actionUrl} title={item.actionTooltip || "Create"}>
                            <Plus className="size-3.5" />
                            <span className="sr-only">{item.actionTooltip}</span>
                          </Link>
                        </SidebarMenuAction>
                      )}

                      {item.badge && (
                        <SidebarMenuBadge className="text-[9px] uppercase font-bold tracking-wider bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded h-auto min-w-0">
                          {item.badge}
                        </SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Sidebar Footer */}
      <SidebarFooter className="border-t border-sidebar-border/60 pt-2 pb-2">
        <SidebarMenu>
          {/* Back to Website */}
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Back to Website"
              className="text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/60 transition-colors"
            >
              <Link href="/" className="flex items-center gap-2.5">
                <ArrowLeft className="size-4 shrink-0 text-muted-foreground group-hover/menu-button:text-foreground transition-colors" />
                <span className="truncate">Back to Website</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          {/* User Account / Dropdown */}
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  tooltip={displayName}
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-sidebar-accent/60 transition-colors"
                >
                  <Avatar className="h-8 w-8 rounded-lg border border-border/60 shrink-0">
                    <AvatarImage
                      src={getProfilePicture(user.image)}
                      alt={`@${user.username}`}
                    />
                    <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-semibold text-xs">
                      {userInitial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-xs leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold text-foreground">
                      {displayName}
                    </span>
                    <span className="truncate text-[11px] text-muted-foreground">
                      {user.email || `@${user.username}`}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 text-muted-foreground group-data-[collapsible=icon]:hidden shrink-0" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-lg shadow-lg border border-border/60"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={8}
              >
                <DropdownMenuLabel className="font-normal p-2">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 rounded-lg border border-border/60 shrink-0">
                      <AvatarImage
                        src={getProfilePicture(user.image)}
                        alt={`@${user.username}`}
                      />
                      <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-semibold text-xs">
                        {userInitial}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-xs leading-tight">
                      <span className="truncate font-semibold">
                        {displayName}
                      </span>
                      <span className="truncate text-[11px] text-muted-foreground">
                        {user.email || `@${user.username}`}
                      </span>
                    </div>
                  </div>
                  {isSuperAdmin && (
                    <div className="mt-2">
                      <span className="inline-flex items-center gap-1 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                        <ShieldCheck className="size-3" /> Super Admin
                      </span>
                    </div>
                  )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/${user.username}`} className="cursor-pointer">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/account" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Account Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground transition-colors" />
              </TooltipTrigger>
              <TooltipContent side="bottom" align="start">
                <div className="flex items-center gap-1.5 text-xs">
                  <span>Toggle sidebar</span>
                  <kbd className="rounded bg-muted px-1 py-0.5 text-[10px] font-mono text-muted-foreground">
                    ⌘B
                  </kbd>
                </div>
              </TooltipContent>
            </Tooltip>
            <Separator orientation="vertical" className="mr-2 h-4 opacity-50" />
            <div className="flex-1">
              <DashboardTopBar />
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-6 bg-muted/10 p-4 md:p-6">
          <main className="flex-1">
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
