FROM node:18.16.0

ENV NODE_ENV build
WORKDIR /usr/app

COPY . .

RUN yarn install --immutable --immutable-cache --check-cache && sleep 30

ENV NODE_ENV production

RUN yarn format && yarn lint
RUN yarn build

CMD ["dist/main.js"]
