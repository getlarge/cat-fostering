# Build the docker image with `npx nx docker-build cat-fostering-api`.
# Tip: Modify "docker-build" options in project.json to change docker build args.
#
# Run the container with `docker run -e ORY_ACTION_API_KEY='hello' -e POSTGRES_URL='postgres://dbuser:secret@postgres:5432/appdb' --network cat-fostering_ory -p 3000:3000 -t ghcr.io/getlarge/cat-fostering/cat-fostering-api:latest`.

ARG NODE_VERSION=20.9.0

### optimize
FROM node:$NODE_VERSION AS optimize

WORKDIR /app

RUN echo "Building cat-fostering-api image with NODE_VERSION=$NODE_VERSION"

COPY ./apps/cat-fostering-api/package*.json ./
COPY --chown=node:node ./dist/apps/cat-fostering-api ./

RUN npm install --omit=dev -f --loglevel=error
RUN curl -sf https://gobinaries.com/tj/node-prune | sh
RUN node-prune

###
FROM node:$NODE_VERSION-alpine

USER node

ENV NODE_ENV=development
ENV HOST=0.0.0.0
ENV PORT=3000

WORKDIR /app

COPY --from=optimize /app ./

CMD ["node", "main.js"]
