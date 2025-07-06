// LOWDB es un ESM package, por lo que debes usar import en lugar de require.
// Explicar y hacer los ajustes necesarios para que funcione en un entorno ESM.

import express from 'express';
import axios from 'axios';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const app = express();
const port = 8080;

// Middleware para parsear JSON
app.use(express.json());
// configurar lowdb
const adapter = new JSONFile('db.json');
const db = new Low(adapter, { messages: [], currentChat: [] });

// crear una base de datos
await db.read();
db.data ||= { messages: [], currentChat: [] };

// Ruta GET
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Ruta POST
app.post('/data', (req, res) => {
  console.log('Body recibido:', req.body);
  res.json({
    message: 'Datos recibidos correctamente',
    data: req.body,
  });
});

// Endpoint para recibir el prompt
app.post('/api/ask', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // Llamada a Ollama SIN streaming
    const ollamaResponse = await axios.post(
      'http://localhost:11434/api/generate',
      {
        model: 'deepseek-r1:1.5b',
        prompt,
        max_tokens: 500,
        stream: false,
      },
    );

    // Ollama devuelve un JSON directo
    let result = ollamaResponse.data?.response || '';

    // Limpia cualquier etiqueta <think>...</think> si existe
    result = result.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

    res.json({ response: result });
  } catch (error) {
    console.error('Error en /api/ask:', error);
    res.status(500).json({ error: error.message || 'Error interno' });
  }
});

// Endpoint para obtener todos los mensajes
app.get('/api/messages', async (req, res) => {
  await db.read();
  res.json(db.data.messages);
});

// Endpoint para guardar un mensaje
app.post('/api/messages', async (req, res) => {
  const { id, title, content } = req.body;
  if (!id || !title || !content) {
    return res
      .status(400)
      .json({ error: 'ID, title and content are required' });
  }

  db.data.messages.push({
    id,
    title,
    content,
  });
  await db.write();

  res.status(201).json({ message: 'Message saved successfully' });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
