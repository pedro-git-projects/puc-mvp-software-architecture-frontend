# Projeto MPV em Arquitetura de Software 

Este é o frontend do MVP em Arquitetura de Software para a pós graduação em engenharia de software da PUC-RJ desenvolvido com Next.js. A aplicação consome uma API própria de persistência hospedada em [TODO](https://todo.com) e a API do TheAudioDB.

## Pré-requisitos

Antes de começar, você precisará ter as seguintes ferramentas instaladas em sua máquina:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Estrutura do Projeto

- `Dockerfile`: Define a imagem Docker para a aplicação.
- `docker-compose.yml`: Define os serviços Docker para desenvolvimento.
- `docker-compose.prod.yml`: Define os serviços Docker para produção.
- `.dockerignore`: Arquivos e diretórios a serem ignorados pelo Docker.

## Configuração

1. Clone o repositório:

   ```bash
   git clone https://github.com/pedro-git-projects/puc-mvp-software-architecture-frontend.git
   cd puc-mvp-software-architecture-frontend
   ```

## Desenvolvimento

Para rodar a aplicação em modo de desenvolvimento, use o Docker Compose:

1. Construa a imagem Docker:

   ```bash
   docker-compose build
   ```

2. Inicie a aplicação:

   ```bash
   docker-compose up
   ```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).


## Dockerfile

O `Dockerfile` utilizado para a construção da imagem Docker:

```Dockerfile
# Stage 1: Base
FROM node:22-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Stage 2: Build
FROM base AS build
RUN npm run build

# Stage 3: Production
FROM node:18-alpine AS production
WORKDIR /app
COPY --from=build /app ./
EXPOSE 3000
CMD ["npm", "start"]

# Stage 4: Development
FROM base AS development
WORKDIR /app
EXPOSE 3000
CMD ["npm", "run", "dev"]
```

## docker-compose.yml

Arquivo `docker-compose.yml` para desenvolvimento:

```yaml
services:
  nextjs-app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - '3000:3000'
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      NODE_ENV: development
    command: ["npm", "run", "dev"]
```
