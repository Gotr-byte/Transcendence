FROM node:20.5.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN yarn prisma generate

EXPOSE 3001

CMD ["npm", "run", "start:dev"]