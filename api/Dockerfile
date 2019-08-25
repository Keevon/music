FROM node:10.15.0-alpine
EXPOSE 3001 9229

COPY ./entrypoint.sh entrypoint.sh

RUN apk add --no-cache gettext librsvg ghostscript imagemagick

ENTRYPOINT sh ./entrypoint.sh
