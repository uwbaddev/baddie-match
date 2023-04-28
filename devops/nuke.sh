#!/bin/bash

# Removes all containers, all images, everything
# Use only if there a severe error in your dev env that cannot be fixed

echo Stopping all containers
docker-compose -f docker-dev.yml stop

echo Removing all containers 
docker-compose -f docker-dev.yml down

echo Removing all images 
docker system prune -a

echo Removing DB 
sudo rm -r -f db

