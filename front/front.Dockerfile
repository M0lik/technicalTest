# syntax=docker/dockerfile:1.2
 
 FROM node:19
 
 WORKDIR /usr/src/app
 
 COPY . .
 
 RUN npm install
   
 EXPOSE 3001
 
 RUN apt-get update && apt-get install curl -y
 
 CMD [ "npm","run", "start"]