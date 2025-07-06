const bcrypt = require('bcrypt');

async function createAdminUser() {
  try {
    const { AppDataSource } = require('../config/database');
    
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
    console.log('Email: admin@teste.com');
    console.log('Senha: 123456');
    
  } catch (error) {
    console.error('Erro ao criar usuário admin:', error);
    throw error;
  }
}

// Executar se o arquivo for chamado diretamente
if (require.main === module) {
  const { initializeDatabase } = require('../config/database');
  
  initializeDatabase()
    .then(() => {
      console.log('Seed executado com sucesso!');
      process.exit(0);
    })
    .catch(err => {
      console.error('Erro ao executar seed:', err);
      process.exit(1);
    });
}

module.exports = createAdminUser; 