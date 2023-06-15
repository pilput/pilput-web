import { Link, useNavigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";

import {
  ArrowLeftOnRectangleIcon,
  HomeIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { getData } from "../../utils/fetch";
import { BellIcon } from "@heroicons/react/24/solid";

const storage = process.env.NEXT_PUBLIC_STORAGE;
interface YourData {
  name: string;
  username: string;
  image: string;
}

const Logged = () => {
  const nagigate = useNavigate();
  const [yourdata, setyourdata] = useState<YourData>({
    name: "Loading...",
    image: "placeholder/spinner.gif",
    username: "Loading...",
  });

  function logout() {
    Cookies.remove("token");
    nagigate("/");
  }
  async function getyourdata() {
    const response = await getData("/api/v1/profile");
    if (response.status === 200) {
      setyourdata(response.data);
    }
  }
  useEffect(() => {
    getyourdata();
  }, []);

  return (
    <main className="relative h-screen overflow-hidden bg-gray-100 dark:bg-gray-800">
      <div className="flex items-start justify-between">
        <div className="relative hidden h-screen shadow-lg lg:block w-80   ">
          <div className="flex h-full flex-col flex-1 space-y-1 bg-zinc-800 dark:bg-gray-700 text-gray-200 p-2 text-sm">
            <div className="flex justify-center my-5">
              <Link to="/" className="rounded-xl">
                <img src="/pilput.png" alt="pilput" height="50" width="100" />
              </Link>
            </div>
            <nav className="overflow-y-auto flex flex-1 flex-col border-b border-white/50">
              <Link
                to="/dashboard"
                className="flex items-center my-2 justify-start w-full py-3 px-3 transition-colors duration-200 hover:bg-zinc-700 rounded-lg dark:text-white"
              >
                <svg
                  width="20"
                  height="20"
                  fill="currentColor"
                  viewBox="0 0 2048 1792"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M1070 1178l306-564h-654l-306 564h654zm722-282q0 182-71 348t-191 286-286 191-348 71-348-71-286-191-191-286-71-348 71-348 191-286 286-191 348-71 348 71 286 191 191 286 71 348z"></path>
                </svg>
                <span className="mx-2 text-gray-200 font-normal">
                  Dashboard
                </span>
              </Link>

              <Link
                to="/dashboard/user-management"
                className="flex items-center my-2 justify-start w-full py-3 px-3 transition-colors duration-200 hover:bg-zinc-700 rounded-lg dark:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
                </svg>

                <span className="mx-2 text-gray-200 font-normal">
                  User management
                </span>
              </Link>
              <Link
                to="/dashboard/mytask"
                className="flex items-center my-2 justify-start w-full py-3 px-3 transition-colors duration-200 hover:bg-zinc-700 rounded-lg dark:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path d="M5.566 4.657A4.505 4.505 0 016.75 4.5h10.5c.41 0 .806.055 1.183.157A3 3 0 0015.75 3h-7.5a3 3 0 00-2.684 1.657zM2.25 12a3 3 0 013-3h13.5a3 3 0 013 3v6a3 3 0 01-3 3H5.25a3 3 0 01-3-3v-6zM5.25 7.5c-.41 0-.806.055-1.184.157A3 3 0 016.75 6h10.5a3 3 0 012.683 1.657A4.505 4.505 0 0018.75 7.5H5.25z" />
                </svg>

                <span className="mx-2 text-gray-200 font-normal">Task</span>
              </Link>
            </nav>

            <Link
              to="/"
              className="cursor-pointer flex space-x-2 py-3 items-center px-3 hover:bg-zinc-700 rounded-lg"
            >
              <HomeIcon className="h-4 w-4" />
              <span>Back To Home</span>
            </Link>
          </div>
        </div>
        <div className="flex flex-col relative w-full h-screen p-3 bg-stone-300">
          <header className="w-full shadow-md bg-white dark:bg-gray-700 items-center h-16 rounded-md z-20">
            <div className="relative z-20 flex flex-col justify-center h-full px-3 mx-auto flex-center">
              <div className="relative items-center pl-1 flex w-full sm:pr-2 sm:ml-0">
                <div className="container relative left-0 z-50 flex w-3/4 h-full">
                  {/* <div className="relative flex items-center w-full lg:w-64 h-full group">
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
                  </div> */}
                  <div className="flex items-center">Hello {yourdata.name}</div>
                </div>
                <div className="relative p-1 flex items-center justify-end w-1/4 ml-5 mr-4 sm:mr-0 sm:right-auto">
                  <span className="mr-4 font-semibold text-gray-700">
                    <BellIcon className="h-6 fill-slate-500" />
                  </span>
                  <Menu>
                    <Menu.Button>
                      {yourdata.image ? (
                        <img
                          alt="profil"
                          width={50}
                          height={50}
                          src={storage + yourdata.image}
                          className="mx-auto object-cover rounded-full h-10 w-10"
                        />
                      ) : (
                        <img
                          alt="profil"
                          width={50}
                          height={50}
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
                            to="/"
                            className="px-3 rounded-tl-lg py-2 w-full text-left hover:bg-slate-200 flex items-center"
                          >
                            <HomeIcon className="h-5 mr-3" /> Go Home Page
                          </Link>
                        </Menu.Item>
                        <Menu.Item>
                          <Link
                            to="/profile"
                            className="px-3 py-2 w-full text-left hover:bg-slate-200 flex items-center"
                          >
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
          <div className="h-full mt-2 p-3 bg-gray-100 shadow-md border rounded overflow-y-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Logged;
