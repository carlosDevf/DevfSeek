# DevfSeek

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Base del proyecto

- Vite npm init @vitejs/app
- Lucid React npm install --save lucid-react
- Tailwindcss npm install tailwindcss
  - Seguir las instrucciones de la documentación oficial para instalar tailwindcss con Vite
    - https://tailwindcss.com/docs/installation/using-vite

## Parte 2 - Funcionalidad del Chat y Nuevo Chat

```javascript
const [messages, setMessages] = useState([]);
const [input, setInput] = useState("");

const sendMessage = async (e) => {
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
```

- Crear un boton para limpiar el chat y guardar el historial de mensajes en un una BD

## Parte 3 - Contexto Entre Componentes conReducer

### Creando un contexto y reducer con las mejores practicas

    - https://kentcdodds.com/blog/how-to-use-react-context-effectively
    - Uso de reducer y context para manejar el estado de la aplicación

    


