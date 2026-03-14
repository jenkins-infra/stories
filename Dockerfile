# Use ARG to pass Node version from .tool-versions
ARG NODE_VERSION=${NODE_VERSION:-24.13.0}

FROM node:${NODE_VERSION}-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source
COPY . .

# Build Gatsby site
RUN npm run build

EXPOSE 8000

CMD ["npm", "run", "start"]
