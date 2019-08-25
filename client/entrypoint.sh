#!/bin/sh

until cd /client
do
    echo "Waiting for mount..."
    sleep 2
done

sh -c "/client/scripts/start.sh"