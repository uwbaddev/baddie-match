# syntax=docker/dockerfile:1
FROM node:16-alpine
RUN apk add --no-cache python3 g++ make
WORKDIR /app
COPY . .
RUN npm install --production
CMD ["npm", "run", "start"]
EXPOSE 3000