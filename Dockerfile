# ---------- Base ----------
FROM node:20-alpine AS base
RUN npm install -g pnpm@10
WORKDIR /app

# ---------- Build ----------
FROM base AS build
# prisma.config.ts exige DIRECT_URL mesmo em "prisma generate"/postinstall,
# que não tocam o banco. O placeholder é suficiente; a URL real é injetada
# em runtime via variáveis de ambiente do deploy.
ARG DIRECT_URL="postgresql://placeholder:placeholder@localhost:5432/music_research"
ENV DIRECT_URL=$DIRECT_URL
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY prisma ./prisma
COPY prisma.config.ts ./
RUN pnpm exec prisma generate
COPY . .
RUN pnpm run build

# ---------- Production ----------
FROM base AS production
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
COPY --from=build /app/prisma.config.ts ./
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["sh", "-c", "pnpm exec prisma migrate deploy && node dist/src/main"]
