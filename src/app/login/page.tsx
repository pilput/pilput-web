"use client";
import React from "react";
import { useState } from "react";
import { axiosIntence2 } from "@/utils/fetch";
import { toast } from "react-hot-toast";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubmitHandler, useForm } from "react-hook-form";
import { apibaseurl } from "@/utils/getCofig";
import { ArrowLeft, Github, GithubIcon } from "lucide-react";

type Inputs = {
  email: string;
  password: string;
};

export default function Login() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const id = toast.loading("Loading...");
    setloginwait(true);
    try {
      const response = await axiosIntence2.post("/auth/login", data);
      toast.success("Success login", { id });
      const expire = new Date();

      expire.setDate(expire.getDate() + 3);

      setCookie("token", response.data.access_token, {
        expires: expire,
        sameSite: "strict",
      });
      setloginwait(false);
      router.push("/");
    } catch (error) {
      toast.error("Invalid username or password. Please try again.", { id });
      setloginwait(false);
    }
  };
  const router = useRouter();
  const [loginwait, setloginwait] = useState(false);

  function oauthgoogle() {
    window.location.href = apibaseurl + "/auth/oauth";
  }
  function oauthgithub() {
    window.location.href = "https://hono.pilput.dev/auth/oauth/github";
  }

  return (
    <main className="dark:bg-gray-800 relative overflow-hidden h-screen">
      <a
        className="fixed top-5 left-5 flex gap-2 items-center bg-white dark:bg-slate-900 rounded-md p-2 hover:bg-slate-200 dark:hover:bg-slate-800"
        href="/"
      >
        <ArrowLeft />
        Back to home
      </a>
      <div className="min-h-screen flex justify-center items-center">
        <div className="py-12 px-12 bg-white dark:bg-slate-900 rounded-2xl shadow-xl z-20 border">
          <div>
            <h1 className="text-3xl font-bold text-center text-gray-700 mb-4 cursor-pointer">
              Sign in
            </h1>
            <p className="w-80 text-center text-sm mb-8 font-semibold text-gray-700 tracking-wide cursor-pointer">
              Why You so interested to read
              <br />
            </p>
          </div>
          {(errors.email || errors.password) && (
            <div className="py-3">
              <ol className="text-sm">
                {errors.email?.type == "required" && (
                  <li className="text-red-500">The Email field is required</li>
                )}
                {errors.password?.type == "required" && (
                  <li className="text-red-500">
                    The Password field is required
                  </li>
                )}
              </ol>
            </div>
          )}
          <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                placeholder="Username or Email"
                {...register("email", { required: true })}
                aria-invalid={errors.email ? "true" : "false"}
                className={
                  errors.email ? "border text-red-400 border-red-400" : ""
                }
              />

              <Input
                {...register("password", { required: true, minLength: 8 })}
                type="password"
                placeholder="Password"
                aria-invalid={errors.password ? "true" : "false"}
                className={
                  errors.password ? "border text-red-400 border-red-400" : ""
                }
              />

              <div className="flex justify-center mt-6">
                {loginwait ? (
                  <Button disabled type="submit" size={"lg"} className="w-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="feather feather-loader mr-2 h-4 w-4 animate-spin"
                    >
                      <line x1="12" y1="2" x2="12" y2="6"></line>
                      <line x1="12" y1="18" x2="12" y2="22"></line>
                      <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                      <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                      <line x1="2" y1="12" x2="6" y2="12"></line>
                      <line x1="18" y1="12" x2="22" y2="12"></line>
                      <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                      <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                    </svg>
                    Please Wait
                  </Button>
                ) : (
                  <Button type="submit" size={"lg"} className="w-full">
                    Login
                  </Button>
                )}
              </div>
            </form>
            <center className="py-3">Or</center>
            <div className="">
              <Button
                onClick={oauthgithub}
                type="button"
                className="w-full border border-red-500"
                size={"lg"}
                variant={"outline"}
              >
                <GithubIcon />
                Continue with Github
                <div></div>
              </Button>
            </div>
            <div className="text-center mt-4 text-sm">
              <p>dont have an account?</p>
              <Link
                href="/register"
                className="underline text-blue-500 hover:text-blue-600 hover:font-medium"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
