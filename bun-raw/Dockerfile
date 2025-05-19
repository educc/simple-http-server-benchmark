# --- Stage 1: Builder ---
FROM oven/bun:latest AS builder

WORKDIR /app

COPY bun.lock package.json ./

RUN bun install

COPY . .

RUN bun build index.ts --target bun --outfile dist/app.js


# --- Stage 2: Runtime ---
FROM oven/bun:alpine AS runner


WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/views ./views


EXPOSE 3000

CMD ["bun", "run", "dist/app.js"]
