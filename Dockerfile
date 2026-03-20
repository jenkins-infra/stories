# Use ARG to pass Node version from .tool-versions
ARG NODE_VERSION=${NODE_VERSION:-24.13.0}

FROM node:${NODE_VERSION}-slim 

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source
COPY . .

EXPOSE 8000

CMD ["npm", "run", "develop", "--", "--host", "0.0.0.0"]
