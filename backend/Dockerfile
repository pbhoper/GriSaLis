FROM node:24.11.1 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --ignore-scripts --legacy-peer-deps

COPY . .
RUN npm run build

FROM node:24.11.1 AS runner

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production --ignore-scripts --legacy-peer-deps

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["npm", "run", "start:prod"]