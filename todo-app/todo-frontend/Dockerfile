FROM node:24 AS build-stage

WORKDIR /usr/src/app

COPY . .

RUN npm ci

RUN npm run test:run

# Vite inlines VITE_* vars into the bundle at build time, so this must be a
# build arg -- a runtime environment: entry in compose would be ignored
ARG VITE_BACKEND_URL=/api
ENV VITE_BACKEND_URL=$VITE_BACKEND_URL

RUN npm run build

FROM nginx:1.29-alpine

COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html