'use client';
import React, { useState } from "react";
import {
  ArrowRightOnRectangleIcon,
  ArrowTopRightOnSquareIcon,
  ChatBubbleLeftIcon,
  PlusSmallIcon,
  SunIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

const Chat = () => {
  const [question, setquestion] = useState("");

  async function sendQuestion(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    alert(
      "Your question " +
        question +
        " is not clear or maybe we don't know, try another question"
    );
    setquestion("");
  }
  return (
    <main className="relative h-screen overflow-hidden bg-gray-100 dark:bg-gray-800">
      <div className="flex items-start justify-between">
        <div className="relative hidden h-screen shadow-lg lg:block w-80   ">
          <div className="flex h-full flex-col flex-1 space-y-1 bg-zinc-800 dark:bg-gray-700 text-gray-200 p-2 text-sm">
            <button className="flex w-full hover:bg-zinc-700 items-center justify-start py-3 px-2 border rounded-lg">
              <PlusSmallIcon className="h-4 w-4" />
              <span className="ml-2">New chat</span>
            </button>
            <nav className="mt-6 overflow-y-auto flex flex-1 flex-col space-y-3 border-b border-white/50">
              <button className="flex items-center my-2 justify-start w-full py-3 px-3 transition-colors duration-200 hover:bg-zinc-700 rounded-lg dark:text-white">
                <ChatBubbleLeftIcon className="h-4" />
                <span className="mx-2 text-gray-200 font-normal">
                  Read the book without see
                </span>
              </button>
            </nav>
            <div className="cursor-pointer flex space-x-2 py-3 items-center px-3 hover:bg-zinc-700 rounded-lg">
              <TrashIcon className="h-4 w-4" /> <span>Clear Conversations</span>
            </div>
            
            <div className="cursor-pointer flex space-x-2 py-3 items-center px-3 hover:bg-zinc-700 rounded-lg">
              <svg
                stroke="currentColor"
                fill="currentColor"
                viewBox="0 0 640 512"
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z"></path>
              </svg>
              <span>Open Discord</span>
            </div>
            
            <Link
              href="/"
              className="cursor-pointer flex space-x-2 py-3 items-center px-3 hover:bg-zinc-700 rounded-lg"
            >
              <ArrowRightOnRectangleIcon className="h-4 w-4" />
              <span>Log out</span>
            </Link>
          </div>
        </div>
        <div className="flex flex-col relative w-full">
          <div className="h-screen flex justify-center px-4 pb-24 overflow-auto bg-zinc-700 md:px-6">
            <div>Chat</div>
          </div>
          <div className="absolute bottom-0 items-center justify-between bg-zinc-700 w-full h-24">
            <div className="block ml-6 lg:hidden">
              <button className="flex items-center p-2 text-gray-500 bg-white rounded-full shadow text-md">
                <svg
                  width="20"
                  height="20"
                  className="text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 1792 1792"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M1664 1344v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45zm0-512v128q0 26-19 45t-45 19h-1408q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h1408q26 0 45 19t19 45z"></path>
                </svg>
              </button>
            </div>
            <div className="relative z-20 flex flex-col justify-center h-full px-3 py-4 md:w-full">
              <form
                onSubmit={sendQuestion}
                className="relative flex items-center justify-center mx-72 p-1 space-x-4"
              >
                <PaperAirplaneIcon className="absolute text-zinc-400 right-5 h-5" />
                <input
                  value={question}
                  onChange={(e) => setquestion(e.target.value)}
                  type="text"
                  className="w-full py-1 px-3 items-center text-gray-200 bg-zinc-600 shadow-lg focus:ring-0 focus:outline-none h-12 rounded-lg"
                ></input>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Chat;
