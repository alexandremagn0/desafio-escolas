# Desafio Fullstack – Instalações Escolares

## 💡 Descrição
Aplicação fullstack com upload de CSV e CRUD de dados escolares, desenvolvida com Node.js + Express no backend, Vue.js 3 no frontend e PostgreSQL como banco de dados. O sistema permite gerenciar informações sobre instalações escolares através de uma interface web moderna com autenticação JWT.

## 🌐 Aplicação Online

### 🚀 Links de Produção
- **Frontend**: [https://desafio-escolas.vercel.app](https://desafio-escolas.vercel.app)
- **Backend**: [https://backend-escolas.onrender.com](https://backend-escolas.onrender.com)
- **Documentação da API**: [https://backend-escolas.onrender.com/api-docs](https://backend-escolas.onrender.com/api-docs)

### 🔐 Credenciais de Teste
- **Email**: admin@teste.com
- **Senha**: 123456

## 🚀 Tecnologias

### Backend
- **Runtime**: Node.js + Express
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT (JSON Web Tokens)
- **Upload de Arquivos**: Multer
- **Processamento CSV**: csv-parser
- **Criptografia**: bcrypt
- **Validação**: Zod
- **Documentação**: Swagger/OpenAPI
- **CORS**: Habilitado para integração frontend

### Frontend
- **Framework**: Vue.js 3
- **Build Tool**: Vite
- **Roteamento**: Vue Router 4
- **HTTP Client**: Axios
- **UI**: Componentes Vue nativos

## 📋 Pré-requisitos
- Node.js (versão 18 ou superior)
- PostgreSQL
- Docker

## ️ Como Executar

### Clone o repositório
```bash
git clone https://github.com/alexandremagn0/desafio-escolas.git
cd desafio-escolas
```

### Execução com Docker
```bash
# Backend com Docker
cd backend
docker-compose up -d

# Frontend (em outro terminal)
cd frontend
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:5173` (Vite padrão)

#### Configure o arquivo `.env` do backend
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações:
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=escolas
DB_USER=postgres
DB_PASSWORD=postgres
JWT_SECRET=sua_chave_secreta_aqui
```

## 📌 Funcionalidades

### 🔐 Autenticação
- Login com email e senha
- Logout com invalidação de sessão
- Autenticação via JWT
- Middleware de proteção de rotas

### 📊 Gestão de Escolas
- **Listar todas as escolas** - `GET /api/schools`
- **Buscar escola por ID** - `GET /api/schools/:id`
- **Criar nova escola** - `POST /api/schools`
- **Atualizar escola** - `PUT /api/schools/:id`
- **Deletar escola** - `DELETE /api/schools/:id`

### 📁 Upload de CSV
- **Upload de arquivo CSV** - `POST /api/csv/upload`
- Processamento automático de dados
- Mapeamento de campos do CSV para o banco
- Validação e tratamento de erros

### 🖥️ Interface Web
- Dashboard responsivo
- Formulários de login e gestão
- Upload de arquivos via interface
- Navegação intuitiva

### 📚 Documentação da API
- **Swagger/OpenAPI** integrado
- Documentação interativa em `/api-docs`
- Exemplos de requisição e resposta
- Teste de endpoints direto na interface

## 📡 Endpoints da API

### Autenticação
```
POST /api/auth/login
Body: { "email": "admin@teste.com", "password": "123456" }

POST /api/auth/logout
Headers: Authorization: Bearer <token>
```

### Escolas (requer autenticação)
```
GET    /api/schools          # Listar todas
GET    /api/schools/:id      # Buscar por ID
POST   /api/schools          # Criar nova
PUT    /api/schools/:id      # Atualizar
DELETE /api/schools/:id      # Deletar
```

### Upload CSV (requer autenticação)
```
POST /api/csv/upload
Content-Type: multipart/form-data
Body: file (arquivo CSV)
```

### Documentação
```
GET /api-docs               # Interface Swagger
```

## 🗄️ Estrutura do Banco de Dados

### Tabela: school_installations
- `id` (SERIAL PRIMARY KEY)
- `school_name` (TEXT)
- `teaching_directorate` (TEXT)
- `municipality` (TEXT)
- `school_code` (TEXT)
- `total_classrooms` (INTEGER)
- `cafeteria` (BOOLEAN)
- `created_at` (TIMESTAMP)

### Tabela: users
- `id` (SERIAL PRIMARY KEY)
- `email` (VARCHAR UNIQUE)
- `password` (VARCHAR - hash bcrypt)
- `nome` (VARCHAR)
- `sobrenome` (VARCHAR)
- `data_nascimento` (DATE)
- `documento` (VARCHAR UNIQUE)

## 📁 Estrutura do Projeto

### Backend
```
backend/
├── src/
│   ├── config/          # Configurações (DB, Swagger, etc.)
│   ├── controllers/     # Controladores da aplicação
│   ├── entities/        # Entidades do TypeORM
│   ├── middleware/      # Middlewares customizados
│   ├── migrations/      # Migrações do banco
│   ├── repositories/    # Repositórios de dados
│   ├── routes/          # Definição das rotas
│   ├── schemas/         # Schemas de validação (Zod)
│   ├── services/        # Lógica de negócio
│   └── uploads/         # Arquivos temporários
├── server.js            # Arquivo principal
├── package.json
└── docker-compose.yml
```

### Frontend
```
frontend/
├── src/
│   ├── api/             # Configuração e chamadas da API
│   ├── assets/          # Recursos estáticos
│   ├── components/      # Componentes Vue reutilizáveis
│   ├── router/          # Configuração de rotas
│   ├── store/           # Gerenciamento de estado
│   ├── views/           # Páginas da aplicação
│   ├── App.vue          # Componente raiz
│   └── main.js          # Ponto de entrada
├── public/              # Arquivos públicos
├── index.html           # HTML base
├── package.json
└── vite.config.js       # Configuração do Vite
```

## 🔧 Configurações

### Portas Padrão
- **Backend**: `http://localhost:3001`
- **Frontend**: `http://localhost:5173`
- **PostgreSQL**: `localhost:5432`

## 🚀 Deploy

### Backend (Render)
- Conectado ao repositório GitHub
- Deploy automático em push
- Banco PostgreSQL gerenciado pelo Render

### Frontend (Vercel)
- Conectado ao repositório GitHub
- Deploy automático em push
- Build otimizado com Vite

## 📄 Licença
MIT