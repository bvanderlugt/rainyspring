FROM node:9-alpine
WORKDIR /var/app
COPY package.json .
RUN npm i
COPY . .

ENTRYPOINT ["npm", "start"]
