# Multi-stage build for production-ready Remix app with better-sqlite3

# Build stage
FROM node:22-alpine AS builder

# Set the working directory
WORKDIR /app

# Install system dependencies needed for building native modules and app
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    curl

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for building)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine AS production

# Install runtime dependencies and curl for health check
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    curl \
    dumb-init

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S remix -u 1001 -G nodejs

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public

# Copy database file
#COPY data.db ./data.db

# Copy the views directory for eta templates
COPY app/views ./app/views

# Change ownership of the app directory to the remix user
RUN chown -R remix:nodejs /app

# Switch to non-root user
USER remix

# Expose the port the app runs on
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000


# Start the application
CMD ["npm", "start"]