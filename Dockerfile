# 1. Install dependencies
FROM node:18-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --frozen-lockfile

# 2. Build the Next.js app
FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 3. Final image to run the built app
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Only copy what's needed
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.ts ./next.config.ts

# Expose the Next.js port
EXPOSE 3000

# Start the Next.js server
CMD ["npm", "start"]