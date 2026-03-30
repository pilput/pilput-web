"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCookie } from "cookies-next";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const token = getCookie("token");

  useEffect(() => {
    if (!token) {
      const redirectParam = encodeURIComponent(pathname);
      router.replace(`/login?redirect=${redirectParam}`);
    }
  }, [pathname, router, token]);

  if (!token) {
    return null;
  }

  return <>{children}</>;
}
