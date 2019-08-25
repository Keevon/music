#!/bin/sh

if [ "$NODE_ENV" == "production" ] ; then
  npm ci
  npm run build
  npm run start
else
  echo "Starting dev..."
  npm i
  npm run dev
fi
