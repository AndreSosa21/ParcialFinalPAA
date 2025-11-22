FROM node:20-alpine

WORKDIR /app

# Copiar package.json del contexto (backend/)
COPY package*.json ./

RUN npm install --production

# Copiar código fuente
COPY src ./src
COPY .env .env

EXPOSE 3000

CMD ["node", "src/app.js"]
