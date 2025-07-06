const express = require('express');
const app = express();
const port = 3000;

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

