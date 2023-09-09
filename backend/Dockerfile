FROM node:18.7-alpine as dev

WORKDIR /app

COPY package*.json ./

RUN npm install

CMD ["npm", "run", "dev:watch"]


FROM node:20.5.0 as prod

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "migrate:prod"]