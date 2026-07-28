FROM node:24-alpine

WORKDIR /usr/src/app

# Copy manifests first so the dependency layer stays cached across source changes
COPY --chown=node:node package*.json ./

RUN npm ci --omit=dev

COPY --chown=node:node . .

ENV NODE_ENV=production

USER node

EXPOSE 3000

CMD ["npm", "start"]
