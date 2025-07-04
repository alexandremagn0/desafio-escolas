// src/controllers/authController.js
const authService = require('../services/AuthService');

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    if (error.message === 'Credenciais inválidas') {
      return res.status(401).json({ error: error.message });
    }
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro no servidor', details: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const result = await authService.logout(req.user);
    res.json(result);
  } catch (error) {
    console.error('Erro no logout:', error);
    res.status(500).json({ error: 'Erro no servidor', details: error.message });
  }
};

module.exports = { login, logout };
