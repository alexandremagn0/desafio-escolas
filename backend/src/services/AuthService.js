const userRepository = require('../repositories/UserRepository');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthService {
  async login(email, password) {
    const user = await userRepository.buscarPorEmail(email);

    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    const senhaValida = await bcrypt.compare(password, user.password);
    if (!senhaValida) {
      throw new Error('Credenciais inválidas');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    return { token, user: { id: user.id, email: user.email, nome: user.nome } };
  }

  async logout(user) {
    console.log(`Usuário ${user.email} fez logout`);
    
    // Em uma implementação futura:
    // 1. Adicionar o token a uma blacklist ou
    // 2. Registrar o logout no banco de dados ou
    // 3. Invalidar o token no servidor
    
    return { message: 'Logout realizado com sucesso' };
  }

  async verificarToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      throw new Error('Token inválido ou expirado');
    }
  }
}

module.exports = new AuthService(); 