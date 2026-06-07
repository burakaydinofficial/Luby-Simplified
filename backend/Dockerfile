FROM node:20-alpine
WORKDIR /app

# Prisma's query engine needs openssl on Alpine.
RUN apk add --no-cache openssl

# Install dependencies (cached unless package files change).
COPY package.json package-lock.json* ./
RUN npm install

# Generate the Prisma client for this platform.
COPY prisma ./prisma
RUN npx prisma generate

# App source + audio library.
COPY tsconfig.json ./
COPY src ./src
COPY media ./media

EXPOSE 4000

# On startup: sync schema to the DB, seed the catalog (idempotent), then serve.
CMD ["sh", "-c", "npx prisma db push --skip-generate && npm run seed && npm start"]
