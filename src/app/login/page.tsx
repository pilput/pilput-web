"use client";
import React from "react";
import { useState } from "react";
import { postDatanoauth } from "../../utils/fetch";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Link from "next/link";

const baseurl = process.env.API_HOST;

export default function Login() {
  const router = useRouter();
  const [username, setusername] = useState("guest");
  const [password, setpassword] = useState("guest");
  const [loginwait, setloginwait] = useState(false);

  function oauthgoogle() {
    window.location.href = baseurl + "/api/v2/oauth";
  }

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    const id = toast.loading("Loading...");
    setloginwait(true);
    e.preventDefault();
    const data = {
      username: username,
      password: password,
    };
    const response = await postDatanoauth("/api/auth/login", data);
    if (response.status === 200) {
      toast.success("Success login", { id });
      const expire = new Date();
      expire.setDate(expire.getDate() + 3);
      Cookies.set("token", response.data.access_token, {
        secure: true,
        sameSite: "Strict",
        expires: expire,
        domain: "pilput.dev",
      });
      setloginwait(false);
      router.push(process.env.NEXT_PUBLIC_HOST || "/");
    } else {
      toast.error("Wrong username or password", { id });
      setloginwait(false);
    }
  }

  return (
    <main className="dark:bg-gray-800 bg-white relative overflow-hidden h-screen">
      <div className="min-h-screen flex justify-center items-center">
        <div className="py-12 px-12 bg-white rounded-2xl shadow-xl z-20">
          <div>
            <h1 className="text-3xl font-bold text-center text-gray-700 mb-4 cursor-pointer">
              Sign in
            </h1>
            <p className="w-80 text-center text-sm mb-8 font-semibold text-gray-700 tracking-wide cursor-pointer">
              Lanjut aja login, ngapain baca
              <br />
            </p>
          </div>
          <div>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                required
                value={username}
                onChange={(e) => {
                  setusername(e.target.value);
                }}
                className="block text-sm py-3 px-4 rounded-lg w-full border outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                required
                onChange={(e) => {
                  setpassword(e.target.value);
                }}
                className="block text-sm py-3 px-4 rounded-lg w-full border outline-none"
              />

              <div className="flex justify-center mt-6">
                {loginwait ? (
                  <button
                    disabled
                    type="submit"
                    className="text-xl w-full px-4 py-2 text-white bg-gray-800 hover:bg-gray-900 rounded-lg cursor-not-allowed"
                  >
                    Login...
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="text-xl w-full px-4 py-2 text-white bg-gray-800 hover:bg-gray-900 rounded-lg"
                  >
                    Login
                  </button>
                )}
              </div>
            </form>
            <center className="py-3">Or</center>
            <div className="">
              <button
                onClick={oauthgoogle}
                type="button"
                className="text-white w-full  bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between dark:focus:ring-[#4285F4]/55 mr-2 mb-2"
              >
                <svg
                  className="mr-2 -ml-1 w-4 h-4"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fab"
                  data-icon="google"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 488 512"
                >
                  <path
                    fill="currentColor"
                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                  ></path>
                </svg>
                Continue with Google
                <div></div>
              </button>
            </div>
            <p className="text-center mt-3 text-black">
              username: <strong>guest</strong> password: <strong>guest</strong>
            </p>
            <div className="text-center">
              <Link className="text-blue-600 underline" href="/">
                Back Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
