# ========================================================
# STAGE 1: Instalar todas las dependencias y Compilar (Build)
# ========================================================
FROM node:24-alpine AS builder
WORKDIR /app

# Copiar manifiestos primero para aprovechar el sistema de caché de capas de Docker
COPY package.json package-lock.json ./

# Instalar TODO (incluye devDependencies para poder compilar y transpilar)
RUN npm ci && npm cache clean --force

# Copiar el resto del código fuente del frontend
COPY . .

# Abre el canal para que el compose inyecte el valor en tu máquina.
# Render ignorará esta línea e inyectará la variable directamente a nivel de sistema.
ARG VITE_API_URL
ARG VITE_SOCKET_URL

# Compilar la aplicación (Vite congela el valor del ARG dentro de los assets .js)
RUN npm run build

# Eliminamos físicamente las devDependencies pesadas (Vite, Tailwind, TypeScript)
# directamente sobre la carpeta node_modules para no arrastrarlas a producción
RUN npm prune --omit=dev && npm cache clean --force

# ========================================================
# STAGE 2: Imagen Final de Producción (Ultra ligera y Segura)
# ========================================================
FROM node:24-alpine AS runner
WORKDIR /app

# Variables de entorno estrictas para el runtime de producción
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Principio de menor privilegio: Cambiar dueño del directorio al usuario nativo 'node'
RUN chown -R node:node /app
USER node

# Traemos solo el compilado y el runtime esencial
COPY --from=builder --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/build ./build
COPY --from=builder --chown=node:node /app/package.json /app/package-lock.json ./

# Exponer el puerto de escucha del contenedor
EXPOSE 3000

# Invocamos el binario de producción del framework para evitar que el contenedor muera en Render
CMD ["./node_modules/.bin/react-router-serve", "./build/server/index.js"]