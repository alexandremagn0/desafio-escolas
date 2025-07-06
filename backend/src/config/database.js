const { DataSource } = require('typeorm');
require('dotenv').config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [__dirname + '/../entities/*.js'],
  migrations: [__dirname + '/../migrations/*.js'],
  subscribers: [__dirname + '/../subscribers/*.js'],
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false,
  entitySkipConstructor: true
});

// Função para obter repositório de forma segura
const getRepository = (entityName) => {
  if (!AppDataSource.isInitialized) {
    throw new Error('DataSource não foi inicializado. Aguarde a inicialização do servidor.');
  }
  return AppDataSource.getRepository(entityName);
};

const runSeeds = async () => {
  try {
    console.log('Verificando se é necessário executar seeds...');
    
    const userRepository = AppDataSource.getRepository('User');
    const userCount = await userRepository.count();
    
    if (userCount === 0) {
      console.log('Executando seeds pela primeira vez...');
      
      const createAdminUser = require('../seeds/create-admin-user');
      await createAdminUser();
      
      console.log('Seeds executados com sucesso!');
    } else {
      console.log('Seeds já foram executados anteriormente.');
    }
  } catch (error) {
    console.error('Erro ao executar seeds:', error);
  }
};

const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log('Banco de dados inicializado com sucesso!');
    
    await runSeeds();
    
    return AppDataSource;
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    throw error;
  }
};

module.exports = { AppDataSource, getRepository, initializeDatabase }; 