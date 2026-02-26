"use client";
import { useState, useEffect, useRef } from "react";
import { axiosInstance3 } from "@/utils/fetch";
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
  GithubIcon,
  Mail,
  Lock,
  User,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
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
      const response = await axiosInstance3.post("/v1/auth/register", data);
      const result = response.data as RegisterResponse;

      if (!result.success) {
        throw new Error(result.message || "Register failed");
      }

      toast.success("Success Create Account", { id });
      const expire = new Date();
      expire.setTime(expire.getTime() + 6 * 60 * 60 * 1000);

      setCookie("token", result.data.access_token, {
        expires: expire,
        secure: true,
        domain: `.${Config.maindomain}`,
        sameSite: "none",
      });
      router.push("/");
    } catch (error) {
      toast.error("Invalid username or password. Please try again.", { id });
    }
  };

  // Username availability (debounced inline feedback)
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
        const res = await axiosInstance3.post("/v1/auth/check-username", {
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
    <main className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-primary/5 to-background p-4">
      <Link
        className="fixed top-6 left-6 flex items-center gap-2 px-4 py-2.5 bg-card/80 backdrop-blur-md rounded-lg shadow-sm hover:shadow-lg hover:bg-primary/5 border border-border/70 transition-all duration-200 hover:scale-105 group"
        href="/"
      >
        <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
        <span className="text-sm font-medium">Back to home</span>
      </Link>

      <Card className="w-full max-w-md border border-border/70 shadow-xl shadow-primary/5">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create an account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your information to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
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
                      ? "border-green-200 bg-green-50 text-green-700"
                      : usernameStatus === "checking"
                      ? "border-border bg-muted/50 text-muted-foreground"
                      : "border-red-200 bg-red-50 text-red-600"
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
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
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
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" aria-hidden="true" />
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
              <span className="bg-white dark:bg-gray-800 px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Link
            href={`${Config.apibaseurl3}/v1/auth/oauth/github`}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 w-full"
            aria-label="Sign up with GitHub"
          >
            <GithubIcon className="mr-2 h-4 w-4" aria-hidden="true" />
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
