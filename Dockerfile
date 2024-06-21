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

