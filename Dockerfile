FROM node

<<<<<<< HEAD
#LABEL maintainer="Olga Christensen oc222ba"
=======
LABEL maintainer="Olga Christensen oc222ba"

RUN apt-get update -qq && apt-get install -y build-essential libpq-dev libkrb5-dev
>>>>>>> fb0c383c471165900205138fca45eb0ca56a750d

RUN mkdir /app
WORKDIR /app

<<<<<<< HEAD
RUN npm install -g nodemon

COPY package*.json ./
RUN npm install

RUN npm install nodemon -g

COPY . .
EXPOSE 3000

#CMD npm run devstart
CMD nodemon -L --watch . app.js
=======
COPY package.json /app
RUN npm install

COPY . /app
EXPOSE 8000
CMD ["npm", "start"]
>>>>>>> fb0c383c471165900205138fca45eb0ca56a750d
