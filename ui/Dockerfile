FROM node:14-alpine

WORKDIR /opt/app
COPY package*.json ./

RUN npm install --production

COPY . .

CMD ["npm", "run", "start"]

EXPOSE 3000