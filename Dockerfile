FROM node:14-alpine


RUN mkdir -p /home/node/app/node_modules


WORKDIR /home/node/app/


COPY package*.json /home/node/app/


RUN npm install


COPY . .


EXPOSE 3000


CMD ["node", "--no-warnings", "--experimental-modules", "--es-module-specifier-resolution=node", "server.js"]