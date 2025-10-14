"use client";
import { Button } from "@/components/ui/button";
import { getCookie } from "cookies-next";
import { useState, useEffect } from "react";
import Link from "next/link";
import { User, LogIn } from "lucide-react";

const ButtonLogged = () => {
  const [token, settoken] = useState("");
  useEffect(() => {
    settoken(getCookie("token")?.toString() || "");
  }, []);

  return (
    <>
      {token ? (
        <Link href="/dashboard" className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md">
          <Button variant="default" size="sm" className="gap-2">
            <User className="h-4 w-4" />
            Dashboard
          </Button>
        </Link>
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
