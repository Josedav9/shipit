#!/bin/bash

echo "1. ===================> Creating network..."
docker network ls|grep shipit > /dev/null || docker network create --driver bridge shipit

echo "2. ===================> Building and Starting..."
 
if [[ $1 == "app" ]]; then
 docker-compose --profile app up -d --no-deps --build
 else
 docker-compose up -d --no-deps --build
fi

echo "3. ===================> Cleaning..."
docker image prune -f
docker container prune -f

echo "4. ===================> Finished"