FROM docker.io/node:20.19.1-alpine3.21 AS builder
WORKDIR /app/
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY angular.json .
COPY ./public/ ./public/
COPY ./src/ ./src/
COPY tsconfig.app.json .
COPY tsconfig.json .
COPY tsconfig.spec.json .
RUN npm run build -- --output-path dist/ --base-href /frontend

FROM docker.io/nginx:1.28.0-alpine-slim AS server