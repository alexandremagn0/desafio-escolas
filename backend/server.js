require('dotenv').config();
const express = require('express');
const cors = require('cors');
const initDb = require('./src/config/initDb');

const app = express();
app.use(cors());
app.use(express.json());

// Rotas importadas
const csvRoutes = require('./src/routes/csvRoutes');
const escolasRoutes = require('./src/routes/escolasRoutes');

app.use('/api/csv', csvRoutes);
app.use('/api/escolas', escolasRoutes);

app.get('/', (req, res) => {
  res.send('API funcionando 🚀');
});

// Inicializa o banco e só depois sobe o servidor
initDb()
  .then(() => {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erro ao inicializar banco:', err);
    process.exit(1);
  });
