FROM node:20-alpine
RUN npm install -g pnpm@10
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY . .

EXPOSE 3000
CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && npx ts-node --project tsconfig.scripts.json --transpile-only prisma/seed.ts && pnpm run start:dev"]
