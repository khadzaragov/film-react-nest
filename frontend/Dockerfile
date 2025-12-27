FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM alpine:3.20

WORKDIR /app

COPY --from=build /app/dist ./dist

CMD ["sh", "-c", "cp -r /app/dist/. /frontend-dist/ && echo 'Frontend build copied' && tail -f /dev/null"]
