"use client";
import { useState, useEffect, Suspense } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Lock,
  Loader2,
  Eye,
  EyeOff,
  CheckCircle,
} from "lucide-react";
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

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

interface ResetPasswordResponse {
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

function ResetPasswordForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    mode: "onBlur",
  });

  const password = watch("password");

  const getErrorMessage = (error: ApiError): string => {
    if (error.response) {
      if (error.response.status === 400) {
        return "Invalid or expired token. Please request a new reset link.";
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

  const onSubmit: SubmitHandler<ResetPasswordFormData> = async (form) => {
    if (!token) {
      toast.error("Invalid reset token. Please request a new reset link.");
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await axiosInstance3.post("/v1/auth/reset-password", {
        token,
        new_password: form.password,
      });
      const result = data as ResetPasswordResponse;

      if (!result.success) {
        throw new Error(result.message || "Failed to reset password");
      }

      toast.success("Password reset successfully!");
      setIsSuccess(true);
    } catch (error: unknown) {
      const apiError = error as ApiError;
      const errorMessage = getErrorMessage(apiError);

      toast.error(errorMessage, { duration: 5000 });
      console.error("Reset password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token && !isSuccess) {
    return (
      <Card className="w-full max-w-md border border-border/70 shadow-xl shadow-primary/5">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Invalid Link
          </CardTitle>
          <CardDescription className="text-center">
            The password reset link is invalid or has expired.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <p className="text-sm text-muted-foreground text-center">
            Please request a new password reset link.
          </p>
          <Button
            className="w-full"
            onClick={() => router.push("/forgot-password")}
          >
            Request new link
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md border border-border/70 shadow-xl shadow-primary/5">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          {isSuccess ? "Password reset!" : "Reset password"}
        </CardTitle>
        <CardDescription className="text-center">
          {isSuccess
            ? "Your password has been reset successfully."
            : "Enter your new password below."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSuccess ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              You can now sign in with your new password.
            </p>
            <Button
              className="w-full mt-2"
              onClick={() => router.push("/login")}
            >
              Sign in
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter new password"
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
                <p
                  id="password-error"
                  className="text-sm text-red-500"
                  role="alert"
                >
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm new password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  className="pl-9 pr-9"
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                  aria-describedby={
                    errors.confirmPassword ? "confirm-error" : undefined
                  }
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p
                  id="confirm-error"
                  className="text-sm text-red-500"
                  role="alert"
                >
                  {errors.confirmPassword.message}
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
                  Resetting...
                </>
              ) : (
                "Reset password"
              )}
            </Button>
            {isLoading && (
              <div id="submit-status" className="sr-only">
                Processing request, please wait
              </div>
            )}
          </form>
        )}
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
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

        <Suspense
          fallback={
            <Card className="w-full max-w-md border border-border/70 shadow-xl shadow-primary/5 p-8">
              <div className="flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            </Card>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </main>
    </ErrorBoundary>
  );
}
