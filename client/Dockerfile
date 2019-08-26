FROM node:10.15.0-alpine
EXPOSE 3000

COPY ./entrypoint.sh entrypoint.sh

RUN npm i -g react-scripts

ENTRYPOINT sh ./entrypoint.sh