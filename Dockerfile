FROM node:22-bookworm-slim

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 8000

CMD ["npm", "run", "develop", "--", "--host", "0.0.0.0", "--port", "8000"]
