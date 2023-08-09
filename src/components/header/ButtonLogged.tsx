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
        <Link href={dashbaseurl || ""}>
          <Button variant={"default"}>Dashboard</Button>
        </Link>
      ) : (
        <Link href="/login">
          <Button variant={"default"}>Login</Button>
        </Link>
      )}
    </>
  );
};

export default ButtonLogged;
