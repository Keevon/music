#!/bin/sh

if [ "$NODE_ENV" == "production" ] ; then
  npm ci
  npm run start
else
  echo "Starting dev..."
  npm i
  npm run start
fi
