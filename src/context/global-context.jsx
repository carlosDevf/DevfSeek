import * as React from "react";

const GlobalContext = React.createContext();

const storage = {
  messages: [],
  currentChat: [],
};

function globalReducer(state, action) {
  switch (action.type) {
    // guarda el chat actual en el historial
    case "@save_history": {

      if (!state.currentChat?.length) return state
      const prev = localStorage.getItem("history");
      const messages = prev ? JSON.parse(prev) : [];

      const newChat = {
        // obtenemos el primer mensaje del chat como titulo
        id: crypto.randomUUID(),
        title: state.currentChat[0].text,
        content: state.currentChat
      }

      localStorage.setItem(
        "history",
        JSON.stringify([...messages, newChat]),
      );

      // TODO: IMPLEMENTAR GUARDAADO EN BASE DE DATOS EXRPRESS

      // limpiamos el chat actual
      state.currentChat = [];
      return state;
    }
    case "@load_messages": {
      // lee todos los mensajes guardados
      const history = localStorage.getItem("history");
      if (!history) {
        return { messages: [], ...state };
      }
      // evitar que el state se sobreescriba
      state.messages = JSON.parse(history);
      return { ...state };
    }
    case "@current_chat": {      
      // actulizamos el chat actual
      state.currentChat = action.payload;
      return { ...state };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function GlobalProvider({ children }) {
  const [state, dispatch] = React.useReducer(globalReducer, storage);
  const value = { state, dispatch };

  return (
    <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
  );
}

function useGlobal() {
  const context = React.useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobal must be used within a GlobalProvider");
  }

  return context;
}

// eslint-disable-next-line
export { GlobalProvider, useGlobal };
