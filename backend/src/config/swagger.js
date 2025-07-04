const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Escolas',
      version: '1.0.0',
      description: 'API para gerenciamento de escolas e instalações escolares',
      contact: {
        name: 'Desenvolvimento',
        email: 'contato@exemplo.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor de desenvolvimento'
      },
      {
        url: 'https://seu-backend-no-render.onrender.com',
        description: 'Servidor de produção'
      }
    ],
    tags: [
      {
        name: 'Autenticação',
        description: 'Endpoints para autenticação de usuários'
      },
      {
        name: 'Escolas',
        description: 'Endpoints para gerenciamento de escolas'
      },
      {
        name: 'CSV',
        description: 'Endpoints para importação de dados via CSV'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js',
  ],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec; 