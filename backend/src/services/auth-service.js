const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/user-repository');

class AuthService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async login(email, password) {
    const user = await this.userRepository.findByEmail(email);
    
    if (!user) {
      throw new Error('Email ou senha inválidos');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      throw new Error('Email ou senha inválidos');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
  }

  async register(userData) {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    
    if (existingUser) {
      throw new Error('Email já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword
    });

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
  }

  async logout(user) {
    console.log(`Usuário ${user.email} fez logout`);
    
    // Em uma implementação futura:
    // 1. Adicionar o token a uma blacklist ou
    // 2. Registrar o logout no banco de dados ou
    // 3. Invalidar o token no servidor
    
    return { message: 'Logout realizado com sucesso' };
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new Error('Token inválido');
    }
  }
}

module.exports = AuthService; 