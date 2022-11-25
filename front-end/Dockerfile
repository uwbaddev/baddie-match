# syntax=docker/dockerfile:1
FROM node:16-alpine AS builder
RUN apk add --no-cache python3 g++ make
WORKDIR /app
COPY package.json .
RUN npm install --production
COPY . .
RUN npm run build
RUN touch "/app/build/.env"
RUN echo REACT_APP_DOMAIN_NAME=$REACT_APP_DOMAIN_NAME > "/app/build/.env"

FROM nginx:1.21.0-alpine as production
ENV NODE_ENV production
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
ENV domain_name=$REACT_APP_DOMAIN_NAME
# CMD ["nginx", "-g", "daemon off;"]