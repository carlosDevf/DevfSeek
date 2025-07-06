import { useState, useEffect } from "react";
import { SendHorizontal } from "lucide-react";
import { useGlobal } from "./context/global-context";

export default function App() {
  const hook = useGlobal()
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { text: input, sender: "user" }]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "Respuesta generada...", sender: "bot" },
      ]);
    }, 1000);
  };

  useEffect(() => {
    if (!messages.length) return;
    const event = { type: "@current_chat", payload: messages };
    hook.dispatch(event);
  }, [messages]);

  return (
    <div className="flex flex-col h-screen w-full bg-gray-900 text-white justify-end">
      <div className="flex-1 overflow-y-auto p-4 space-y-2 flex flex-col">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-xs px-4 py-2 rounded-lg ${
              msg.sender === "user"
                ? "bg-blue-600 self-end"
                : "bg-gray-700 self-start"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
      <div className="p-4 flex items-center bg-gray-800">
        <input
          type="text"
          className="flex-1 p-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="ml-2 p-2 bg-blue-600 rounded-lg"
          onClick={sendMessage}
        >
          <SendHorizontal size={20} />
        </button>
      </div>
    </div>
  );
}
