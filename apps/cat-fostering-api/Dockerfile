ARG NODE_VERSION=20.9.0

### optimize
FROM node:$NODE_VERSION AS optimize

WORKDIR /app

COPY ./apps/cat-fostering-api/package*.json ./

RUN npm install --loglevel=error
# to reduce image size
RUN curl -sf https://gobinaries.com/tj/node-prune | sh
RUN node-prune

COPY --chown=node:node ./dist/apps/cat-fostering-api ./

###
FROM node:$NODE_VERSION-alpine

USER node

ENV NODE_ENV=development
ENV PORT=3000
ENV GLOBAL_API_PREFIX=api

WORKDIR /app

COPY --from=optimize /app ./

CMD ["node", "main.js"]
