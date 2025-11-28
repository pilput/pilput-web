"use client";
import { useState, useEffect, useRef } from "react";
import { axiosInstence, axiosInstence2 } from "@/utils/fetch";
import { toast } from "react-hot-toast";
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
import { ArrowLeft, Mail, Lock, User, Loader2 } from "lucide-react";
import { Config } from "@/utils/getCofig";

type Inputs = {
  email: string;
  username: string;
  password: string;
};
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
  const onSubmit: SubmitHandler<Inputs> = async (data: any) => {
    const id = toast.loading("Loading...");
    try {
      const response = await axiosInstence2.post("/v1/auth/register", data);
      toast.success("Success Create Account", { id });
      const expire = new Date();

      expire.setDate(expire.getDate() + 3);

      setCookie("token", response.data.access_token, {
        expires: expire,
        domain: `.${Config.maindoman}`,
        sameSite: "none",
        secure: true,
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
        const res = await axiosInstence.post("/v1/auth/check-username", {
          username: username.trim(),
        });
        if (currentRequestId !== requestIdRef.current) return; // stale
        const available = Boolean(res?.data?.data?.available);
        if (res?.data?.success && available) {
          setUsernameStatus("available");
          setUsernameMessage(res?.data?.message || "Username is available");
        } else {
          setUsernameStatus("taken");
          setUsernameMessage(
            res?.data?.message || "Username already exists. Please try again."
          );
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
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Link
        className="fixed top-6 left-6 flex items-center gap-2 px-4 py-2.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all duration-200 hover:scale-105 group"
        href="/"
      >
        <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
        <span className="text-sm font-medium">Back to home</span>
      </Link>

      <Card className="w-full max-w-md">
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
                  className="pl-9"
                  {...register("username")}
                  aria-invalid={errors.username ? "true" : "false"}
                  autoComplete="username"
                  disabled={isSubmitting}
                />
              </div>
              {errors.username && (
                <p className="text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}
              {!errors.username && usernameStatus !== "idle" && (
                <p
                  className={`text-sm ${
                    usernameStatus === "available"
                      ? "text-green-600"
                      : usernameStatus === "checking"
                      ? "text-muted-foreground"
                      : "text-red-500"
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
