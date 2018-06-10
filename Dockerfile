FROM node:9-alpine
COPY package.json .
RUN npm i
COPY . .

ENTRYPOINT ["npm", "start"]
