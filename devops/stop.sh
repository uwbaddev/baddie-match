#!/bin/bash

# Suspends containers, saves system resources

echo Stopping containers 
docker-compose -f docker-dev.yml stop 