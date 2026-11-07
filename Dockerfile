# syntax=docker/dockerfile:1.7
FROM node:24-bookworm-slim AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM node:24-bookworm-slim AS build
ARG REVISION=unknown
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
ENV APP_REVISION=$REVISION
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:24-bookworm-slim AS runtime
ARG REVISION=unknown
ARG SOURCE=https://github.com/salete-sincere/site-chaufferie-cil
LABEL org.opencontainers.image.title="Comité chaufferie — Haubourdin" \
      org.opencontainers.image.source=$SOURCE \
      org.opencontainers.image.revision=$REVISION
WORKDIR /app
ENV NODE_ENV=production \
    APP_REVISION=$REVISION \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000
RUN groupadd --gid 10001 web && useradd --uid 10001 --gid web --no-create-home web
COPY --from=build --chown=web:web /app/.next/standalone ./
COPY --from=build --chown=web:web /app/.next/static ./.next/static
COPY --from=build --chown=web:web /app/public ./public
USER 10001:10001
EXPOSE 3000
STOPSIGNAL SIGTERM
CMD ["node", "server.js"]
