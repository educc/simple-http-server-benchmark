#############
# Production-ready Dockerfile for Bun + TypeScript + SQLite + Eta
#############

# --- Stage 1: Builder ---
    FROM oven/bun:latest AS builder

    # Set working directory
    WORKDIR /app
    
    # Copy lockfile and manifest for deterministic installs
    COPY bun.lock package.json ./
    
    # Install all dependencies
    RUN bun install
    
    # Copy source code, views, and any migrations or DB files if needed
    COPY . .
    
    # Bundle/compile your index.ts entrypoint for Bun runtime
    # Specify target 'bun' so builtins (bun:sqlite, bun) resolve correctly
    RUN bun build index.ts --target bun --outfile dist/app.js
    
    
    # --- Stage 2: Runtime ---
    FROM oven/bun:alpine AS runner
    
    # Create non-root user for security
    RUN addgroup -S appgroup && adduser -S appuser -G appgroup
    USER appuser
    
    # Set working directory
    WORKDIR /app
    
    # Copy the built bundle and views directory
    COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
    COPY --from=builder --chown=appuser:appgroup /app/views ./views
    
    # Copy any existing SQLite database or let it be created at runtime
    # If you have migrations or a seed file, include them here
    COPY --from=builder --chown=appuser:appgroup /app/data.db ./data.db
    
    # Expose application port
    EXPOSE 3000
    
    # Environment variables
    ENV DB_FILE="data.db"
    ENV PORT=3000
    
    # Start the server via the bundled JS
    CMD ["bun", "run", "dist/app.js"]
    