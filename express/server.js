const express = require('express');
const axios = require('axios');

const app = express();
const port = 8080;

// Middleware para parsear JSON
app.use(express.json());

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
        stream: false
      }
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

