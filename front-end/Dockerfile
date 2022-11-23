# syntax=docker/dockerfile:1
FROM node:16-alpine
RUN apk add --no-cache python3 g++ make
WORKDIR /user/src/app
COPY . .
RUN npm install --production
EXPOSE 3000