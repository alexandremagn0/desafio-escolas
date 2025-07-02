# Use imagem oficial leve do Node.js
FROM node:18-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia todo o restante do código para dentro do container
COPY . .

# Expõe a porta que o backend vai rodar
EXPOSE 3001

# Comando para iniciar o servidor
CMD ["npm", "run", "dev"]
