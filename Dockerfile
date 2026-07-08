FROM node:20-bookworm-slim AS build

WORKDIR /app
ARG VITE_API_URL=http://localhost:3000/api
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json quasar.config.js jsconfig.json postcss.config.js index.html ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/spa /usr/share/nginx/html

EXPOSE 80
