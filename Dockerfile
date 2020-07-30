FROM node:14-alpine3.12

LABEL authors="Kunmyon Choi" desc="My Sample nodejs app"

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY dist ./dist

EXPOSE 8080

CMD ["npm", "start"]