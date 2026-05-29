# ==========================================
# STAGE 1: Instalar dependencias para compilar
# ==========================================
FROM node:24-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# ==========================================
# STAGE 2: Imagen de ejecución ultra ligera (Producción Pura)
# ==========================================
FROM node:24-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Seguridad estricta
RUN chown -R node:node /app
USER node

# En React Router 7, el servidor ya viene pre-empaquetado para producción en ./build/server
COPY --from=builder --chown=node:node /app/build ./build
COPY --from=builder --chown=node:node /app/package.json ./package.json

EXPOSE 3000

# Ejecutamos el archivo index del servidor directamente con Node nativo.
CMD ["node", "./build/server/index.js"]