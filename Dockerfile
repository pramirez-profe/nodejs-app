FROM node:22 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . . 

FROM node:22-slim
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package.json ./
CMD ["node", "src/server.js"]

