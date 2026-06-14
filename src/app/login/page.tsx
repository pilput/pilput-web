"use client";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  User,
} from "lucide-react";
import { GitHubIcon } from "@/components/icons/GitHubIcon";
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
import { apiClient } from "@/utils/fetch";
import { Config } from "@/utils/getConfig";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { motion } from "framer-motion";


interface LoginFormData {
  identifier: string;
  password: string;
}

interface AuthResponse {
  data: {
    access_token: string;
    refresh_token: string;
  };
  message: string;
  success: boolean;
  error?: unknown;
}

interface ApiError {
  response?: {
    status: number;
    data?: {
      message: string;
    };
  };
  request?: any;
  message?: string;
}

export default function LoginPage() {
  const [loginWait, setLoginWait] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Check for redirect parameter from URL (from proxy middleware)
  const redirectParam = new URLSearchParams(
    typeof window !== "undefined" ? window.location.search : "",
  ).get("redirect");
  const redirectUrl = redirectParam ? decodeURIComponent(redirectParam) : null;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    mode: "onBlur",
  });

  const getErrorMessage = (error: ApiError): string => {
    if (error.response) {
      if (error.response.status === 401) {
        return "Invalid username/email or password. Please try again.";
      } else if (error.response.status === 429) {
        return "Too many login attempts. Please try again later.";
      } else if (error.response.data?.message) {
        return error.response.data.message;
      }
    } else if (error.request) {
      return "No response from server. Please check your connection.";
    } else if (error.message) {
      return error.message;
    }
    return "An error occurred during login";
  };

  const onSubmit: SubmitHandler<LoginFormData> = async (form) => {
    setLoginWait(true);
    try {
      const { data } = await apiClient.post("/api/auth/login", form);
      const result = data as AuthResponse;

      if (!result.success) {
        throw new Error(result.message || "Login failed");
      }

      const expire = new Date();
      expire.setTime(expire.getTime() + 3 * 60 * 60 * 1000); // 3 hours from now

      setCookie("token", result.data.access_token, {
        expires: expire,
        path: "/",
        domain: `.${Config.maindomain}`,
        sameSite: "none",
        secure: true,
      });

      toast.success("Login successful! Redirecting...");

      // Redirect to the stored URL or default to home
      if (redirectUrl) {
        // Redirect to the original URL
        router.push(redirectUrl);
      } else {
        // Default redirect to home
        router.push("/");
      }
      setLoginWait(false);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = getErrorMessage(apiError);

      toast.error(errorMessage, { duration: 5000 });
      console.error("Login error:", error);

      setLoginWait(false);
    }
  };

  return (
    <ErrorBoundary>
      <main
        className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4"
        role="main"
      >
        <div className="absolute inset-x-0 top-0 h-72 bg-linear-to-b from-muted/70 to-transparent dark:from-muted/25" />
        <div className="absolute inset-y-0 right-0 hidden w-1/2 border-l border-border/60 bg-muted/25 lg:block" />
        <Link
          className="fixed left-4 top-4 z-10 flex items-center gap-2 rounded-md border border-border/70 bg-background/85 px-3 py-2 text-sm font-medium shadow-sm backdrop-blur-md transition-colors hover:bg-accent/70 focus:outline-none focus:ring-2 focus:ring-ring sm:left-6 sm:top-6"
          href="/"
          aria-label="Back to home page"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to home</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="relative z-10 w-full max-w-md"
        >
          <Card className="w-full border-border/70 bg-card/95 shadow-xl shadow-black/5 backdrop-blur-xl dark:shadow-black/20">
            <CardHeader className="space-y-2 pb-5 text-center">
              <CardTitle className="text-2xl font-bold tracking-tight">
                Welcome back
              </CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
                noValidate
              >
                <div className="space-y-2">
                  <Label htmlFor="identifier">Username or Email</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="identifier"
                      type="text"
                      placeholder="Enter your username or email"
                      className="pl-9"
                      aria-invalid={errors.identifier ? "true" : "false"}
                      aria-describedby={errors.identifier ? "identifier-error" : undefined}
                      {...register("identifier", {
                        required: "Username or email is required",
                      })}
                    />
                  </div>
                  {errors.identifier && (
                    <p
                      id="identifier-error"
                      className="text-sm text-red-500"
                      role="alert"
                    >
                      {errors.identifier.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-9 pr-9"
                      aria-invalid={errors.password ? "true" : "false"}
                      aria-describedby={
                        errors.password ? "password-error" : undefined
                      }
                      {...register("password", {
                        required: "Password is required",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters",
                        },
                      })}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p
                      id="password-error"
                      className="text-sm text-red-500"
                      role="alert"
                    >
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loginWait}
                  aria-describedby={loginWait ? "login-status" : undefined}
                >
                  {loginWait ? (
                    <>
                      <Loader2
                        className="mr-2 h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
                {loginWait && (
                  <div id="login-status" className="sr-only">
                    Processing login request, please wait
                  </div>
                )}
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
                aria-label="Sign in with GitHub"
              >
                <GitHubIcon className="mr-2 h-4 w-4" aria-hidden="true" />
                Github
              </Link>

              <div className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link
                  href="/register"
                  className="font-medium text-primary hover:underline"
                >
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </main>
    </ErrorBoundary>
  );
}

