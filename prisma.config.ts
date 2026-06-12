import "dotenv/config"
import { defineConfig, env } from "prisma/config"

export default defineConfig({
  engine: "classic",
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "ts-node --project tsconfig.scripts.json --transpile-only prisma/seed.ts",
  },
  datasource: {
    url: env("DIRECT_URL"),
  },
})
