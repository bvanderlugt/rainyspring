# This does not work bc I have to figure out how to bind bluetooth to host
FROM node:9-alpine
WORKDIR /var/app
COPY package.json .
RUN npm i
COPY . .

# run with a cmd arg to change target hostname 
ENTRYPOINT ["node", "eddystoneURLForwarder.js"]
