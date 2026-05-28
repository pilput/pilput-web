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
import { apiClient } from "@/utils/fetch";

// Map backend error types to user-friendly messages
const ERROR_MESSAGES: Record<string, string> = {
  missing_code: "Authorization code is missing from the callback request.",
  invalid_state: "Security validation (CSRF state) failed. Please try again.",
  github_token_failed: "Failed to exchange authorization code with GitHub.",
  github_user_failed: "Failed to retrieve your profile information from GitHub.",
  oauth_login_failed: "Failed to register or login with your GitHub account.",
  oauth_exchange_failed: "Failed to generate local authorization tokens.",
};

export function OAuthCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const code = searchParams.get("code");
  const errorType = searchParams.get("error");
  const redirectUrl = searchParams.get("redirect") || "/";

  const getInitialErrorMessage = () => {
    if (errorType) {
      return ERROR_MESSAGES[errorType] || `Authentication failed: ${errorType}`;
    }
    if (!code) {
      return "No authorization code provided from the authentication provider.";
    }
    return "";
  };

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    code && !errorType ? "loading" : "error"
  );
  const [errorMessage, setErrorMessage] = useState(getInitialErrorMessage());

  useEffect(() => {
    if (errorType) {
      toast.error(`Authentication failed: ${ERROR_MESSAGES[errorType] || errorType}`);
      return;
    }

    if (!code) {
      toast.error("Authentication failed: Missing authorization code");
      return;
    }

    let isSubscribed = true;

    const exchangeCode = async () => {
      try {
        const response = await apiClient.post<{
          success: boolean;
          message: string;
          data: {
            access_token: string;
            refresh_token: string;
            user: {
              id: string;
              email: string;
              username: string;
            };
          };
        }>("/api/auth/oauth/exchange", { code });

        if (!isSubscribed) return;

        const result = response.data;
        if (!result.success || !result.data?.access_token) {
          throw new Error(result.message || "Failed to exchange OAuth code.");
        }

        // Set expiration: 3 hours from now (matching login page)
        const expire = new Date();
        expire.setTime(expire.getTime() + 3 * 60 * 60 * 1000);

        // Save token in cookie
        setCookie("token", result.data.access_token, {
          expires: expire,
          path: "/",
          domain: `.${Config.maindomain}`,
          sameSite: "none",
          secure: true,
        });

        // Update auth store with user info
        await authStore.getState().fetch();

        toast.success("Successfully authenticated!");

        // Redirect user to the specified redirect url or default page
        router.push(redirectUrl);
      } catch (err: any) {
        console.error("OAuth Callback Error:", err);
        if (!isSubscribed) return;

        let message = "An unexpected error occurred during authentication setup.";
        if (err.response?.data?.message) {
          message = err.response.data.message;
        } else if (err.message) {
          message = err.message;
        }

        setStatus("error");
        setErrorMessage(message);
        toast.error(message);
      }
    };

    exchangeCode();

    return () => {
      isSubscribed = false;
    };
  }, [code, errorType, redirectUrl, router]);

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
