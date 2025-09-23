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
import { useEffect } from "react";
import { useTheme } from "next-themes";
import { logOut } from "@/utils/Auth";
import { authStore } from "@/stores/userStore";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Settings, User, LogOut, Home, Moon, Sun } from "lucide-react";

const DashboardTopBar = () => {
  const yourstore = authStore();
  const { theme, setTheme } = useTheme();

  function logout() {
    logOut();
    window.location.href = "/";
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    if (!yourstore.data) {
      yourstore.fetch();
    }
  }, []);

  return (
    <TooltipProvider>
      <div className="flex items-center justify-between w-full">
        {/* Left Section - Welcome Message */}
        <div className="flex items-center">
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-foreground">
              Welcome back, {yourstore.data.first_name}!
            </h1>
            <p className="text-sm text-muted-foreground">
              Here&#39;s what&#39;s happening with your dashboard today.
            </p>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
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
                    src={getProfilePicture(yourstore.data.image)}
                    alt={`@${yourstore.data.username}`}
                  />
                  <AvatarFallback>{yourstore.data.username[0]}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {yourstore.data.first_name} {yourstore.data.last_name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {yourstore.data.email || "admin@pilput.dev"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={`/${yourstore.data.username}`}
                  className="cursor-pointer"
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
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
