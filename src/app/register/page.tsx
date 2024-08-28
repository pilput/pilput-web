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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const id = toast.loading("Loading...");
    setloginwait(true);
    try {
      const response = await axiosIntence2.post("/auth/register", data);
      toast.success("Success Create Account", { id });
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

  function checkUsername(username: string) {
    if (username.length >= 5) {
      axiosIntence2.get("/auth/username/" + username).then((res) => {
        if (res.data.exist) {
          toast.error("Username already exists. Please try again.", {
            id: "username",
          });
        } else {
          toast.success("username available", { id: "username" });
        }
      });
    }
  }

  const router = useRouter();
  const [loginwait, setloginwait] = useState(false);
  console.log(errors);

  return (
    <main className="dark:bg-gray-800 relative overflow-hidden h-screen ">
      <div className="min-h-screen flex justify-center items-center">
        <div className="py-12 px-12 bg-white rounded-2xl shadow-xl z-20">
          <div>
            <h1 className="text-3xl font-bold text-center text-gray-700 mb-4 cursor-pointer">
              Sign up
            </h1>
            <p className="w-80 text-center text-sm mb-8 font-semibold text-gray-700 tracking-wide cursor-pointer">
              Why You so interested to read
              <br />
            </p>
          </div>
          <div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="username">Username</label>
                <Input
                  id="username"
                  placeholder="Username"
                  {...register("username")}
                  aria-invalid={errors.username ? "true" : "false"}
                  className={
                    errors.username ? "border text-red-400 border-red-400" : ""
                  }
                  onBlur={(e) => checkUsername(e.target.value)}
                />
                {errors.username && (
                  <div className="text-red-500 text-xs">
                    {errors.username.message}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email">Email</label>
                <Input
                  id="email"
                  placeholder="Email"
                  {...register("email")}
                  aria-invalid={errors.email ? "true" : "false"}
                  className={
                    errors.email ? "border text-red-400 border-red-400" : ""
                  }
                />
                {errors.email && (
                  <div className="text-red-500 text-xs">
                    {errors.email.message}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="password">Password</label>
                <Input
                  id="password"
                  {...register("password")}
                  type="password"
                  placeholder="Password"
                  aria-invalid={errors.password ? "true" : "false"}
                  className={
                    errors.password ? "border text-red-400 border-red-400" : ""
                  }
                />
                {errors.password && (
                  <div className="text-red-500 text-xs">
                    {errors.password.message}
                  </div>
                )}
              </div>

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
                    Create an account
                  </Button>
                )}
              </div>
            </form>
            <div className="text-center">
              <Link href="/">
                <Button variant={"link"}>Back to home</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
