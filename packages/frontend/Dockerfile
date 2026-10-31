FROM node:24-alpine AS build
RUN corepack enable
WORKDIR /cubing

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY packages/frontend/package.json packages/frontend/
COPY packages/shared/package.json packages/shared/
COPY packages/backend/package.json packages/backend/
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run generate-licenses
RUN pnpm --filter @cubing/frontend build

FROM caddy:2-alpine
RUN apk add --no-cache libcap \
 && setcap -r /usr/bin/caddy \
 && apk del libcap \
 && addgroup -S -g 10001 caddy \
 && adduser -S -u 10001 -G caddy -H caddy \
 && mkdir -p /data /config \
 && chown -R 10001:10001 /data /config
COPY packages/frontend/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /cubing/packages/frontend/dist /srv
USER 10001:10001
EXPOSE 8080