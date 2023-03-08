#!/bin/bash

# Initial Setup Script 

FILE=.env
if test -f "$FILE"; then
    echo "$FILE found."
else 
    echo "Halting, $FILE not found."
    exit
fi

echo Building Images
docker-compose -f docker-dev.yml build 

echo Starting Containers 
docker-compose -f docker-dev.yml up -d

echo Creating Tables
docker exec app python3 app/scripts/createTables.py

echo Adding prod data 
docker exec app python3 -m app.scripts.add_prod_data

# use for quick copy and paste while script is broken
# python3 app/scripts/createTables.py && python3 -m app.scripts.add_prod_data 