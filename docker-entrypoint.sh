#!/bin/bash

# Start Nginx in the background
nginx -g 'daemon off;' &

# Wait a moment for Nginx to start (optional, but safe)
sleep 1

# Start the NestJS application (in the foreground so the container stays alive)
# Assuming your start script is 'npm start' and it runs on port 3000
echo "Starting NestJS server..."
cd /app/server
npm start

# If you use 'node dist/main.js' directly, use this instead:
# node dist/main.js