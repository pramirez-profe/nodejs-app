FROM node:22 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . . 
RUN npm prune --production

FROM node:22-slim
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./
CMD ["node", "src/server.js"]

