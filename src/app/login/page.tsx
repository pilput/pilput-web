"use client";
import React from "react";
import { useState } from "react";
import { axiosInstence2 } from "@/utils/fetch";
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
import { ArrowLeft, GithubIcon, Mail, Lock, Loader2 } from "lucide-react";
import { Config } from "@/utils/getCofig";

type Inputs = {
  email: string;
  password: string;
};

interface succesResponse {
  data: {
    access_token: string;
    refresh_token: string;
  };
  message: string;
  success: boolean;
  error: any;
}

export default function LoginPage() {
  const [loginWait, setLoginWait] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (form) => {
    setLoginWait(true);
    try {
      const { data } = await axiosInstence2.post("/v1/auth/login", form);
      const result = data as succesResponse;

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
      setLoginWait(false);
      router.push("/");
    } catch (error: any) {
      let errorMessage = "An error occurred during login";
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (error.response.status === 401) {
          errorMessage = "Invalid email or password. Please try again.";
        } else if (error.response.status === 429) {
          errorMessage = "Too many login attempts. Please try again later.";
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = "No response from server. Please check your connection.";
      } else if (error.message) {
        // Something happened in setting up the request that triggered an Error
        errorMessage = error.message;
      }
      
      toast.error(errorMessage, { duration: 5000 });
      console.error("Login error:", error);
      setLoginWait(false);
    }
  };

  function oauthGithub() {
    window.location.href = `https://${Config.apibaseurl2}/v1/auth/github`;
  }

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
            Welcome back
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-9"
                  {...register("email", { required: true })}
                />
              </div>
              {errors.email?.type === "required" && (
                <p className="text-sm text-red-500">Email is required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-9"
                  {...register("password", { required: true })}
                />
              </div>
              {errors.password?.type === "required" && (
                <p className="text-sm text-red-500">Password is required</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loginWait}>
              {loginWait ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
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

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={oauthGithub}
          >
            <GithubIcon className="mr-2 h-4 w-4" />
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
  );
}
