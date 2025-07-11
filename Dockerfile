FROM docker.io/library/node:20.19.2-alpine3.21 AS builder
WORKDIR /app/
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY ./public/ ./public/
COPY ./src/ ./src/
COPY angular.json .
COPY tsconfig.app.json .
COPY tsconfig.json .
COPY tsconfig.spec.json .
ARG VERSION=1.0.0
RUN npm version $VERSION
RUN npm run build -- --output-path dist/ --base-href /frontend/
#--base-href must end with /

#non configurable container! everything in src/environments/environment.ts relative to same host!

FROM docker.io/nginxinc/nginx-unprivileged:1.28.0-alpine-slim AS server
COPY --from=builder /app/dist/browser/ /usr/share/nginx/html/
COPY docker/default.conf /etc/nginx/conf.d/default.conf