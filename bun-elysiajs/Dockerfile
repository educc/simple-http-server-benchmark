FROM oven/bun:1 AS base
WORKDIR /usr/src/app

# Install dependencies first, in a separate step to leverage Docker cache
COPY package.json bun.lockb* ./
RUN bun install --production

# Copy application code
COPY index.ts .
COPY views ./views

# Environment variables
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application
CMD ["bun", "run", "index.ts"]
