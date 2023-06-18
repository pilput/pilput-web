"use client";
import React from "react";
import { getCookie } from "cookies-next";
import Link from "next/link";

const ButtonLogged = () => {
  const token = getCookie("token");
  return (
    <>
      {token ? (
        <Link
          href="https://dash.pilput.dev"
          className="text-gray-900 px-4 py-2 rounded-lg bg-green-600"
        >
          Dashboard
        </Link>
      ) : (
        <Link
          href="/login"
          className="text-gray-100 bg-blue-400 px-4 py-2 rounded-xl hover:bg-blue-500"
        >
          Login
        </Link>
      )}
    </>
  );
};

export default ButtonLogged;
