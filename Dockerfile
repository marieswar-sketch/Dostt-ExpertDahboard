FROM node:22-alpine AS base

# Install dependencies only
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/sql ./sql
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Run DB init then start the app
CMD ["sh", "-c", "node scripts/init-db.js && node server.js"]
