# Desafio Fullstack – Instalações Escolares

## 💡 Descrição
Aplicação fullstack com upload de CSV e CRUD de dados escolares, desenvolvida com Node.js + Express no backend e PostgreSQL como banco de dados. O sistema permite gerenciar informações sobre instalações escolares através de uma API RESTful com autenticação JWT.

## 🚀 Tecnologias
- **Backend**: Node.js + Express
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT (JSON Web Tokens)
- **Upload de Arquivos**: Multer
- **Processamento CSV**: csv-parser
- **Criptografia**: bcrypt
- **CORS**: Habilitado para integração frontend

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
cd backend
docker-compose up -d
```
O servidor estará disponível em `http://localhost:3001`

### Opção 2: Execução Manual

#### Backend
```bash
cd backend
npm install
```

#### Configure o arquivo `.env`
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

#### Execute o servidor
```bash
npm run dev  # Para desenvolvimento (com nodemon)
# ou
npm start    # Para produção
```

## 📌 Funcionalidades

### 🔐 Autenticação
- Login com email e senha
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

## 🔐 Usuário de Teste
- **Email**: admin@teste.com
- **Senha**: 123456

## 📡 Endpoints da API

### Autenticação
```
POST /api/auth/login
Body: { "email": "admin@teste.com", "password": "123456" }
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

## 🛠️ Scripts Disponíveis
```bash
npm run dev    # Executa em modo desenvolvimento
npm start      # Executa em modo produção
npm test       # Executa testes (a implementar)
```

## 🔧 Configurações

### Variáveis de Ambiente
- `PORT`: Porta do servidor (padrão: 3001)
- `DB_HOST`: Host do PostgreSQL
- `DB_PORT`: Porta do PostgreSQL (padrão: 5432)
- `DB_NAME`: Nome do banco de dados
- `DB_USER`: Usuário do banco
- `DB_PASSWORD`: Senha do banco
- `JWT_SECRET`: Chave secreta para JWT

## 📄 Licença
MIT