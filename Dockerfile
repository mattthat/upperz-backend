FROM node:jessie
EXPOSE 8080/tcp

RUN mkdir -p /usr/local/app/release
WORKDIR /usr/local/app

COPY package.json package-lock.json portico*.tgz /usr/local/app/
COPY release/ /usr/local/app/release/
RUN npm install

WORKDIR /usr/local/app/release
CMD [ "node", "api-server.js" ]