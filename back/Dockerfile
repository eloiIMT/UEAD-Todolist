FROM node:20-slim

WORKDIR /app
COPY . /app

RUN npm install
RUN npm run build:ts

CMD ["npm", "start"]

EXPOSE 3000