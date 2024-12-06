FROM node:20-slim

WORKDIR /app
COPY web/ /app
RUN mkdir /api-client
COPY api-client/ /api-client/

RUN cd /api-client && npm install && cd /app
RUN npm install
RUN npm link /api-client
RUN npm run build

CMD ["npm", "start"]

EXPOSE 3006