FROM node:18.16.0

ENV NODE_ENV build
WORKDIR /usr/app

COPY . .

RUN yarn install

ENV NODE_ENV production

RUN yarn format && yarn lint
RUN yarn build

CMD ["dist/src/main.js"]
