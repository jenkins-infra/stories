# Build stage
FROM node:24.0.0-alpine AS builder
WORKDIR /app

# ---- Gatsby stability env vars ----
ENV NODE_OPTIONS="--max-old-space-size=2048" \
    GATSBY_CPU_COUNT=2 \
    GATSBY_EXPERIMENTAL_PAGE_BUILD_ON_DATA_CHANGES=true \
    GATSBY_TELEMETRY_DISABLED=1 \
    CI=true

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Optional: ensure clean cache
RUN rm -rf .cache public

RUN npm run build

# Production stage
FROM nginx:1.26.2-alpine-slim

# Switch to root to modify nginx config and set permissions
USER root

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy site files
COPY --from=builder /app/public /usr/share/nginx/html

# Add non-root user for security and set permissions
RUN adduser -D appuser \
    && mkdir -p /var/cache/nginx /var/run /var/log/nginx \
    && chown -R appuser:appuser /var/cache/nginx /var/run /var/log/nginx

USER appuser

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
