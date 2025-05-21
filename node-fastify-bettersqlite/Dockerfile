FROM node:22-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

COPY . .

# Final stage
FROM node:22-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/index.js ./index.js
COPY --from=builder /usr/src/app/views ./views

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD [ "node", "index.js" ]
