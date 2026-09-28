FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

ENV NODE_ENV=development
ENV WATCHPACK_POLLING=true

CMD ["npm", "run", "dev"]
