import { defineConfig } from "prisma/config";

const postgresUser = process.env["POSTGRES_USER"] ?? "user_sb";
const postgresPassword = process.env["POSTGRES_PASSWORD"] ?? "password_sb";
const postgresDb = process.env["POSTGRES_DB"] ?? "smart_buffet_db";
const postgresHost = process.env["POSTGRES_HOST"] ?? "localhost";
const postgresPort = process.env["POSTGRES_PORT"] ?? "5432";

const databaseUrl =
  process.env["DATABASE_URL"] ||
  `postgresql://${postgresUser}:${postgresPassword}@${postgresHost}:${postgresPort}/${postgresDb}?schema=public`;

export default defineConfig({
  // Multi-file schema: all *.prisma files inside prisma/schema/ are merged.
  // schema.prisma (inside that folder) holds the generator + datasource blocks.
  schema: "prisma/schema/",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
