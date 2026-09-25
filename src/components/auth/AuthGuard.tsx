"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useIsLoggedIn } from "@/hooks/useIsLoggedIn";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoggedIn, ready } = useIsLoggedIn();

  useEffect(() => {
    if (ready && !isLoggedIn) {
      const redirectParam = encodeURIComponent(pathname);
      router.replace(`/login?redirect=${redirectParam}`);
    }
  }, [pathname, router, isLoggedIn, ready]);

  if (!ready || !isLoggedIn) {
    return null;
  }

  return <>{children}</>;
}
