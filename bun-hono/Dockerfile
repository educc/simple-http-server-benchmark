# Production Dockerfile for Bun + Hono app
FROM oven/bun:latest as base

WORKDIR /app

# Copy only package.json and bun.lock for dependency install
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --production

# Copy application source and views
COPY app.ts ./
COPY views ./views
COPY data.db ./

# Expose port (default for Hono/Bun apps is 3000)
EXPOSE 3000

# Start the app
CMD ["bun", "run", "app.ts"]
