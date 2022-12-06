# syntax=docker/dockerfile:1

# Creates our Production Image 

# Create front-end static build
FROM node:16-alpine AS builder
RUN apk add --no-cache python3 g++ make
WORKDIR /fe
COPY ./front-end/package.json .
RUN npm install --production
COPY ./front-end .
RUN npm run build

# Create Backend, and move static build into /build dir
FROM python:3.8-slim-buster
ENV WORKDIR=/user/src/app
RUN mkdir -p $WORKDIR
COPY "./app/requirements.txt" .
RUN apt-get update 
RUN apt-get -y install libpq-dev gcc 
RUN pip3 install -r requirements.txt
COPY "./app" $WORKDIR
WORKDIR /user/src/
COPY "./app/config.py" /user/src/
COPY "./app/gunicorn.sh" /user/src/
COPY --from=builder /fe/build /user/src/build
ENTRYPOINT ["./gunicorn.sh"]

# Port is supplied by heroku
EXPOSE $PORT

