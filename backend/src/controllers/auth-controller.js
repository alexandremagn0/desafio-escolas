const AuthService = require('../services/auth-service');

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      const result = await this.authService.login(email, password);
      res.json(result);
    } catch (error) {
      console.error('Erro no login:', error);
      res.status(401).json({ error: error.message });
    }
  }

  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
      }

      const result = await this.authService.register({ name, email, password });
      res.status(201).json(result);
    } catch (error) {
      console.error('Erro no registro:', error);
      res.status(400).json({ error: error.message });
    }
  }

  async logout(req, res) {
    try {
      // Logout é apenas uma resposta de sucesso, não há necessidade de invalidar o token no servidor
      // O cliente deve remover o token localmente
      res.json({ message: 'Logout realizado com sucesso' });
    } catch (error) {
      console.error('Erro no logout:', error);
      res.status(500).json({ error: 'Erro no servidor' });
    }
  }
}

module.exports = AuthController;
