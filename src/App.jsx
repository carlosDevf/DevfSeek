import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SendHorizontal } from "lucide-react";
import { useGlobal } from "./context/global-context";
import useOllamaHook from "./api/useOllamaHook";

// Esquema de validación con Zod
const messageSchema = z.object({
  text: z
    .string()
    .min(3, "El mensaje debe tener al menos 3 caracteres")
    .max(200, "El mensaje es demasiado largo"),
});

export default function App() {
  const hook = useGlobal();
  const ollamaHook = useOllamaHook();
  const [messages, setMessages] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(messageSchema),
  });

  const onSubmit = (data) => {
    setMessages((prev) => [...prev, { text: data.text, sender: "user" }]);
    reset();

    // Simular respuesta del bot
    ollamaHook.handleSubmit(data.text);
  };

  // Al recibir chunks de streaming: actualiza SOLO el último mensaje del bot
  useEffect(() => {
    if (!ollamaHook.response) return;

    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages];
      // Encuentra el último mensaje del bot (de atrás hacia adelante)
      const lastBotIndex = [...updatedMessages]
        .reverse()
        .findIndex((msg) => msg.sender === "bot");

      if (lastBotIndex !== -1) {
        const realIndex = updatedMessages.length - 1 - lastBotIndex;
        updatedMessages[realIndex] = {
          ...updatedMessages[realIndex],
          text: ollamaHook.response,
        };
      } else {
        // fallback: si no había, lo agrega
        updatedMessages.push({ text: ollamaHook.response, sender: "bot" });
      }

      return updatedMessages;
    });
  }, [ollamaHook.response]);

  // Dispara eventos al contexto global cuando cambia el historial
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
            className={`px-4 py-2 rounded-lg ${msg.sender === "user"
                ? "bg-blue-600 self-end"
                : "bg-gray-700 self-start mt-2"
              }`}
          >
            {msg.text}
            {ollamaHook.loading && msg.sender === "bot" && index === messages.length - 1 && (
              <span className="ml-2 animate-pulse">...</span>
            )}
          </div>
        ))}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 flex flex-col bg-gray-800 space-y-2"
      >
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Escribe un mensaje..."
            className="flex-1 p-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none"
            {...register("text")}
          />
          <button
            type="submit"
            className="ml-2 p-2 bg-blue-600 rounded-lg"
          >
            <SendHorizontal size={20} />
          </button>
        </div>
        {errors.text && (
          <span className="text-red-400 text-sm">{errors.text.message}</span>
        )}
      </form>
    </div >
  );
}


// NOTA: PROMPT PROPUESTO, para clase: 
// <think> Alright, the user said "hola". That's Spanish for "hello". I should respond in a friendly manner. Maybe say "¡Hola! ¿En qué puedo ayudarte hoy?" to be welcoming and offer assistance. </think> ¡Hola! ¿En qué puedo ayudarte hoy?
// es es un ejemplo d ela repuesta del bot, como podria manejarse esta parte de forma mas natural? dame varias opciones de como podria ser la respuesta del bot, pero sin que diga "pensando" o <think>... </think> y que sea mas natural, como si fuera una persona real respondiendo.

