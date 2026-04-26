# ── Stage 1: Build ───────────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Stage 2: Serve ──────────────────────────────────────────────────
FROM nginx:alpine

ARG APP_VERSION=0.0.0
LABEL org.opencontainers.image.title="cooksyne-ui" \
    org.opencontainers.image.version="${APP_VERSION}" \
    org.opencontainers.image.description="Cooksyne frontend"

# Custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Entrypoint script to inject runtime env vars into env.js
COPY docker-entrypoint.sh /docker-entrypoint.d/40-env-config.sh
RUN chmod +x /docker-entrypoint.d/40-env-config.sh

# Built Angular app
COPY --from=build /app/dist/cooksyne-ui/browser /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO /dev/null http://localhost:80/ || exit 1
