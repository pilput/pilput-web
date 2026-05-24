"use client";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/utils/fetch";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";

interface ForgotPasswordFormData {
  email: string;
}

interface ForgotPasswordResponse {
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

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    mode: "onBlur",
  });

  const getErrorMessage = (error: ApiError): string => {
    if (error.response) {
      if (error.response.status === 404) {
        return "Email not found. Please check your email address.";
      } else if (error.response.data?.message) {
        return error.response.data.message;
      }
    } else if (error.request) {
      return "No response from server. Please check your connection.";
    } else if (error.message) {
      return error.message;
    }
    return "An error occurred. Please try again.";
  };

  const onSubmit: SubmitHandler<ForgotPasswordFormData> = async (form) => {
    setIsLoading(true);
    try {
      const { data } = await apiClient.post(
        "/api/auth/forgot-password",
        form
      );
      const result = data as ForgotPasswordResponse;

      if (!result.success) {
        throw new Error(result.message || "Failed to send reset email");
      }

      toast.success("Reset link sent to your email!");
      setIsSent(true);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = getErrorMessage(apiError);

      toast.error(errorMessage, { duration: 5000 });
      console.error("Forgot password error:", error);
    } finally {
      setIsLoading(false);
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
          href="/login"
          aria-label="Back to login page"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to login</span>
        </Link>

        <Card className="relative z-10 w-full max-w-md border-border/70 bg-card/95 shadow-xl shadow-black/5 backdrop-blur-xl dark:shadow-black/20">
          <CardHeader className="space-y-2 pb-5 text-center">
            <CardTitle className="text-2xl font-bold tracking-tight">
              {isSent ? "Check your email" : "Forgot password?"}
            </CardTitle>
            <CardDescription>
              {isSent
                ? "We've sent a password reset link to your email address."
                : "Enter your email address and we'll send you a link to reset your password."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSent ? (
              <div className="flex flex-col items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-md border border-emerald-200 bg-emerald-50 dark:border-emerald-900/60 dark:bg-emerald-950/30">
                  <CheckCircle className="h-7 w-7 text-emerald-600 dark:text-emerald-300" />
                </div>
                <p className="text-sm text-muted-foreground text-center">
                  Please check your inbox and follow the instructions to reset
                  your password. The link will expire in 1 hour.
                </p>
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() => router.push("/login")}
                >
                  Back to login
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4"
                noValidate
              >
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      className="pl-9"
                      aria-invalid={errors.email ? "true" : "false"}
                      aria-describedby={
                        errors.email ? "email-error" : undefined
                      }
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Please enter a valid email address",
                        },
                      })}
                    />
                  </div>
                  {errors.email && (
                    <p
                      id="email-error"
                      className="text-sm text-red-500"
                      role="alert"
                    >
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                  aria-describedby={isLoading ? "submit-status" : undefined}
                >
                  {isLoading ? (
                    <>
                      <Loader2
                        className="mr-2 h-4 w-4 animate-spin"
                        aria-hidden="true"
                      />
                      Sending...
                    </>
                  ) : (
                    "Send reset link"
                  )}
                </Button>
                {isLoading && (
                  <div id="submit-status" className="sr-only">
                    Processing request, please wait
                  </div>
                )}

                <div className="text-center text-sm text-muted-foreground">
                  Remember your password?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-primary hover:underline"
                  >
                    Sign in
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </main>
    </ErrorBoundary>
  );
}

