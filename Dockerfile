FROM node:18-alpine

WORKDIR /back-end

COPY . .

RUN npm install

EXPOSE 3000

CMD ["npm", "run", "start:dev"]