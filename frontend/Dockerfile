FROM node:20.5.0

WORKDIR /app

COPY package*.json ./

RUN npm install

EXPOSE 3000


CMD ["npm", "run", "dev"]
