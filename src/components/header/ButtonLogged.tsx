"use client";
import { Button } from "@/components/ui/button";
import { getCookie } from "cookies-next";
import { useState, useEffect } from "react";
import Link from "next/link";
import { User, LogIn, Settings, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ButtonLogged = () => {
  const [token, settoken] = useState("");
  useEffect(() => {
    settoken(getCookie("token")?.toString() || "");
  }, []);

  return (
    <>
      {token ? (
        <div className="flex items-center">
          {/* Dashboard button */}
          <Link href="/dashboard">
            <Button variant="default" size="sm" className="rounded-r-none gap-2">
              <User className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>

          {/* Separate dropdown trigger */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="default" size="sm" className="rounded-l-none px-2">
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/account" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Account Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  // Clear token and redirect to login
                  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                  window.location.href = "/login";
                }}
                className="text-red-600 dark:text-red-400"
              >
                <LogIn className="h-4 w-4 rotate-180" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <Link href="/login" className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md">
          <Button variant="outline" size="sm" className="gap-2">
            <LogIn className="h-4 w-4" />
            Login
          </Button>
        </Link>
      )}
    </>
  );
};

export default ButtonLogged;
