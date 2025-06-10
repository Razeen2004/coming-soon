# 1. Base image for dependencies
FROM node:18-alpine AS deps
WORKDIR /app

# Install dependencies (only package.json & lock first for caching)
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN npm install

# 2. Build your application
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3. Serve the built app using Next.js server
FROM node:18-alpine AS runner
WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Port (default is 3000)
EXPOSE 3000

CMD ["npm", "start"]
