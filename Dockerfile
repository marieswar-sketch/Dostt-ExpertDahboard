FROM node:22-alpine

WORKDIR /app

# Install deps without running any scripts (avoids postinstall failing before source exists)
COPY package*.json ./
RUN npm ci --ignore-scripts

# Copy all source files
COPY . .

# Build Next.js (source is now available)
RUN npm run build

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV NODE_ENV=production

CMD ["node", "index.js"]
