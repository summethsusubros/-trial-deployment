FROM node

RUN npm install -g redis

RUN npm install -g redis-promisify

WORKDIR /app

COPY package.json .

RUN npm install

COPY . . 

EXPOSE 3000

CMD ["node", "app.js"]


 
