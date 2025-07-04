require('dotenv').config();
const express = require('express');
const cors = require('cors');
const AppDataSource = require('./src/config/database');
const routes = require('./src/routes');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('API funcionando 🚀');
});

// Inicializa o TypeORM e só depois sobe o servidor
AppDataSource.initialize()
  .then(() => {
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erro ao inicializar TypeORM:', err);
    process.exit(1);
  });
