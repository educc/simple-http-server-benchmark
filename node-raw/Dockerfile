# Stage 1: Build stage
FROM node:22.15.1-slim as builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Stage 2: Production stage
FROM node:22.15.1-slim

# Create a non-root user
RUN groupadd -r nodejs && useradd -r -g nodejs nodejs

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Set proper permissions
RUN chown -R nodejs:nodejs /app

# Use non-root user
USER nodejs

# Expose the port the app runs on
EXPOSE 3000

# Environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Command to run the application
CMD ["node", "index.js"]