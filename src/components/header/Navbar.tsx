"use client";
import Link from "next/link";
import React, { useState } from "react";
import ButtonLogged from "./ButtonLogged";
import { usePathname } from "next/navigation";
import DarkModeButton from './Darkmode'

const navigation = [
  { name: "Home", href: "/" },
  { name: "Blog", href: "/blogs" },
  //   { name: "Forum", href: "/chat" },
];

const Navbar = () => {
  const pathname = usePathname();
  const [showmenu, setshowmenu] = useState(false);
  function toggleMenu() {
    setshowmenu((prev) => !prev);
  }
  return (
    <div className="bg-zinc-800">
      <nav className="relative select-none lg:flex lg:items-stretch w-full max-w-7xl mx-auto">
        <div className="flex flex-no-shrink items-stretch h-20">
          <Link
            href="/"
            className="flex-no-grow flex-no-shrink relative py-2 px-4 leading-normal text-white no-underline flex items-center hover:bg-grey-dark font-bold"
          >
            PILPUT
          </Link>

          <button className="block lg:hidden cursor-pointer ml-auto relative w-12 h-20 p-4">
            <svg
              onClick={toggleMenu}
              className={`${showmenu ? "hidden" : ""} fill-current text-white`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
            </svg>
            <svg
              onClick={toggleMenu}
              className={`${showmenu ? "" : "hidden"} fill-current text-white`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M10 8.586L2.929 1.515 1.515 2.929 8.586 10l-7.071 7.071 1.414 1.414L10 11.414l7.071 7.071 1.414-1.414L11.414 10l7.071-7.071-1.414-1.414L10 8.586z" />
            </svg>
          </button>
          
        </div>
        <div className="lg:flex lg:items-stretch lg:flex-no-shrink lg:flex-grow items-center">
          <div
            className={`${
              showmenu ? "" : "hidden"
            } lg:flex lg:items-stretch lg:justify-end ml-auto`}
          >
            {navigation.map((data, id) => (
              <Link
                key={id}
                href={data.href}
                className={`flex-no-grow flex-no-shrink relative py-2 px-4 leading-normal text-white flex items-center hover:bg-grey-dark ${
                  pathname === data.href ? "underline" : ""
                }`}
              >
                {data.name}
              </Link>
            ))}
            <div className="flex items-center py-4 mx-3">
              <ButtonLogged />
            </div>
            <div className="flex items-center py-4 mx-3">
              <DarkModeButton />
            </div>
            
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
