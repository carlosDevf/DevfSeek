import { NewChatIcon } from "./assets/new-chat-icon.jsx";

export default function History() {
  return (
    <div className="flex flex-col h-screen w-64 bg-gray-900 text-white p-4">
      <div className="flex flex-col items-start">
        <span className="mb-4">Logo</span>
        <div className="p-1 mt-4">
          <button className="flex p-2 bg-blue-600 rounded-lg w-full">
            <NewChatIcon />
            Nuevo chat
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto mt-4 mb-4">
        <ul className="space-y-2 text-sm mt-4">
          <li>Búsqueda avanzada</li>
          <li>¿Qué es React?</li>
          <li>¿Qué es un componente?</li>
          <li>¿Qué es un hook?</li>
          <li>¿Qué es un estado?</li>
          <li>¿Qué es un prop?</li>
          <li>¿Qué es un evento?</li>
          <li>¿Qué es un ciclo de vida?</li>
        </ul>
      </div>
    </div>
  );
}
