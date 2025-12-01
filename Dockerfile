# Base stage
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json pnpm-lock.yaml* ./

# Development stage
FROM base AS development
RUN npm ci
COPY . .
EXPOSE 3000 24678
CMD ["npm", "run", "dev"]

# Build stage
FROM base AS build

# Build arguments for environment variables
ARG VITE_APP_API_BASE_URL=https://api.staging.sportsbookengine.com/api/v2
ARG VITE_APP_CLIENT_ID=4
ARG VITE_APP_MQTT_URI="wss://emqx.sportsbookengine.com/mqtt"
ARG VITE_APP_MQTT_USERNAME="ui"
ARG VITE_APP_MQTT_PASSWORD="sportsbook123"
ARG VITE_APP_MQTT_CLIENTID="cubebet_m"
ARG VITE_APP_SITE_KEY=SBE

# Set environment variables for build
ENV VITE_APP_API_BASE_URL=$VITE_APP_API_BASE_URL
ENV VITE_APP_CLIENT_ID=$VITE_APP_CLIENT_ID
ENV VITE_APP_MQTT_URI=$VITE_APP_MQTT_URI
ENV VITE_APP_MQTT_USERNAME=$VITE_APP_MQTT_USERNAME
ENV VITE_APP_MQTT_PASSWORD=$VITE_APP_MQTT_PASSWORD
ENV VITE_APP_MQTT_CLIENTID=$VITE_APP_MQTT_CLIENTID
ENV VITE_APP_SITE_KEY=$VITE_APP_SITE_KEY

RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine AS production

# Install wget for healthcheck
RUN apk add --no-cache wget

# Copy built assets
COPY --from=build /app/build /usr/share/nginx/html

# Create optimized nginx configuration for SPA
RUN echo 'server {' > /etc/nginx/conf.d/default.conf && \
    echo '    listen 8080;' >> /etc/nginx/conf.d/default.conf && \
    echo '    server_name localhost;' >> /etc/nginx/conf.d/default.conf && \
    echo '    root /usr/share/nginx/html;' >> /etc/nginx/conf.d/default.conf && \
    echo '    index index.html;' >> /etc/nginx/conf.d/default.conf && \
    echo '    gzip on;' >> /etc/nginx/conf.d/default.conf && \
    echo '    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;' >> /etc/nginx/conf.d/default.conf && \
    echo '    location / {' >> /etc/nginx/conf.d/default.conf && \
    echo '        try_files $uri $uri/ /index.html;' >> /etc/nginx/conf.d/default.conf && \
    echo '        add_header X-Frame-Options "SAMEORIGIN" always;' >> /etc/nginx/conf.d/default.conf && \
    echo '        add_header X-Content-Type-Options "nosniff" always;' >> /etc/nginx/conf.d/default.conf && \
    echo '    }' >> /etc/nginx/conf.d/default.conf && \
    echo '    location /assets/ {' >> /etc/nginx/conf.d/default.conf && \
    echo '        expires 1y;' >> /etc/nginx/conf.d/default.conf && \
    echo '        add_header Cache-Control "public, immutable";' >> /etc/nginx/conf.d/default.conf && \
    echo '    }' >> /etc/nginx/conf.d/default.conf && \
    echo '}' >> /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]