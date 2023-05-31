"use client";
import React from "react";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { setCookie, getCookie } from "cookies-next";
import Link from "next/link";
import Loading from "@/components/modal/Loading";

const apihost = process.env.NEXT_PUBLIC_API_HOST;

export default function Login() {
  const [username, setusername] = useState("guest");
  const [password, setpassword] = useState("guest");
  const [loginwait, setloginwait] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setloginwait(true);
    var data = JSON.stringify({
      username: username,
      password: password,
    });

    var config = {
      method: "post",
      url: apihost + "/api/auth/login",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    try {
      const response = await axios(config);
      if (response.status === 200) {
        console.log(response);
        // nookies.set(null, "token", response.data.data);
        setCookie("token", response.data.access_token);
        router.push("/dashboard");
        setloginwait(false);
      }
    } catch (error) {
      console.log(error);
      alert("Username or password is wrong");
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
                <button
                  type="submit"
                  className="text-xl w-48 px-4 py-2 text-white bg-gray-800 hover:bg-gray-900 rounded-2xl"
                >
                  Login
                </button>
              </div>
            </form>
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
      {loginwait ? <Loading /> : ""}
    </main>
  );
}
