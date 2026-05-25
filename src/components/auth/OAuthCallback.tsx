"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setCookie } from "cookies-next";
import { toast } from "sonner";
import { Loader2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Config } from "@/utils/getConfig";
import { authStore } from "@/stores/userStore";

export function OAuthCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const accessToken = searchParams.get("access_token");
  const redirectUrl = searchParams.get("redirect") || "/";

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    accessToken ? "loading" : "error"
  );
  const [errorMessage, setErrorMessage] = useState(
    accessToken ? "" : "No access token provided from the authentication provider."
  );

  useEffect(() => {
    if (!accessToken) {
      // Trigger error toast on mount if token is missing
      toast.error("Authentication failed: Missing access token");
      return;
    }

    try {
      // Set expiration: 3 hours from now (matching login page)
      const expire = new Date();
      expire.setTime(expire.getTime() + 3 * 60 * 60 * 1000);

      // Save token in cookie
      setCookie("token", accessToken, {
        expires: expire,
        path: "/",
        domain: `.${Config.maindomain}`,
        sameSite: "none",
        secure: true,
      });

      // Update auth store with user info
      authStore.getState().fetch();

      toast.success("Successfully authenticated!");

      // Redirect user to the specified redirect url or default page
      router.push(redirectUrl);
    } catch (err) {
      console.error("OAuth Callback Error:", err);
      // Use setTimeout to make state updates asynchronous, avoiding synchronous cascading renders
      setTimeout(() => {
        setStatus("error");
        setErrorMessage("An unexpected error occurred during authentication setup.");
        toast.error("Authentication setup failed.");
      }, 0);
    }
  }, [accessToken, redirectUrl, router]);

  if (status === "error") {
    return (
      <Card className="relative z-10 w-full max-w-md border-border/70 bg-card/95 shadow-xl shadow-black/5 backdrop-blur-xl dark:shadow-black/20">
        <CardHeader className="space-y-2 pb-5 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight text-destructive">
            Authentication Failed
          </CardTitle>
          <CardDescription>
            We encountered an issue during the authentication process.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-destructive/20 bg-destructive/10">
            <XCircle className="h-7 w-7 text-destructive" />
          </div>
          <p className="text-sm text-muted-foreground">
            {errorMessage || "Unable to retrieve access token. Please try logging in again."}
          </p>
          <Button
            className="w-full mt-2"
            onClick={() => router.push("/login")}
          >
            Back to Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative z-10 w-full max-w-md border-border/70 bg-card/95 p-8 shadow-xl shadow-black/5 backdrop-blur-xl dark:shadow-black/20 glass-card">
      <CardContent className="flex flex-col items-center justify-center gap-6 pt-6 text-center">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-16 w-16 animate-ping rounded-full bg-primary/20 duration-1000" />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-primary/20 bg-primary/10">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold tracking-tight">Authenticating</h3>
          <p className="text-sm text-muted-foreground">
            Please wait while we secure your session and load your profile...
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
