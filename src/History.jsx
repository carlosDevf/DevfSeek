import React, { useEffect, useState } from "react";
import { NewChatIcon } from "./assets/new-chat-icon.jsx";
import { useGlobal } from "./context/global-context.jsx";

export default function History() {
  const [messages, setMessages] = useState([]);
  const hook = useGlobal();
  console.log(messages, hook);

  useEffect(() => {
    const event = { type: "@load_messages" };
    setMessages(hook.dispatch(event));
    // eslint-disable-next-line
  }, []);

  const saveHistory = () => {
    const event = { type: "@save_history" };
    hook.dispatch(event);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen w-64 bg-gray-900 text-white p-4 border-r border-gray-800">
      <div className="flex flex-col items-start">
        <span className="mb-4">Logo</span>
        <div className="p-1 mt-4">
          <button            
            className="flex p-2 bg-blue-600 rounded-lg w-full hover:bg-blue-700 cursor-pointer"
            onClick={() => saveHistory()}
          >
            <NewChatIcon />{" "}
            Nuevo chat
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto mt-4 mb-4">
        <ul className="space-y-2 text-sm mt-4">
          {hook?.state?.messages?.map((msg, index) => (
            <li key={index} className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 cursor-pointer">
              {msg.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
