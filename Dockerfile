FROM node:14-alpine

WORKDIR /opt/app
COPY package.json .
COPY package-lock.json .

RUN  npm install --ignore-scripts
RUN rm -f .npmrc

COPY . .

CMD ["npm", "run", "start"]

EXPOSE 3000