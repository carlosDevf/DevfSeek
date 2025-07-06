import express from 'express';
import axios from 'axios';
import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 8080;

app.use(express.json());

// Leer variables de entorno
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'chatdb';

// Configurar MongoDB
const client = new MongoClient(MONGODB_URI);
await client.connect();
console.log('✅ Connected to MongoDB');

const db = client.db(DB_NAME);
const messagesCollection = db.collection('messages');

// --- RUTAS ---

// Home
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Test simple POST
app.post('/data', (req, res) => {
  console.log('Body recibido:', req.body);
  res.json({
    message: 'Datos recibidos correctamente',
    data: req.body,
  });
});

// Endpoint para llamar a Ollama
app.post('/api/ask', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // Llamada a Ollama
    const ollamaResponse = await axios.post(
      'http://localhost:11434/api/generate',
      {
        model: 'deepseek-r1:1.5b',
        prompt,
        max_tokens: 500,
        stream: false,
      }
    );

    let result = ollamaResponse.data?.response || '';
    result = result.replace(/<think>[\s\S]*?<\/think>/g, '').trim();

    res.json({ response: result });
  } catch (error) {
    console.error('Error en /api/ask:', error);
    res.status(500).json({ error: error.message || 'Error interno' });
  }
});

// --- ENDPOINTS de Mensajes ---

// Obtener todos los mensajes
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await messagesCollection.find().toArray();
    res.json(messages);
  } catch (err) {
    console.error('Error al obtener mensajes:', err);
    res.status(500).json({ error: 'Error al obtener mensajes' });
  }
});

// Guardar un mensaje nuevo
app.post('/api/messages', async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }

  const newMessage = {
    title,
    content,
    createdAt: new Date(),
  };

  try {
    const result = await messagesCollection.insertOne(newMessage);
    res.status(201).json({
      message: 'Message saved successfully',
      id: result.insertedId,
    });
  } catch (err) {
    console.error('Error al guardar mensaje:', err);
    res.status(500).json({ error: 'Error al guardar mensaje' });
  }
});

// Eliminar un mensaje por ID (opcional)
app.delete('/api/messages/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await messagesCollection.deleteOne({ _id: new ObjectId(id) });
    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    console.error('Error al borrar mensaje:', err);
    res.status(500).json({ error: 'Error al borrar mensaje' });
  }
});

app.listen(port, () => {
  console.log(`✅ Server listening on port ${port}`);
});

