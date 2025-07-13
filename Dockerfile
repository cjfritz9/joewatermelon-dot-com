FROM node:22-alpine

WORKDIR /

COPY package*.json ./
COPY /server /server

RUN ["npm", "run", "install:deploy"]

ENV PORT=8080

EXPOSE 8080

CMD ["npm", "run", "deploy"]