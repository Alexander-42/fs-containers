FROM node:24

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci

ENV DEBUG=express:*

CMD ["npm", "start"]
