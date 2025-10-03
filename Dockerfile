# syntax=docker/dockerfile:1

# Base image version is configurable
ARG NODE_VERSION=22

# --- Dependencies for development (includes dev deps) ---
FROM node:${NODE_VERSION}-alpine AS deps
WORKDIR /app
# Build tools for native modules like bcrypt
RUN apk add --no-cache python3 make g++
COPY package*.json ./
# Prefer reproducible installs if lockfile exists
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

# --- Dependencies for production (omit dev deps) ---
FROM node:${NODE_VERSION}-alpine AS prod-deps
WORKDIR /app
RUN apk add --no-cache python3 make g++
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev; else npm install --omit=dev; fi

# --- Development image ---
FROM node:${NODE_VERSION}-alpine AS development
WORKDIR /app
ENV NODE_ENV=development
COPY --from=deps /app/node_modules /app/node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]

# --- Production image ---
FROM node:${NODE_VERSION}-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY . .
EXPOSE 3000
CMD ["npm", "start"]