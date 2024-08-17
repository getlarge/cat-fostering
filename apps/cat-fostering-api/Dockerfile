# Build the docker image with `npx nx run cat-fostering-api:container`.
# Tip: Modify "container" options in project.json to change docker build args.
#
# Run the container with `docker run -e ORY_ACTION_API_KEY='hello' -e POSTGRES_URL='postgres://dbuser:secret@postgres:5432/appdb' --network cat-fostering_ory -p 3000:3000 -t getlarge/cat-fostering-api:latest`.

ARG NODE_VERSION=20.9.0

### Dependency installation
FROM node:$NODE_VERSION AS deps
ARG APP_NAME=cat-fostering-api

WORKDIR /app

RUN echo "Building ${APP_NAME} image with NODE_VERSION=$NODE_VERSION"

COPY ./dist/apps/${APP_NAME}/package*.json ./

RUN npm install --omit=dev -f --loglevel=error
RUN curl -sf https://gobinaries.com/tj/node-prune | sh
RUN node-prune

###
FROM node:$NODE_VERSION-alpine
ARG APP_NAME=cat-fostering-api

USER node

ENV NODE_ENV=development
ENV HOST=0.0.0.0
ENV PORT=3000

WORKDIR /app

COPY --from=deps /app ./
COPY --chown=node:node ./dist/apps/${APP_NAME} ./

CMD ["node", "main.js"]
