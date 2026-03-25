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
import { axiosInstance3 } from "@/utils/fetch";
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
      const { data } = await axiosInstance3.post(
        "/v1/auth/forgot-password",
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
        className="min-h-screen flex items-center justify-center bg-linear-to-br from-background via-primary/5 to-background p-4"
        role="main"
      >
        <Link
          className="fixed top-6 left-6 flex items-center gap-2 px-4 py-2.5 bg-card/80 backdrop-blur-md rounded-lg shadow-sm hover:shadow-lg hover:bg-primary/5 border border-border/70 transition-all duration-200 hover:scale-105 group focus:outline-none focus:ring-2 focus:ring-primary"
          href="/login"
          aria-label="Back to login page"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
          <span className="text-sm font-medium">Back to login</span>
        </Link>

        <Card className="w-full max-w-md border border-border/70 shadow-xl shadow-primary/5">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {isSent ? "Check your email" : "Forgot password?"}
            </CardTitle>
            <CardDescription className="text-center">
              {isSent
                ? "We've sent a password reset link to your email address."
                : "Enter your email address and we'll send you a link to reset your password."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSent ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
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
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
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
