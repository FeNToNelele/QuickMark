# Build

FROM node:20 AS builder

WORKDIR /app

COPY . .

RUN npm install && npm run build

# Server static files

FROM node:20 AS runner

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist .

EXPOSE 3000

CMD ["serve", "-s", ".", "-l", "3000"]