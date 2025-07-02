const pool = require('./db');
const bcrypt = require('bcrypt');

const createTableQuery = `
CREATE TABLE IF NOT EXISTS instalacoes_escolares (
  id SERIAL PRIMARY KEY,
  nome_escola TEXT,
  diretoria_ensino TEXT,
  municipio TEXT,
  codigo_escola TEXT,
  total_salas_aula INTEGER,
  refeitorio BOOLEAN,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

const createUsersTableQuery = `
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nome VARCHAR(100) NOT NULL,
  sobrenome VARCHAR(100) NOT NULL,
  data_nascimento DATE NOT NULL,
  documento VARCHAR(50) UNIQUE NOT NULL
);
`;

async function initDb() {
  try {
    await pool.query(createTableQuery);
    await pool.query(createUsersTableQuery);

    // Gerar hash da senha
    const senhaPura = '123456';
    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senhaPura, saltRounds);

    // Inserir usuário de teste com senha hasheada
    const insertTestUserQuery = `
      INSERT INTO users (email, password, nome, sobrenome, data_nascimento, documento)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (email) DO NOTHING;
    `;
    await pool.query(insertTestUserQuery, [
      'admin@teste.com',
      senhaHash,
      'João',
      'Silva',
      '1990-01-01',
      '12345678900'
    ]);

    console.log('Tabelas criadas e usuário de teste inserido');
  } catch (error) {
    console.error('Erro ao criar tabela:', error);
  }
//   finally {
//     pool.end();
//   }
}

module.exports = initDb;
