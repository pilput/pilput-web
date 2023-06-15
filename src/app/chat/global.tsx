import { getCookie } from "cookies-next";
import React, { useState, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import Link from "next/link";
import { cookies } from 'next/headers';


const Global = () => {
  const cookiesStore = cookies()
  const tokenformcookies = cookiesStore.get("token");
  if (tokenformcookies) {
    const tokenval = tokenformcookies;
  }else{
    const tokenval = "";
  }
  const [socketUrl, setSocketUrl] = useState(
    process.env.NEXT_PUBLIC_WS_HOST + "/ws/global"
  );
  const [messageHistory, setMessageHistory] = useState([]);
  const [message, setmessage] = useState("");

  const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl, {
    queryParams: {
      token: tokenval,
    },
  });

  useEffect(() => {
    if (lastMessage !== null) {
      console.log(lastMessage);
      setMessageHistory((prev) => prev.concat(lastMessage));
    }
    // console.log(messageHistory);
  }, [lastMessage]);

  const handleClickChangeSocketUrl = () => {
    setSocketUrl("wss://google.com")
    setSocketUrl(process.env.NEXT_PUBLIC_WS_HOST + "/ws/global");
    console.log("reconnect seharusnya");
  };
  
  async function handleClickSendMessage(event) {
    event.preventDefault();
    await sendMessage(message);
    setmessage("");
  }

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting...",
    [ReadyState.OPEN]: "Connected",
    [ReadyState.CLOSING]: "Disconnecting...",
    [ReadyState.CLOSED]: "Disconnected",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <div className="absolute top-0 bottom-0 right-0 left-0 mx-auto px-10 py-10">
      <div>
        <Link href="/">Back to home page</Link>
      </div>
      <button
        className="p-2 bg-green-300 rounded-lg hover:bg-green-600"
        onClick={handleClickChangeSocketUrl}
      >
        Try To coonect
      </button>
      <div className="text-gray-500">Status: {connectionStatus}</div>
      <br></br>

      <div>
        <form className="relative flex" onSubmit={handleClickSendMessage}>
          <input
            value={message}
            onChange={(e) => setmessage(e.target.value)}
            type="text"
            className="rounded-lg border flex-1 appearance-none border-gray-500 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
            placeholder="Message.."
          />

          <button
            className="border-2 rounded-lg border-gray-700 w-60 ml-2 hover:border-green-700"
            type="submit"
            disabled={readyState !== ReadyState.OPEN}
          >
            Send
          </button>
        </form>
      </div>
      <br></br>

      {/* {lastMessage ? <span>Last message: {lastMessage.data}</span> : null} */}
      <div>
        <ul>
          {messageHistory
            .slice()
            .reverse()
            .map((message, idx) => (
              <div className={message.origin ? "" : "text-right"} key={idx}>
                {message ? message.data : null}
              </div>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default Global;
