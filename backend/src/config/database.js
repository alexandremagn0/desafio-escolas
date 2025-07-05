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
  } : false
});

// Função para obter repositório de forma segura
const getRepository = (entityName) => {
  if (!AppDataSource.isInitialized) {
    throw new Error('DataSource não foi inicializado. Aguarde a inicialização do servidor.');
  }
  return AppDataSource.getRepository(entityName);
};

module.exports = { AppDataSource, getRepository }; 