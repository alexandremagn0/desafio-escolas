const bcrypt = require('bcrypt');
const AppDataSource = require('../config/database');

async function createAdminUser() {
  try {
    await AppDataSource.initialize();
    
    const userRepository = AppDataSource.getRepository('User');
    
    // Verificar se o usuário admin já existe
    const existingUser = await userRepository.findOne({
      where: { email: 'admin@teste.com' }
    });

    if (existingUser) {
      console.log('Usuário admin já existe');
      return;
    }

    // Criar hash da senha
    const hashedPassword = await bcrypt.hash('123456', 10);

    // Criar usuário admin
    const adminUser = userRepository.create({
      email: 'admin@teste.com',
      password: hashedPassword,
      first_name: 'Administrador',
      last_name: 'Sistema',
      birth_date: '1990-01-01',
      document: '12345678900'
    });

    await userRepository.save(adminUser);
    console.log('Usuário admin criado com sucesso!');
    
  } catch (error) {
    console.error('Erro ao criar usuário admin:', error);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

// Executar se o arquivo for chamado diretamente
if (require.main === module) {
  createAdminUser();
}

module.exports = createAdminUser; 