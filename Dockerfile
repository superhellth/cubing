FROM node:24-alpine AS build
RUN corepack enable
WORKDIR /cubing

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY packages/frontend/package.json packages/frontend/
COPY packages/shared/package.json packages/shared/
COPY packages/backend/package.json packages/backend/
RUN pnpm install --frozen-lockfile

COPY . .

FROM build AS frontend-build
RUN pnpm run generate-licenses
RUN pnpm --filter @cubing/frontend build

FROM build AS backend-build
RUN pnpm --filter @cubing/backend... build
# Root dependencies serve the frontend only, but pnpm deploy would include them.
RUN npm pkg delete dependencies
RUN pnpm --filter @cubing/backend deploy --legacy --prod /deploy

FROM node:24-alpine AS backend
ENV NODE_ENV=production
WORKDIR /app
COPY --from=backend-build /deploy .
USER 1000:1000
EXPOSE 3000
CMD ["node", "dist/app.js"]

FROM caddy:2-alpine AS frontend
RUN apk add --no-cache libcap \
 && setcap -r /usr/bin/caddy \
 && apk del libcap \
 && addgroup -S -g 10001 caddy \
 && adduser -S -u 10001 -G caddy -H caddy \
 && mkdir -p /data /config \
 && chown -R 10001:10001 /data /config
COPY packages/frontend/Caddyfile /etc/caddy/Caddyfile
COPY --from=frontend-build /cubing/packages/frontend/dist /srv
USER 10001:10001
EXPOSE 8080

FROM php:8.4-apache AS visualcube
RUN apt-get update && apt-get install -y --no-install-recommends imagemagick librsvg2-bin && rm -rf /var/lib/apt/lists/*
ADD https://github.com/Cride5/visualcube.git#5e3d38a534375adf2a326b99941f01999199163d /var/www/html/
COPY --chmod=755 <<'SH' /usr/local/bin/vc-convert
#!/bin/sh
set -eu
tmp=$(mktemp /tmp/vc-XXXXXX.svg)
trap 'rm -f "$tmp"' EXIT
cat > "$tmp"
for a; do shift; [ "$a" = "svg:-" ] && a=$tmp; set -- "$@" "$a"; done
convert "$@"
SH
RUN sed -i 's/^\(\s*\)\$CONVERT="convert";/\1$CONVERT="vc-convert";/' /var/www/html/visualcube_config.php \
 && sed -i 's/^Listen 80$/Listen 8080/' /etc/apache2/ports.conf \
 && sed -i 's/<VirtualHost \*:80>/<VirtualHost *:8080>/' /etc/apache2/sites-available/000-default.conf
USER 33:33
EXPOSE 8080