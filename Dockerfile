# syntax=docker/dockerfile:1.4

# --- Base Stage ---
FROM oven/bun:latest AS base
ARG PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# --- Dependencies Stage ---
FROM base AS deps
# Copy package.json and lock files first to optimize caching.
COPY package.json bun.lock ./

# Install dependencies using bun
RUN bun install --frozen-lockfile

# --- Builder Stage ---
FROM base AS builder
WORKDIR /app

# Copy node_modules from the 'deps' stage.
COPY --from=deps /app/node_modules ./node_modules

# Copy the rest of the application source code.
COPY . .

# Build the Next.js application using bun
RUN bun run build

# --- Runner Stage ---
FROM base AS runner
WORKDIR /app

# Copy only the necessary files from the 'builder' stage.
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/static ./.next/static

# Expose the port the Next.js application will run on.
EXPOSE ${PORT}

# Set the hostname to 0.0.0.0 to make the server accessible from outside the container.
ENV HOSTNAME="0.0.0.0"

# Command to start the Next.js production server with bun.
CMD ["bun", "server.js"]
