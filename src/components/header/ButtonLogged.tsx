"use client";
import { Button } from "@/components/ui/button";
import { getCookie } from "cookies-next";
import { useState, useEffect } from "react";
import Link from "next/link";
import {dashbaseurl} from '@/utils/fetch'

const ButtonLogged = () => {
  const [token, settoken] = useState("");
  useEffect(() => {
    settoken(getCookie("token")?.toString() || "");
  }, []);

  return (
    <>
      {token ? (
        <Link className="flex items-center" href={dashbaseurl || ""}>
          <Button variant={"secondary"}>Dashboard</Button>
        </Link>
      ) : (
        <Link className="flex items-center" href="/login">
          <Button variant={"secondary"}>Login</Button>
        </Link>
      )}
    </>
  );
};

export default ButtonLogged;
