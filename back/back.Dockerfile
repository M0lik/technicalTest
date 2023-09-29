# syntax=docker/dockerfile:1.2
 
 FROM node:19
 
 WORKDIR /usr/src/app
 
 COPY . .
 
 RUN npm install
   
 EXPOSE 3000
 
 RUN apt-get update && apt-get install curl -y
 
 CMD [ "npm","run", "start:dev"]