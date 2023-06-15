"use client";
import Link from "next/link";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";

export default function Dashboard() {
  return (
    <>
      <div className="min-h-screen bg-white rounded-lg p-3">
        <Link className="text-blue-500" href="/">
          Home
        </Link>
      </div>
    </>
  );
}
