#!/bin/sh

until cd /api
do
    echo "Waiting for mount..."
    sleep 2
done

sh -c "/api/scripts/start.sh"