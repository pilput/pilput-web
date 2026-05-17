"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getProfilePicture } from "@/utils/getImage";
import { useTheme } from "next-themes";
import { logOut } from "@/utils/Auth";
import { authStore } from "@/stores/userStore";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Settings, User, LogOut, Home, Moon, Sun } from "lucide-react";

const DashboardTopBar = () => {
  const user = authStore((state) => state.data);
  const fetchUser = authStore((state) => state.fetch);
  const { theme, setTheme } = useTheme();

  function logout() {
    logOut();
    window.location.href = "/";
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <TooltipProvider>
      <div className="flex items-center justify-between w-full">
        {/* Left Section - Welcome Message */}
        <div className="hidden sm:flex items-center">
          <div className="flex flex-col">
            <h1 className="text-base md:text-lg font-semibold text-foreground truncate max-w-[200px] md:max-w-[300px] lg:max-w-none">
              Welcome back, {user.first_name || user.username || "there"}
            </h1>
            <p className="hidden text-xs text-muted-foreground md:block">
              Manage publishing, readers, and account activity.
            </p>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-1 md:gap-2 ml-auto">
          {/* Theme Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-md">
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle theme</p>
            </TooltipContent>
          </Tooltip>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={getProfilePicture(user.image)}
                    alt={`@${user.username}`}
                  />
                  <AvatarFallback>{user.username?.[0] || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email || "admin@pilput.net"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={`/${user.username}`}
                  className="cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/account" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Account Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/" className="cursor-pointer">
                  <Home className="mr-2 h-4 w-4" />
                  <span>Go Home</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default DashboardTopBar;
import { useEffect } from "react";
