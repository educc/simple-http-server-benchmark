# Use official Node.js 22 LTS image as the base
FROM node:22-alpine AS base

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json (if present)
COPY package.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy application source code
COPY server.js ./
COPY views ./views
COPY data.db ./

# Expose the port (change if your app uses a different port)
EXPOSE 3000

# Set NODE_ENV to production
ENV NODE_ENV=production

# Start the server
CMD ["node", "server.js"]
