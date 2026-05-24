"use client";
import { useState, useEffect, useRef } from "react";
import { apiClient } from "@/utils/fetch";
import { toast } from "sonner";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Lock,
  Mail,
  User,
  XCircle,
} from "lucide-react";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
import { Config } from "@/utils/getConfig";

type Inputs = {
  email: string;
  username: string;
  password: string;
};

interface RegisterResponse {
  data: {
    access_token: string;
    refresh_token: string;
  };
  message: string;
  success: boolean;
}

const UserSchema = z.object({
  username: z.string().min(5).max(20),
  email: z.string().email(),
  password: z.string().min(6).max(255),
});

export default function Signup() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    resolver: zodResolver(UserSchema),
  });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const id = toast.loading("Loading...");
    try {
      const response = await apiClient.post("/api/auth/register", data);
      const result = response.data as RegisterResponse;

      if (!result.success) {
        throw new Error(result.message || "Register failed");
      }

      toast.success("Account created successfully", { id });
      const expire = new Date();
      expire.setTime(expire.getTime() + 3 * 60 * 60 * 1000); // 3 hours from now

      setCookie("token", result.data.access_token, {
        expires: expire,
        secure: true,
        path: "/",
        domain: `.${Config.maindomain}`,
        sameSite: "none",
      });
      router.push("/");
    } catch (error) {
      toast.error("Invalid username or password. Please try again.", { id });
    }
  };

  // Username availability (debounced inline feedback)
  // eslint-disable-next-line react-hooks/incompatible-library
  const username = watch("username");
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "error"
  >("idle");
  const [usernameMessage, setUsernameMessage] = useState<string>("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);
  useEffect(() => {
    // Clear pending timers
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // Reset if empty or too short
    if (!username || username.trim().length < 5) {
      setUsernameStatus("idle");
      setUsernameMessage("");
      return;
    }

    // Debounce request
    setUsernameStatus("checking");
    setUsernameMessage("Checking availability...");
    const currentRequestId = ++requestIdRef.current;
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await apiClient.post("/api/auth/check-username", {
          username: username.trim(),
        });
        if (currentRequestId !== requestIdRef.current) return; // stale
        const exists = res?.data?.data?.exists;
        const available =
          typeof exists === "boolean"
            ? !exists
            : Boolean(res?.data?.data?.available);
        if (res?.data?.success && available) {
          setUsernameStatus("available");
          setUsernameMessage("Username is available");
        } else {
          setUsernameStatus("taken");
          setUsernameMessage("Username is already taken");
        }
      } catch (e) {
        if (currentRequestId !== requestIdRef.current) return; // stale
        setUsernameStatus("error");
        setUsernameMessage("Could not check username. Please try again.");
      }
    }, 500);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [username]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      <div className="absolute inset-x-0 top-0 h-72 bg-linear-to-b from-muted/70 to-transparent dark:from-muted/25" />
      <div className="absolute inset-y-0 right-0 hidden w-1/2 border-l border-border/60 bg-muted/25 lg:block" />
      <Link
        className="fixed left-4 top-4 z-10 flex items-center gap-2 rounded-md border border-border/70 bg-background/85 px-3 py-2 text-sm font-medium shadow-sm backdrop-blur-md transition-colors hover:bg-accent/70 focus:outline-none focus:ring-2 focus:ring-ring sm:left-6 sm:top-6"
        href="/"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to home</span>
      </Link>

      <Card className="relative z-10 w-full max-w-md border-border/70 bg-card/95 shadow-xl shadow-black/5 backdrop-blur-xl dark:shadow-black/20">
        <CardHeader className="space-y-2 pb-5 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Create an account
          </CardTitle>
          <CardDescription>
            Enter your information to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="username"
                  placeholder="Enter your username"
                  className="pl-9 pr-9"
                  {...register("username")}
                  aria-invalid={errors.username ? "true" : "false"}
                  autoComplete="username"
                  disabled={isSubmitting}
                />
                {!errors.username && usernameStatus === "checking" && (
                  <Loader2
                    className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground"
                    aria-hidden="true"
                  />
                )}
                {!errors.username && usernameStatus === "available" && (
                  <CheckCircle2
                    className="absolute right-3 top-3 h-4 w-4 text-green-600"
                    aria-hidden="true"
                  />
                )}
                {!errors.username &&
                  (usernameStatus === "taken" || usernameStatus === "error") && (
                    <XCircle
                      className="absolute right-3 top-3 h-4 w-4 text-red-500"
                      aria-hidden="true"
                    />
                  )}
              </div>
              {errors.username && (
                <p className="text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}
              {!errors.username && usernameStatus !== "idle" && (
                <p
                  className={`rounded-md border px-3 py-2 text-sm ${
                    usernameStatus === "available"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300"
                      : usernameStatus === "checking"
                      ? "border-border bg-muted/50 text-muted-foreground"
                      : "border-red-200 bg-red-50 text-red-600 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
                  }`}
                  aria-live="polite"
                  role="status"
                >
                  {usernameMessage}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-9"
                  {...register("email")}
                  aria-invalid={errors.email ? "true" : "false"}
                  autoComplete="email"
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-9"
                  {...register("password")}
                  aria-invalid={errors.password ? "true" : "false"}
                  autoComplete="new-password"
                  disabled={isSubmitting}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create an account"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Link
            href={`${Config.apibaseurl}/api/auth/oauth/github`}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full"
            aria-label="Sign up with GitHub"
          >
            <GitHubIcon className="mr-2 h-4 w-4" aria-hidden="true" />
            Github
          </Link>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </main>
  );
}

