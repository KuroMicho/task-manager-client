# ==========================================
# STAGE 1: Instalar todas las dependencias
# ==========================================
FROM node:24-alpine AS all-deps-env
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ==========================================
# STAGE 2: Instalar SOLO dependencias de producción
# ==========================================
FROM node:24-alpine AS prod-deps-env
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ==========================================
# STAGE 3: Compilar la aplicación (Build)
# ==========================================
FROM node:24-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=all-deps-env /app/node_modules ./node_modules
RUN npm run build

# ==========================================
# STAGE 4: Imagen final ultra optimizada
# ==========================================
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Capar privilegios de root por seguridad
RUN chown -R node:node /app
USER node

COPY --from=prod-deps-env --chown=node:node /app/node_modules ./node_modules
COPY --from=builder --chown=node:node /app/build ./build
COPY --from=builder --chown=node:node /app/package.json ./package.json

EXPOSE 3000

# Arrancamos de forma nativa a la velocidad del rayo
CMD ["node", "./build/server/index.js"]