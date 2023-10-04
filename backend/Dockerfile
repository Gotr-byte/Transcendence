FROM node:20.6.1 as dev

WORKDIR /app

COPY package*.json ./

RUN npm install

CMD ["npm", "run", "dev:watch"]


FROM node:20.6.1 as prod

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "migrate:prod"]