#!/bin/bash

# Deployment script for maxbet-retail
set -e

echo "Starting deployment..."

# Navigate to project directory
cd ~/betcruz-retail

# Set default PORT if not exists
export PORT=${PORT:-8042}

# Pull latest images
echo "Pulling latest Docker images..."
docker compose pull

# Stop existing containers
echo "Stopping existing containers..."
docker compose down

# Start new containers
echo "Starting new containers..."
docker compose up -d

# Clean up old images
echo "Cleaning up old Docker images..."
docker image prune -f

echo "Deployment completed successfully!"