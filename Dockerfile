FROM node

#LABEL maintainer="Olga Christensen oc222ba"

RUN mkdir /app
WORKDIR /app

RUN npm install -g nodemon

COPY package.json .
RUN npm install
COPY . .
RUN ls -a
EXPOSE 3000

#CMD npm run devstart
CMD nodemon --inspect=0.0.0.0:3838 -L --watch . app.js
