# Sistema de Seeds

Este diretório contém os arquivos de seed para popular o banco de dados com dados iniciais.

## Como Funciona

### Execução Automática
Os seeds são executados **automaticamente** na primeira inicialização do servidor quando:
- O banco de dados está vazio (sem usuários)
- O servidor é iniciado pela primeira vez

### Execução Manual
Você também pode executar os seeds manualmente usando os comandos npm:

```bash
# Executar todos os seeds
npm run seed:all

# Executar apenas o seed de admin
npm run seed:admin

# Executar um seed específico
npm run seed
```

## Seeds Disponíveis

### 1. Admin User (`create-admin-user.js`)
Cria o usuário administrador padrão do sistema.

**Credenciais padrão:**
- Email: `admin@teste.com`
- Senha: `123456`

**Dados do usuário:**
- Nome: Administrador Sistema
- Data de nascimento: 1990-01-01
- Documento: 12345678900

## Adicionando Novos Seeds

Para adicionar um novo seed:

1. Crie um arquivo JavaScript na pasta `seeds/`
2. Exporte uma função assíncrona
3. Adicione o seed ao array em `seeds/index.js`

Exemplo:

```javascript
// seeds/novo-seed.js
async function novoSeed() {
  // Lógica do seed
}

module.exports = novoSeed;
```

```javascript
// seeds/index.js
const novoSeed = require('./novo-seed');

const seeds = [
  // ... outros seeds
  {
    name: 'Novo Seed',
    function: novoSeed,
    description: 'Descrição do novo seed'
  }
];
```

## Logs

Os seeds exibem logs informativos durante a execução:

- 🔍 Verificando se é necessário executar seeds
- 🌱 Executando seeds pela primeira vez
- ✅ Seeds executados com sucesso
- ❌ Erro ao executar seeds

## Segurança

- Os seeds só são executados se o banco estiver vazio
- Erros nos seeds não interrompem a inicialização do servidor
- Credenciais padrão devem ser alteradas em produção 