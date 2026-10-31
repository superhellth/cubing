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
