"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LayoutDashboard, LogIn, Settings, ChevronDown, LogOut } from "lucide-react";
import { logoutUser } from "@/utils/fetch";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ButtonLogged = () => {
  const router = useRouter();
  const { isLoggedIn, ready } = useIsLoggedIn();

  // Reserve the slot until the cookie is readable so the bar doesn't reflow.
  if (!ready) {
    return <div className="h-8 w-24 animate-pulse rounded-md bg-muted/60" aria-hidden="true" />;
  }

  if (!isLoggedIn) {
    return (
      <Button
        size="sm"
        nativeButton={false}
        render={<Link href="/login" />}
        className="gap-2 rounded-full px-4 shadow-sm cursor-pointer"
      >
        <LogIn className="h-4 w-4" aria-hidden="true" />
        Login
      </Button>
    );
  }

  return (
    <div className="flex items-center">
      {/* Dashboard button */}
      <Button
        variant="outline"
        size="sm"
        nativeButton={false}
        render={<Link href="/dashboard" />}
        className="gap-2 rounded-l-full rounded-r-none border-r-0 pl-4 cursor-pointer"
      >
        <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
        Dashboard
      </Button>

      {/* Separate dropdown trigger */}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              size="sm"
              className="rounded-l-none rounded-r-full px-2 pr-3"
              aria-label="Account menu"
            />
          }
        >
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-45">
          <DropdownMenuItem
            render={
              <Link href="/account" className="flex items-center gap-2" />
            }
          >
            <Settings className="h-4 w-4" />
            Account Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => {
              await logoutUser();
              router.push("/login");
              router.refresh();
            }}
            className="gap-2 text-red-600 dark:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ButtonLogged;
