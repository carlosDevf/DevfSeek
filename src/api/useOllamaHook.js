import { useState } from 'react';

function useOllamaHook() {
  const [response, setResponse] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // NOTA: se podria manejar primero con el stream en false para obtener la respuesta completa y manejo mas rapido y sencillo para explicarle al alumno, ya despues se puede explicar el streaming y como se maneja, pero para que no se complique tanto al principio, se puede manejar con el stream en false y luego explicar el streaming como una mejora de la experiencia de usuario.
  const handleSubmit = async (_prompt) => {
    console.log('handleSubmit called with prompt:', _prompt);
    setLoading(true);
    setResponse('');
    setError(null);

    try {
      const res = await fetch('http://localhost:11434/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'deepseek-r1:1.5b',
          prompt: _prompt,
          max_tokens: 500,
          // NOTE: PARA UNA RESPUESTA MÁS RÁPIDA, PUEDES QUITAR EL STREAMING
          stream: true,
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error('Respuesta inválida');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // Procesa líneas completas
        const lines = buffer.split('\n');
        buffer = lines.pop(); // la última línea puede estar incompleta

        for (const line of lines) {
          if (!line.trim()) continue;

          try {
            const parsed = JSON.parse(line);
            if (parsed.done) {
              console.log('🟢 FIN DE GENERACIÓN');
              return; // o podrías hacer setLoading(false) aquí y seguir leyendo hasta done
            }
            if (parsed.response) {
              setResponse((prev) => prev + parsed.response);
            }
          } catch (err) {
            console.warn('❗ Error parseando línea JSON', err, line);
          }
        }
      }
    } catch (err) {
      console.error('Error en streaming:', err);
      setError(err.message || 'Error en streaming');
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, response, error, loading };
}

export default useOllamaHook;
