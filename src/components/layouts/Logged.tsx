import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { deleteCookie } from "cookies-next";
import { Menu, Transition } from "@headlessui/react";
import {
  ArrowLeftOnRectangleIcon,
  HomeIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { getData } from "../../utils/fetch";

interface Propdata {
  children: React.ReactNode;
}

interface YourData {
  name:string,
  image:string,
}

const Logged: React.FC<Propdata> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [yourdata, setyourdata] = useState<YourData>({ name: "Loading...",image:"wwww"  });
  const storage = process.env.NEXT_PUBLIC_STORAGE;

  function logout() {
    deleteCookie("token");
    router.push("/")
  }
  async function getyourdata() {
    const response = await getData("/api/v1/profile");
    if (response.status >= 200 && response.status <= 299) {
      setyourdata(response.data);
    }
  }
  useEffect(() => {
    getyourdata();
  }, []);

  return (
    <main className="bg-gray-100 dark:bg-gray-800 h-screen overflow-hidden relative">
      <div className="flex items-start justify-between">
        <div className="flex-none h-screen lg:block shadow-lg relative md:w-40 lg:w-64">
          <div className="bg-white h-full rounded-lg dark:bg-gray-700">
            <div className="flex items-center justify-center pt-6 font-bold text-3xl text-gray-700">
              <Link href="/">
                <Image src="/pilput.png" alt="pilput" height="50" width="100" />
              </Link>
            </div>
            <nav className="mt-6">
              <div>
                <Link
                  className={`w-full font-thin uppercase ${
                    pathname == "/dashboard"
                      ? "text-purple-500 border-r-4 border-purple-500 bg-gradient-to-r from-white to-blue-100"
                      : "text-gray-500"
                  }  flex items-center p-4 my-2 transition-colors duration-200 justify-start  dark:from-gray-700 dark:to-gray-800`}
                  href="/dashboard"
                >
                  <span className="text-left">
                    <svg
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 2048 1792"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M1070 1178l306-564h-654l-306 564h654zm722-282q0 182-71 348t-191 286-286 191-348 71-348-71-286-191-191-286-71-348 71-348 191-286 286-191 348-71 348 71 286 191 191 286 71 348z"></path>
                    </svg>
                  </span>
                  <span className="mx-4 text-sm font-normal">Dashboard</span>
                </Link>

                <Link
                  className={`w-full font-thin uppercase ${
                    pathname == "/dashboard/mytask"
                      ? "text-purple-500 border-r-4 border-purple-500 bg-gradient-to-r from-white to-blue-100"
                      : "text-gray-500"
                  }  flex items-center p-4 my-2 transition-colors duration-200 justify-start  dark:from-gray-700 dark:to-gray-800`}
                  href="/dashboard/mytask"
                >
                  <span className="text-left">
                    <svg
                      width="20"
                      height="20"
                      fill="currentColor"
                      className="m-auto"
                      viewBox="0 0 2048 1792"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M685 483q16 0 27.5-11.5t11.5-27.5-11.5-27.5-27.5-11.5-27 11.5-11 27.5 11 27.5 27 11.5zm422 0q16 0 27-11.5t11-27.5-11-27.5-27-11.5-27.5 11.5-11.5 27.5 11.5 27.5 27.5 11.5zm-812 184q42 0 72 30t30 72v430q0 43-29.5 73t-72.5 30-73-30-30-73v-430q0-42 30-72t73-30zm1060 19v666q0 46-32 78t-77 32h-75v227q0 43-30 73t-73 30-73-30-30-73v-227h-138v227q0 43-30 73t-73 30q-42 0-72-30t-30-73l-1-227h-74q-46 0-78-32t-32-78v-666h918zm-232-405q107 55 171 153.5t64 215.5h-925q0-117 64-215.5t172-153.5l-71-131q-7-13 5-20 13-6 20 6l72 132q95-42 201-42t201 42l72-132q7-12 20-6 12 7 5 20zm477 488v430q0 43-30 73t-73 30q-42 0-72-30t-30-73v-430q0-43 30-72.5t72-29.5q43 0 73 29.5t30 72.5z"></path>
                    </svg>
                  </span>
                  <span className="mx-4 text-sm font-normal">My tasks</span>
                </Link>
                <Link
                  className={`w-full font-thin uppercase ${
                    pathname == "/dashboard/books"
                      ? "text-purple-500 border-r-4 border-purple-500 bg-gradient-to-r from-white to-blue-100"
                      : "text-gray-500"
                  }  flex items-center p-4 my-2 transition-colors duration-200 justify-start  dark:from-gray-700 dark:to-gray-800`}
                  href="/dashboard/books"
                >
                  <span className="text-left">
                    <svg
                      width="20"
                      height="20"
                      fill="currentColor"
                      className="m-auto"
                      viewBox="0 0 2048 1792"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M960 0l960 384v128h-128q0 26-20.5 45t-48.5 19h-1526q-28 0-48.5-19t-20.5-45h-128v-128zm-704 640h256v768h128v-768h256v768h128v-768h256v768h128v-768h256v768h59q28 0 48.5 19t20.5 45v64h-1664v-64q0-26 20.5-45t48.5-19h59v-768zm1595 960q28 0 48.5 19t20.5 45v128h-1920v-128q0-26 20.5-45t48.5-19h1782z"></path>
                    </svg>
                  </span>
                  <span className="mx-4 text-sm font-normal">Book</span>
                </Link>
                <Link
                  className={`w-full font-thin uppercase ${
                    pathname == "/dashboard/manage-user"
                      ? "text-purple-500 border-r-4 border-purple-500 bg-gradient-to-r from-white to-blue-100"
                      : "text-gray-500"
                  }  flex items-center p-4 my-2 transition-colors duration-200 justify-start  dark:from-gray-700 dark:to-gray-800`}
                  href="/dashboard/manage-user"
                >
                  <span className="text-left">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                    </svg>
                  </span>
                  <span className="mx-4 text-sm font-normal">Manage user</span>
                </Link>
                <a
                  className={`w-full font-thin uppercase ${
                    pathname == "/dashboard/report"
                      ? "text-purple-500 border-r-4 border-purple-500 bg-gradient-to-r from-white to-blue-100"
                      : "text-gray-500"
                  }  flex items-center p-4 my-2 transition-colors duration-200 justify-start  dark:from-gray-700 dark:to-gray-800`}
                  href="#"
                >
                  <span className="text-left">
                    <svg
                      width="20"
                      height="20"
                      fill="currentColor"
                      className="m-auto"
                      viewBox="0 0 2048 1792"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M1024 1131q0-64-9-117.5t-29.5-103-60.5-78-97-28.5q-6 4-30 18t-37.5 21.5-35.5 17.5-43 14.5-42 4.5-42-4.5-43-14.5-35.5-17.5-37.5-21.5-30-18q-57 0-97 28.5t-60.5 78-29.5 103-9 117.5 37 106.5 91 42.5h512q54 0 91-42.5t37-106.5zm-157-520q0-94-66.5-160.5t-160.5-66.5-160.5 66.5-66.5 160.5 66.5 160.5 160.5 66.5 160.5-66.5 66.5-160.5zm925 509v-64q0-14-9-23t-23-9h-576q-14 0-23 9t-9 23v64q0 14 9 23t23 9h576q14 0 23-9t9-23zm0-260v-56q0-15-10.5-25.5t-25.5-10.5h-568q-15 0-25.5 10.5t-10.5 25.5v56q0 15 10.5 25.5t25.5 10.5h568q15 0 25.5-10.5t10.5-25.5zm0-252v-64q0-14-9-23t-23-9h-576q-14 0-23 9t-9 23v64q0 14 9 23t23 9h576q14 0 23-9t9-23zm256-320v1216q0 66-47 113t-113 47h-352v-96q0-14-9-23t-23-9h-64q-14 0-23 9t-9 23v96h-768v-96q0-14-9-23t-23-9h-64q-14 0-23 9t-9 23v96h-352q-66 0-113-47t-47-113v-1216q0-66 47-113t113-47h1728q66 0 113 47t47 113z"></path>
                    </svg>
                  </span>
                  <span className="mx-4 text-sm font-normal">Reports</span>
                </a>
                <a
                  className="w-full font-thin uppercase text-gray-500 dark:text-gray-200 flex items-center p-4 my-2 transition-colors duration-200 justify-start hover:text-blue-500"
                  href="#"
                >
                  <span className="text-left">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  <span className="mx-4 text-sm font-normal">Settings</span>
                </a>
              </div>
            </nav>
          </div>
        </div>
        <div className="flex flex-col w-full h-screen pl-0 md:p-4 md:space-y-4">
          <header className="w-full shadow-lg bg-white dark:bg-gray-700 items-center h-16 rounded-lg z-20">
            <div className="relative z-20 flex flex-col justify-center h-full px-3 mx-auto flex-center">
              <div className="relative items-center pl-1 flex w-full sm:pr-2 sm:ml-0">
                <div className="container relative left-0 z-50 flex w-3/4 h-full">
                  <div className="relative flex items-center w-full lg:w-64 h-full group">
                    <div className="absolute z-50 items-center justify-center block w-auto h-10 p-3 pr-2 text-sm text-gray-500 uppercase cursor-pointer sm:hidden">
                      <svg
                        fill="none"
                        className="relative w-5 h-5"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <svg
                      className="absolute left-0 z-20 hidden w-4 h-4 ml-4 text-gray-500 pointer-events-none fill-current group-hover:text-gray-400 sm:block"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
                    </svg>
                    <input
                      type="text"
                      className="block w-full py-1.5 pl-10 pr-4 leading-normal rounded-lg focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ring-opacity-90 bg-gray-100 dark:bg-gray-800 text-gray-400 aa-input"
                      placeholder="Search"
                    />
                    <div className="absolute right-0 hidden h-auto px-2 py-1 mr-2 text-xs text-gray-400 border border-gray-300 rounded-2xl md:block">
                      +
                    </div>
                  </div>
                </div>
                <div className="relative p-1 flex items-center justify-end w-1/4 ml-5 mr-4 sm:mr-0 sm:right-auto">
                  <span className="mr-4 font-semibold">{yourdata.name}</span>
                  <Menu>
                    <Menu.Button>
                      {yourdata.image ? (
                        <Image
                          alt="profil"
                          width={50}
                          height={50}
                          priority
                          src={storage + yourdata.image}
                          className="mx-auto object-cover rounded-full h-10 w-10"
                          unoptimized
                        />
                      ) : (
                        <Image
                          alt="profil"
                          width={50}
                          height={50}
                          priority
                          src="https://placeimg.com/640/480/any"
                          className="mx-auto object-cover rounded-full h-10 w-10"
                        />
                      )}
                    </Menu.Button>
                    <Transition
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute text-gray-600 right-5 mt-6 w-44 origin-top-right divide-y divide-gray-100 rounded-tl-lg rounded-bl-lg rounded-br-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          <Link
                            href="/"
                            className="px-3 rounded-tl-lg py-2 w-full text-left hover:bg-slate-200 flex items-center"
                          >
                            <HomeIcon className="h-5 mr-3" /> Go Home Page
                          </Link>
                        </Menu.Item>
                        <Menu.Item>
                          <Link href="/profile" className="px-3 py-2 w-full text-left hover:bg-slate-200 flex items-center">
                            <UserCircleIcon className="h-5 mr-3" /> Profile
                          </Link>
                        </Menu.Item>
                        <Menu.Item>
                          <button
                            className="px-3 rounded-b-lg py-2 w-full text-left hover:bg-slate-200 flex items-center"
                            onClick={logout}
                          >
                            <ArrowLeftOnRectangleIcon className="h-5 mr-3" />{" "}
                            Logout
                          </button>
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
          </header>
          <div className="overflow-hidden w-full h-full pb-24 pt-2 pr-2 pl-2 md:pt-0 md:pr-0 md:pl-0 text-gray-600">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Logged;