"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCookie } from "cookies-next";

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const token = getCookie("token");
    if (!token) {
      const redirectParam = encodeURIComponent(pathname);
      router.replace(`/login?redirect=${redirectParam}`);
      setIsAuthorized(false);
    } else {
      setIsAuthorized(true);
    }
  }, [pathname, router]);

  if (isAuthorized === false || isAuthorized === null) {
    return null;
  }

  return <>{children}</>;
}
