# Desafio Fullstack – Instalações Escolares

## 💡 Descrição
Aplicação fullstack com upload de CSV e CRUD de dados escolares, desenvolvida com Node.js + Express no backend, Vue.js 3 no frontend e PostgreSQL como banco de dados. O sistema permite gerenciar informações sobre instalações escolares através de uma interface web moderna com autenticação JWT.

## 🚀 Tecnologias

### Backend
- **Runtime**: Node.js + Express
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT (JSON Web Tokens)
- **Upload de Arquivos**: Multer
- **Processamento CSV**: csv-parser
- **Criptografia**: bcrypt
- **CORS**: Habilitado para integração frontend

### Frontend
- **Framework**: Vue.js 3
- **Build Tool**: Vite
- **Roteamento**: Vue Router 4
- **HTTP Client**: Axios
- **UI**: Componentes Vue nativos

## 📋 Pré-requisitos
- Node.js (versão 14 ou superior)
- PostgreSQL
- Docker (opcional, para usar docker-compose)

## ️ Como Executar

### Clone o repositório
```bash
git clone https://github.com/seuusuario/desafio-escolas.git
cd desafio-escolas
```

### Opção 1: Execução com Docker (Recomendada)
```bash
# Backend com Docker
cd backend
docker-compose up -d

# Frontend (em outro terminal)
cd frontend
npm install
npm run dev
```

### Opção 2: Execução Manual

#### Backend
```bash
cd backend
npm install
```

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

#### Execute o backend
```bash
npm run dev  # Para desenvolvimento (com nodemon)
# ou
npm start    # Para produção
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:5173` (Vite padrão)

## 📌 Funcionalidades

### 🔐 Autenticação
- Login com email e senha
- Logout com invalidação de sessão
- Autenticação via JWT
- Middleware de proteção de rotas

### 📊 Gestão de Escolas
- **Listar todas as escolas** - `GET /api/escolas`
- **Buscar escola por ID** - `GET /api/escolas/:id`
- **Criar nova escola** - `POST /api/escolas`
- **Atualizar escola** - `PUT /api/escolas/:id`
- **Deletar escola** - `DELETE /api/escolas/:id`

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

## 🔐 Usuário de Teste
- **Email**: admin@teste.com
- **Senha**: 123456

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
GET    /api/escolas          # Listar todas
GET    /api/escolas/:id      # Buscar por ID
POST   /api/escolas          # Criar nova
PUT    /api/escolas/:id      # Atualizar
DELETE /api/escolas/:id      # Deletar
```

### Upload CSV (requer autenticação)
```
POST /api/csv/upload
Content-Type: multipart/form-data
Body: file (arquivo CSV)
```

## 🗄️ Estrutura do Banco de Dados

### Tabela: instalacoes_escolares
- `id` (SERIAL PRIMARY KEY)
- `nome_escola` (VARCHAR)
- `diretoria_ensino` (VARCHAR)
- `municipio` (VARCHAR)
- `codigo_escola` (VARCHAR)
- `total_salas_aula` (INTEGER)
- `refeitorio` (BOOLEAN)

### Tabela: users
- `id` (SERIAL PRIMARY KEY)
- `email` (VARCHAR UNIQUE)
- `password` (VARCHAR - hash bcrypt)

## 📁 Estrutura do Projeto

### Backend
```
backend/
├── src/
│   ├── config/          # Configurações (DB, etc.)
│   ├── controllers/     # Controladores da aplicação
│   ├── middleware/      # Middlewares customizados
│   ├── routes/          # Definição das rotas
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

## 🛠️ Scripts Disponíveis

### Backend
```bash
npm run dev    # Executa em modo desenvolvimento
npm start      # Executa em modo produção
npm test       # Executa testes (a implementar)
```

### Frontend
```bash
npm run dev    # Executa em modo desenvolvimento
npm run build  # Gera build de produção
npm run preview # Visualiza build de produção
```

## 🔧 Configurações

### Variáveis de Ambiente (Backend)
- `PORT`: Porta do servidor (padrão: 3001)
- `DB_HOST`: Host do PostgreSQL
- `DB_PORT`: Porta do PostgreSQL (padrão: 5432)
- `DB_NAME`: Nome do banco de dados
- `DB_USER`: Usuário do banco
- `DB_PASSWORD`: Senha do banco
- `JWT_SECRET`: Chave secreta para JWT

### Portas Padrão
- **Backend**: `http://localhost:3001`
- **Frontend**: `http://localhost:5173`
- **PostgreSQL**: `localhost:5432`

## 🚀 Deploy

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
# Os arquivos gerados estarão em dist/
```

## 📄 Licença
MIT