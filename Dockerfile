# Stage 1: Dependencias de desarrollo
FROM node:24-alpine AS development-dependencies-env
WORKDIR /app
COPY package.json package-lock.json ./
# Instalamos TODO incluyendo devDependencies
RUN npm ci

# Stage 2: Dependencias de producción
FROM node:24-alpine AS production-dependencies-env
WORKDIR /app
COPY package.json package-lock.json ./
# Solo dependencias necesarias para correr la app
RUN npm ci --omit=dev

# Stage 3: Construcción (Build)
FROM node:24-alpine AS build-env
WORKDIR /app
COPY . .
COPY --from=development-dependencies-env /app/node_modules ./node_modules
RUN npm run build

# Stage 4: Imagen final de ejecución
FROM node:24-alpine
WORKDIR /app
# Variables de entorno por defecto
ENV NODE_ENV=production

# Copiamos solo lo estrictamente necesario
COPY package.json package-lock.json ./
COPY --from=production-dependencies-env /app/node_modules ./node_modules
COPY --from=build-env /app/build ./build

# Exponemos el puerto (React Router Serve suele usar el 3000 por defecto)
EXPOSE 3000

# Ejecutamos usando el script definido en tu package.json
CMD ["npm", "run", "start"]