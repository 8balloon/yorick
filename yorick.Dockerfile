# FROM alpine # TODO
FROM node
WORKDIR /usr/src/app

# TODO: fancy `yarn cache dir` stuff? https://stackoverflow.com/questions/43473236/docker-build-arg-and-copy
COPY package*.json ./
RUN yarn

COPY . .
