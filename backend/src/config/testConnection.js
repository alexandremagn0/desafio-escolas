const pool = require('./db');

async function testConnection() {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log('Conectado ao banco com sucesso! Hora do servidor:', res.rows[0].now);
  } catch (err) {
    console.error('Erro ao conectar ao banco:', err);
  } finally {
    pool.end();
  }
}

testConnection();
