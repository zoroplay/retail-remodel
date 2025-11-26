#!/usr/bin/env bash

set -e  # Exit on any error

# Change to correct directory..
cd ~/pos-web-1

# Rename .env file to avoid Docker Compose parsing issues
# All environment variables are defined in docker-compose.yml
if [ -f .env ]; then
    mv .env .env.backup
fi

# Create network if it doesn't exist
docker network create sbenet || true

# Stop existing containers
docker compose down || true

# Pull latest images
docker compose pull

# Start services
docker compose up -d

# Show running containers
docker ps

echo "Deployment completed successfully"

     
