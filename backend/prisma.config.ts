import { defineConfig } from "prisma/config";

export default defineConfig({
  // Prisma will automatically look for DATABASE_URL in process.env
  schema: "prisma/",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
