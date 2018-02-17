FROM node

LABEL maintainer="Olga Christensen oc222ba"

RUN apt-get update -qq && apt-get install -y build-essential libpq-dev libkrb5-dev

RUN mkdir /app
WORKDIR /app

COPY package.json /app
RUN npm install

COPY . /app
EXPOSE 8000
CMD ["npm", "start"]
