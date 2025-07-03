// src/controllers/authController.js
const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const senhaValida = await bcrypt.compare(password, user.password);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro no servidor', details: error.message });
  }
};

const logout = async (req, res) => {
  try {
    // Log do logout para auditoria
    console.log(`Usuário ${req.user.email} fez logout`);
    
    // Em uma implementação mais avançada, considerar:
    // 1. Adicionar o token a uma blacklist
    // 2. Registrar o logout no banco de dados
    // 3. Invalidar o token no servidor
    
    res.json({ message: 'Logout realizado com sucesso' });
  } catch (error) {
    console.error('Erro no logout:', error);
    res.status(500).json({ error: 'Erro no servidor', details: error.message });
  }
};

module.exports = { login, logout };
