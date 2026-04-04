# --- STAGE 1: Build ---
FROM node:24-alpine AS builder
WORKDIR /usr/src/app

# Install pnpm globally
RUN npm install -g pnpm@latest

# Copy dependency manifests and prisma schema first for better caching
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma/

# Install all dependencies (including devDependencies for compilation)
RUN pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Generate Prisma Client and compile TypeScript to JavaScript
RUN pnpm prisma generate
RUN pnpm build

# --- STAGE 2: Runner ---
FROM node:24-alpine AS runner
WORKDIR /usr/src/app

# Security: Create a non-root user for production
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

ENV NODE_ENV=production

# Install pnpm to handle production runtime tasks if needed
RUN npm install -g pnpm@latest

# Copy only the necessary artifacts from the builder stage
COPY --from=builder /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/pnpm-lock.yaml ./
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/prisma ./prisma

# Change ownership of the app directory to the non-root user
RUN chown -R appuser:appgroup /usr/src/app

# Switch to the non-root user
USER appuser

EXPOSE 3000

# Run the compiled application
# Note: Database migrations should be handled via 'prisma migrate deploy' in CI/CD pipelines
CMD ["node"]