"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const Button = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}
  return (
    <>
      <div
        className="flex flex-row justify-between toggle"
        onClick={() => (theme == "dark" ? setTheme("light") : setTheme("dark"))}
      >
        <div className="flex items-center cursor-pointer">
          <div className="relative">
            <div className="block border-[1px] dark:border-white border-gray-200 w-8 h-5 rounded-full"></div>
            <div
              className={`absolute left-1 top-1 dark:bg-blue-500 bg-blue-500 w-3 h-3 rounded-full transition ${
                theme === "dark" ? "translate-x-3" : ""
              }`}
            ></div>
          </div>
          <div className="ml-2 dark:text-white text-gray-200 font-thin">
            Dark
          </div>
        </div>
      </div>
    </>
  );
};

export default Button;
