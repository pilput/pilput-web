"use client";
import React from "react";
import { useState } from "react";
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
const UserSchema: z.ZodType<Inputs> = z.object({
  username: z.string().min(5).max(20),
  email: z.string().email(),
  password: z.string().min(6).max(255),
});

export default function Signup() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(UserSchema),
  });
  const onSubmit: SubmitHandler<Inputs> = async (data: any) => {
    const id = toast.loading("Loading...");
    setloginwait(true);
    try {
      const response = await axiosInstence2.post("/v1/auth/register", data);
      toast.success("Success Create Account", { id });
      const expire = new Date();

      expire.setDate(expire.getDate() + 3);

      setCookie("token", response.data.access_token, {
        expires: expire,
        domain: `.${Config.maindoman}`,
        sameSite: "strict",
      });
      setloginwait(false);
      router.push("/");
    } catch (error) {
      toast.error("Invalid username or password. Please try again.", { id });
      setloginwait(false);
    }
  };

  function checkUsername(username: string) {
    if (username.length >= 5) {
      axiosInstence
        .post("/v1/auth/check-username", {
          username: username,
        })
        .then((res) => {
          if (res.data.success && res.data.data.available) {
            toast.success(res.data.message || "username available", {
              id: "username",
            });
          } else {
            toast.error("Username already exists. Please try again.", {
              id: "username",
            });
          }
        });
    }
  }

  const router = useRouter();
  const [loginwait, setloginwait] = useState(false);
  console.log(errors);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Link
        className="fixed top-5 left-5 flex gap-2 items-center bg-white dark:bg-slate-900 rounded-md p-2 hover:bg-slate-200 dark:hover:bg-slate-800"
        href="/"
      >
        <ArrowLeft />
        Back to home
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
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="username"
                  placeholder="Enter your username"
                  className="pl-9"
                  {...register("username")}
                  aria-invalid={errors.username ? "true" : "false"}
                  onBlur={(e) => checkUsername(e.target.value)}
                />
              </div>
              {errors.username && (
                <p className="text-sm text-red-500">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-9"
                  {...register("email")}
                  aria-invalid={errors.email ? "true" : "false"}
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
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-9"
                  {...register("password")}
                  aria-invalid={errors.password ? "true" : "false"}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loginwait}>
              {loginwait ? (
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
