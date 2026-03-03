# Development: Node only (gatsby develop with hot reload)
FROM node:24.0.0-alpine

WORKDIR /app

ENV NODE_OPTIONS="--max-old-space-size=2048" \
    GATSBY_CPU_COUNT=2 \
    GATSBY_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Bind to 0.0.0.0 so the dev server is reachable from the host
EXPOSE 8000
CMD ["npm", "run", "develop", "--", "-H", "0.0.0.0"]
