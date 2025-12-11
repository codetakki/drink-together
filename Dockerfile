# -----------------------------------------
# Stage 1: Build Vue frontend
# -----------------------------------------
FROM node:20 AS build-frontend
WORKDIR /app/client

COPY client/package*.json ./
RUN npm install

COPY client/ .
RUN npm run build


# -----------------------------------------
# Stage 2: Build NestJS backend
# -----------------------------------------
FROM node:20 AS build-backend
WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm install --production=false

COPY backend/ .
RUN npm run build


# -----------------------------------------
# Stage 3: Runtime (Node + Nginx)
# -----------------------------------------
FROM node:20 AS runtime

# Install Nginx
RUN apt-get update \
    && apt-get install -y nginx \
    && apt-get clean

# Configure backend
WORKDIR /app/backend
COPY --from=build-backend /app/backend/dist ./dist
COPY --from=build-backend /app/backend/node_modules ./node_modules

# Configure frontend
COPY --from=build-frontend /app/client/dist /usr/share/nginx/html

# Copy Nginx reverse proxy config
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start backend + nginx
CMD node /app/backend/dist/main.js & nginx -g "daemon off;"
