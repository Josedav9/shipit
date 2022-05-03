FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000
EXPOSE 3001

RUN npm start
