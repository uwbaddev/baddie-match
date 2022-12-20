#!/bin/bash

# restarts containers 

echo Stopping containers 
docker-compose -f docker-dev.yml stop 

echo Starting Containers 
docker-compose -f docker-dev.yml start