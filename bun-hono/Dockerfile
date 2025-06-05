# Production Dockerfile for Bun + Hono app
FROM oven/bun:1.2 as base

WORKDIR /app

# Copy only package.json for dependency install
COPY package.json ./

# Install dependencies
RUN bun install --production

# Copy application source, views, and database
COPY app.tsx ./
COPY views ./views
# COPY data.db ./
COPY tsconfig.json ./

# Expose port (default for Hono/Bun apps is 3000)
EXPOSE 3000

# Start the app
CMD ["bun", "start"]
