"use client";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "react-hot-toast";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, GithubIcon, Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
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
import { axiosInstence2 } from "@/utils/fetch";
import { Config } from "@/utils/getCofig";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";

interface LoginFormData {
  email: string;
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
  const redirectParam = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "").get('redirect');
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
        return "Invalid email or password. Please try again.";
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
      const { data } = await axiosInstence2.post("/v1/auth/login", form);
      const result = data as AuthResponse;

      if (!result.success) {
        throw new Error(result.message || "Login failed");
      }

      const expire = new Date();
      expire.setTime(expire.getTime() + 6 * 60 * 60 * 1000); // 6 hours from now

      setCookie("token", result.data.access_token, {
        expires: expire,
        domain: `.${Config.maindoman}`,
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

  function oauthGithub() {
    // For GitHub OAuth, we could theoretically store the redirect URL,
    // but this depends on how your backend handles OAuth state.
    // For now, we'll keep it simple - the backend should handle redirect
    // after OAuth completion if it's set up to do so.
    window.location.href = `${Config.apibaseurl2}/v1/auth/github`;
  }

  return (
    <ErrorBoundary>
      <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4" role="main">
      <Link
        className="fixed top-6 left-6 flex items-center gap-2 px-4 py-2.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all duration-200 hover:scale-105 group focus:outline-none focus:ring-2 focus:ring-primary"
        href="/"
        aria-label="Back to home page"
      >
        <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
        <span className="text-sm font-medium">Back to home</span>
      </Link>

      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Welcome back
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-9"
                  aria-invalid={errors.email ? "true" : "false"}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="text-sm text-red-500" role="alert">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-9 pr-9"
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "password-error" : undefined}
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
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p id="password-error" className="text-sm text-red-500" role="alert">
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
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
              <span className="bg-white dark:bg-gray-800 px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={oauthGithub}
            aria-label="Sign in with GitHub"
          >
            <GithubIcon className="mr-2 h-4 w-4" aria-hidden="true" />
            Github
          </Button>

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
    </main>
    </ErrorBoundary>
  );
}
