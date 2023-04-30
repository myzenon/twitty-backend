FROM node:lts-alpine

RUN apk add --no-cache openssl1.1-compat

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

CMD ["yarn", "start"]

