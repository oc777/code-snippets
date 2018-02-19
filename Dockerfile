FROM node

#LABEL maintainer="Olga Christensen oc222ba"

RUN mkdir /app
WORKDIR /app

RUN npm install -g nodemon

COPY package*.json ./
RUN npm install

RUN npm install nodemon -g

COPY . .
EXPOSE 3000

#CMD npm run devstart
CMD nodemon -L --watch . app.js
