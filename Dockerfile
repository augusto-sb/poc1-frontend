FROM docker.io/node:20.19.1-alpine3.21 AS builder

FROM docker.io/nginx:1.27.5-alpine-slim AS server