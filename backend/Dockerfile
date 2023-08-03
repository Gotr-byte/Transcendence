FROM node:20.5.0 as dev

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001
EXPOSE 5555

CMD ["npm", "run", "dev:watch"]


FROM node:20.5.0 as prod

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3001
EXPOSE 5555

CMD ["npm", "run", "migrate:prod"]