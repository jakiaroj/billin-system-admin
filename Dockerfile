# ── Security notes ──────────────────────────────────────────────────────────
# • Only the official "node" image from Docker Hub is used (no third-party images).
# • Multi-stage build: build tools never reach the production image.
# • pnpm --frozen-lockfile: exact versions from pnpm-lock.yaml; no silent upgrades.
# • Final stage runs as the built-in unprivileged "node" user (uid 1000).
# • Base image is pinned to a digest (node:lts-alpine3.23@sha256:...) to prevent tag mutation.
# ────────────────────────────────────────────────────────────────────────────

# ── Stage 1: enable pnpm via corepack ────────────────────────────────────────
FROM node:lts-alpine3.23@sha256:2bdb65ed1dab192432bc31c95f94155ca5ad7fc1392fb7eb7526ab682fa5bf14 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ── Stage 2: install dependencies ────────────────────────────────────────────
FROM base AS dependencies
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,target=/pnpm/store \
    pnpm install --frozen-lockfile --prefer-offline

# ── Stage 3: build ───────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN pnpm run build

# ── Stage 4: production runner (minimal, no build tools) ────────────────────
FROM node:lts-alpine3.23@sha256:2bdb65ed1dab192432bc31c95f94155ca5ad7fc1392fb7eb7526ab682fa5bf14 AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Copy only what Next.js standalone needs to run
COPY --from=builder --chown=node:node /app/public ./public
RUN mkdir .next && chown node:node .next
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static

# Run as non-root
USER node

EXPOSE 3000
CMD ["node", "server.js"]
