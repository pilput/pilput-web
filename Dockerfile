# Use the official Bun Alpine image as base
FROM oven/bun:alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/oven-sh/bun to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat curl
WORKDIR /app

# Copy lockfile and package files
COPY bun.lock ./
COPY package.json ./
# Install all dependencies (including dev dependencies for build)
RUN bun install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the application
RUN bun run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user
RUN addgroup --system --gid 1001 bunjs
RUN adduser --system --uid 1001 bunjs

# Copy the built application
COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown bunjs:bunjs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=bunjs:bunjs /app/.next/standalone ./
COPY --from=builder --chown=bunjs:bunjs /app/.next/static ./.next/static

USER bunjs

# Expose the port the app runs on
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application with Bun
CMD ["bun", "server.js"]
